import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from './shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Components
import { NavbarComponent } from "./navbar/navbar.component";
import { DashboardComponent } from "./dashboard.component";
import { CustomerComponent } from './customer/customer.component';
import { UpsertCustomerComponent } from './customer/upsert-customer/upsert-customer.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    NavbarComponent,
    DashboardComponent,
    CustomerComponent,
    UpsertCustomerComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    LeafletModule
  ]
})
export class DashboardModule { }
