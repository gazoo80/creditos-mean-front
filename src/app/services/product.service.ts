import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiEndppint: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.server;
    this.myApiEndppint = "api/products";
  }

  getProducts(): Observable<Product[]> {
    // Agragando el token directamente en el servicio
    // const token = localStorage.getItem("token");
    // const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    // return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiEndppint}`, {headers: headers});

    // Agregando el token en el intereceptor
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiEndppint}`);
  }

}
