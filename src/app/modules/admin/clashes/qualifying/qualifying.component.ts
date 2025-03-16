import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {User} from "app/modules/auth/login/types/user.types";

@Component({
    selector: 'app-qualifying',
    templateUrl: './qualifying.component.html',
    standalone: true,
    imports: [
    ]
})
export class QualifyingComponent implements OnInit {
    user: User;

    constructor(
        private title: Title
    ) {
        this.title.setTitle('Qualifications • Viking Cup admin');
    }

    ngOnInit(): void
    {
    }

}
