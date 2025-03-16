import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from 'environments/environment';
import {FulfillmentKpi, ProductKpi, ProductKpiFilters, ProductKpiPagination, ProductSummaryKpi} from "./kpi.types";

@Injectable({
    providedIn: 'root'
})
export class KpiService {
    kpiApiUrl = `${environment.apiUrl}/kpi`;
    private pagination: BehaviorSubject<ProductKpiPagination | null> = new BehaviorSubject(null);
    private products: BehaviorSubject<ProductKpi[] | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get products$(): Observable<ProductKpi[]>
    {
        return this.products.asObservable();
    }

    get pagination$(): Observable<ProductKpiPagination>
    {
        return this.pagination.asObservable();
    }

    getSummaryKpiProducts(): Observable<ProductSummaryKpi>
    {
        return this.http.get<ProductSummaryKpi>(`${this.kpiApiUrl}/summary/products`);
    }

    getKpiProducts(
        page: number|null,
        limit: number|null,
        sort: string|null = null,
        order: string|null = null,
        productKpiFilters: ProductKpiFilters = null
    ): Observable<{ pagination: ProductKpiPagination; products: ProductKpi[]; }> {
        let params = new HttpParams();

        if (page) {
            params = params.append('page', page.toString());
        }
        if (limit) {
            params = params.append('limit', limit.toString());
        }
        if (sort) {
            params = params.append('sort', sort);
        }
        if (order) {
            params = params.append('order', order);
        }
        if (productKpiFilters) {
            for (const key in productKpiFilters) {
                if (productKpiFilters[key]) {
                    if (key === 'products' && productKpiFilters[key].length > 0) {
                        productKpiFilters[key].forEach(product => product ? params = params.append('products[]', product) : null);
                    } else {
                        params = params.append(key, productKpiFilters[key]);
                    }
                }
            }
        }

        return this.http.get<{ pagination: ProductKpiPagination; products: ProductKpi[]; }>(`${this.kpiApiUrl}/products`, {params}).pipe(
            tap((productKpiTable) => {
                this.pagination.next(productKpiTable.pagination);
                this.products.next(productKpiTable.products);
            })
        );
    }

    getKpiFulfillment(): Observable<FulfillmentKpi>{
        return this.http.get<FulfillmentKpi>(`${this.kpiApiUrl}/fulfillment`);
    }
}
