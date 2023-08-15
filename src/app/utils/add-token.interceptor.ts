import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ExpressionStatement } from '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem("token");

    // Si el token ExpressionStatement, agregamos en las cabeceras del request el 
    // Bearer token
    if (token) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    }

    return next.handle(request);

    // Para obtener los mensajes de error de acceso denegado y token no valido en el 
    // server en la validacion del token
    /*
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // => Aqui podriamos insertar codigo para lanzar un mensaje
          this.router.navigate(["/login"]);
        }

        return throwError(() => error);
      })
    );*/
  }
}
