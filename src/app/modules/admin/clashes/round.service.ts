import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';
import {Round} from "./round.types";

@Injectable({
    providedIn: 'root'
})
export class RoundService {
    roundApiUrl = `${environment.apiUrl}/rounds`;

    constructor(private http: HttpClient) {}

    getRounds(): Observable<Round[]>
    {
        return this.http.get<Round[]>(`${this.roundApiUrl}`);
    }
}
