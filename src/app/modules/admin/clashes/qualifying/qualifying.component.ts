import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {QualifyingService} from "./qualifying.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormBuilder, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup, Validators} from "@angular/forms";
import {EventService} from "../event.service";
import {RoundService} from "../round.service";
import {CategoryService} from "../category.service";
import {Event} from "../event.types";
import {Round} from "../round.types";
import {Category} from "../category.types";
import {RoundCategoryPilotsQualifying} from "./qualifying.types";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {ToastrService} from "ngx-toastr";
import {MatSlideToggle, MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
    selector: 'app-qualifying',
    templateUrl: './qualifying.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatTooltip,
        MatSlideToggleModule,
    ]
})
export class QualifyingComponent implements OnInit {
    currentDate = new Date();
    filtersForm: UntypedFormGroup;
    qualifyingForm: UntypedFormGroup;
    events: Event[];
    rounds: Round[];
    categories: Category[];
    roundCategoryPilotsQualifying: RoundCategoryPilotsQualifying[];

    constructor(
        private qualifyingService: QualifyingService,
        private eventService: EventService,
        private roundService: RoundService,
        private categoryService: CategoryService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private title: Title
    ) {
        this.title.setTitle('Qualifications • Viking Cup admin');
    }

    ngOnInit(): void
    {
        this.filtersForm = this.formBuilder.group({
            eventId: [null, Validators.required],
            roundId: [null, Validators.required],
            categoryId: [null, Validators.required],
            pilot: [null],
        });

        this.qualifyingForm = this.formBuilder.group({
            pilotsQualifying: this.formBuilder.array([])
        });

        this.filtersForm.valueChanges.subscribe(() => {
            const roundId = this.filtersForm.get('roundId').value;
            const categoryId = this.filtersForm.get('categoryId').value;
            const pilot = this.filtersForm.get('pilot').value;

            if (!roundId || !categoryId) {
                return;
            }

            this.qualifyingService.getRoundCategoryPilotsQualifying(roundId, categoryId, pilot).subscribe({
                next: (roundCategoryPilotsQualifying) => {
                    this.roundCategoryPilotsQualifying = roundCategoryPilotsQualifying;
                    (this.qualifyingForm.get('pilotsQualifying') as UntypedFormArray).clear();

                    roundCategoryPilotsQualifying.forEach((pilotQualifying) => {
                        const pilotQualifyingForm = this.formBuilder.group({
                            id: [pilotQualifying.id],
                            pilotId: [pilotQualifying.pilot.id],
                            pilotFirstName: [pilotQualifying.pilot.firstName],
                            pilotLastName: [pilotQualifying.pilot.lastName],
                            isCompeting: [pilotQualifying.isCompeting, Validators.required],
                            qualifs: this.formBuilder.array([])
                        });

                        pilotQualifyingForm.get('isCompeting').valueChanges.subscribe(() => this.saveQualifying());

                        if (pilotQualifying.qualifyings.length > 0) {
                            pilotQualifying.qualifyings.forEach((qualifying) => {
                                const pilotQualif = this.formBuilder.group({
                                    points: [qualifying.points, Validators.required],
                                    passage: [qualifying.passage, Validators.required]
                                });

                                (pilotQualifyingForm.get('qualifs') as UntypedFormArray).push(pilotQualif);

                                if (pilotQualifying.qualifyings.length === 1) {
                                    const pilotQualif = this.formBuilder.group({
                                        points: [null, Validators.required],
                                        passage: [qualifying.passage === 1 ? 2 : 1, Validators.required]
                                    });

                                    (pilotQualifyingForm.get('qualifs') as UntypedFormArray).push(pilotQualif);
                                }
                            });
                        } else {
                            for (let i = 1; i <= 2; i++) {
                                const pilotQualif = this.formBuilder.group({
                                    points: [null, Validators.required],
                                    passage: [i, Validators.required]
                                });

                                (pilotQualifyingForm.get('qualifs') as UntypedFormArray).push(pilotQualif);
                            }
                        }

                        // sort qualifs by passage
                        (pilotQualifyingForm.get('qualifs') as UntypedFormArray).controls.sort((a, b) => a.get('passage').value - b.get('passage').value);

                        (this.qualifyingForm.get('pilotsQualifying') as UntypedFormArray).push(pilotQualifyingForm);
                    })
                    console.log(this.qualifyingForm.getRawValue());
                    console.log(roundCategoryPilotsQualifying);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        });

        this.getEvents();
        this.getCategories();
    }

    getEvents()
    {
        this.eventService.getEvents().subscribe({
            next: (events) => {
                this.events = events;

                // update filters form with the first event which year is not past
                let currentEvent = events.find(event => event.year >= this.currentDate.getFullYear());
                if (!currentEvent) {
                    currentEvent = events[events.length - 1];
                }
                this.filtersForm.get('eventId').setValue(currentEvent.id);

                this.getRounds();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getRounds()
    {
        this.roundService.getRounds().subscribe({
            next: (rounds) => {
                this.rounds = rounds;

                // update filters form with the first round which toDate is not past for the current event
                const eventRounds = rounds.filter(round => round.event.id === this.filtersForm.get('eventId').value);
                let currentRound = eventRounds.find(round => new Date(round.toDate) >= this.currentDate);
                if (!currentRound) {
                    currentRound = eventRounds[eventRounds.length - 1];
                }
                this.filtersForm.get('roundId').setValue(currentRound.id);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getCategories()
    {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;

                this.filtersForm.get('categoryId').setValue(categories[0]?.id);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    removeLastPassage(qualifs: UntypedFormArray)
    {
        qualifs.removeAt(qualifs.length - 1);
    }

    addPassage(qualifs: UntypedFormArray)
    {
        const pilotQualif = this.formBuilder.group({
            points: [null, Validators.required],
            passage: [qualifs.length + 1, Validators.required]
        });

        qualifs.push(pilotQualif);
    }

    saveQualifying()
    {
        const pilotsQualifying = (this.qualifyingForm.get('pilotsQualifying') as UntypedFormArray).getRawValue()

        this.qualifyingService.updateRoundCategoryPilotsQualifying(pilotsQualifying).subscribe({
            next: () => {
                this.toastr.success('Données qualifs enregistrées');
            },
            error: (error) => {
                this.toastr.success('Erreur lors de l\'enregistrement des données qualifs');
                console.error(error);
            }
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
