import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';
import {RoundCategoryPilotsQualifying} from "./qualifying.types";

@Injectable({
    providedIn: 'root'
})
export class QualifyingService {
    qualifyingApiUrl = `${environment.apiUrl}/qualifying`;

    constructor(private http: HttpClient) {}

    getRoundCategoryPilotsQualifying(roundId: number, categoryId: number, pilot: string|null = null): Observable<RoundCategoryPilotsQualifying[]>
    {
        let url = `${this.qualifyingApiUrl}`;

        let params = new HttpParams();
        params = params.set('round', roundId.toString());
        params = params.set('category', categoryId.toString());
        if (pilot) {
            params = params.set('pilot', pilot);
        }

        return this.http.get<RoundCategoryPilotsQualifying[]>(url, {params});
    }

    updateRoundCategoryPilotsQualifying(roundCategoryPilotsQualifying: any[]): Observable<void>
    {
        return this.http.put<void>(`${this.qualifyingApiUrl}`, roundCategoryPilotsQualifying);
    }
}
