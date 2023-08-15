import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
//import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
//import { NavbarComponent } from './components/dashboard/navbar/navbar.component';
import { AddTokenInterceptor } from './utils/add-token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignInComponent,
    //DashboardComponent,
    SpinnerComponent,
    //NavbarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, // Para que funcione ngModel
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({ 
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: "decreasing"
    }), // ToastrModule added con configuraciones globales
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
