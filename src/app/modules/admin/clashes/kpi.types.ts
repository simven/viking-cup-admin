import {ProductData} from "../apps/product/product.types";

export interface ProductSummaryKpi {
    totalProducts: number;
}

export interface ProductKpi extends ProductData {
    totalPurchasePrice: number;
    totalQtySold: number;
}

export interface ProductKpiFilters {
    products: string[];
    fromDate: string;
    toDate: string;
}

export interface FulfillmentKpi {
    fulfillments: Fulfillment[];
    totalFulfillments: number;
    statusCounts: { [key: string]: number };
    referenceCounts: { [key: string]: number };
}

export interface Fulfillment {
    id: string;
    orderLineId: number;
    productReference: string;
    productQty: number;
    statusId: number;
    dateAdd: string;
}

export interface ProductKpiPagination {
    totalItems: number;
    pageIndex: number;
    itemsPerPage: number;
}
