import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {User} from "app/modules/auth/login/types/user.types";

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    standalone: true,
    imports: [
    ]
})
export class BattleComponent implements OnInit {
    user: User;

    constructor(
        private title: Title
    ) {
        this.title.setTitle('Battles • Viking Cup admin');
    }

    ngOnInit(): void
    {
    }

}
