import {Event} from "app/modules/admin/clashes/event.types";

export interface Round {
    id: number;
    name: string;
    event: Event;
    fromDate: string;
    toDate: string;
}
