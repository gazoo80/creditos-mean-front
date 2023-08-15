import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

// Components
import { NavbarComponent } from "./navbar/navbar.component";
import { DashboardComponent } from "./dashboard.component";
import { CustomerComponent } from './customer/customer.component';

@NgModule({
  declarations: [
    NavbarComponent,
    DashboardComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
