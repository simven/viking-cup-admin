import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';
import {Category} from "./category.types";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    categoryApiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]>
    {
        return this.http.get<Category[]>(`${this.categoryApiUrl}`);
    }
}
