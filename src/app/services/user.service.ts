import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private myAppUrl: string;
  private myApiEndppint: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.server;
    this.myApiEndppint = "api/users";
  }

  signin(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiEndppint}/create`, user);
  }

  login(user: User): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiEndppint}`, user);
  }

  getClaimJWT(claim: string) {
    const token = localStorage.getItem("token");
    
    if (!token) { return ''; }

    // Obtenemos la parte del token que contiene los claims del usuario. Recordemos que el token
    // tiene 3 partes separadas por puntos: Header, Payload, Signature. El payload es donde se 
    // encuentra la data que necesitamos. Entonces es token.split('.')[1]
    const dataToken = JSON.parse(atob(token.split('.')[1]));

    // Obtenemos el dato a traves del nombre del campo. En este caso el nombre del campo es el 
    // tipo de claim (puede ser un rol. un email, un nombre, etc.)
    return dataToken[claim];
  }
}
