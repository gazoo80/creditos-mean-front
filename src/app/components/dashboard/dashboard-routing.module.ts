import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: [
    // Con la ruta primaria de dashboard cargara por defecto el componente Customer
    { path: '', component: CustomerComponent },
    { path: 'customer', component: CustomerComponent },
    // Si despues de dashboard/ ponemos algo que no existe dedirigira a Customer
    { path: '**', redirectTo: "customer" }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
