import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guard/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import {NoAuthGuard} from "./core/auth/guard/noAuth.guard";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch : 'full',
        redirectTo: 'qualifying'
    },
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'login',
                loadChildren: () => import('app/modules/auth/login/login.routes')
            },
        ]
    },
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        children: [
            {
                // Qualifying
                path: 'qualifying',
                loadChildren: () => import('app/modules/admin/clashes/qualifying/qualifying.routes')
            },
            {
                // Battle
                path: 'battle',
                loadChildren: () => import('app/modules/admin/clashes/battle/battle.routes')
            },
        ]
    },
];
