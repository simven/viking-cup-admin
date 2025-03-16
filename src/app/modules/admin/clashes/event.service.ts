import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';
import {Event} from "./event.types";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    eventApiUrl = `${environment.apiUrl}/events`;

    constructor(private http: HttpClient) {}

    getEvents(): Observable<Event[]>
    {
        return this.http.get<Event[]>(`${this.eventApiUrl}`);
    }
}
