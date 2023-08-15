import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent },
  { path: "signin", component: SignInComponent },
  //{ path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "dashboard", loadChildren: () => import("./components/dashboard/dashboard.module").then(m => m.DashboardModule)},
  { path: "**", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
