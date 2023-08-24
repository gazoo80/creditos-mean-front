import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private myAppUrl: string;
  private myApiEndppint: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.server;
    this.myApiEndppint = "api/customers";
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.myAppUrl}${this.myApiEndppint}`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.myAppUrl}${this.myApiEndppint}/${id}`);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiEndppint}/${id}`);
  }

  createCustomer(customer: Customer): Observable<any>  {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiEndppint}`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<any>  {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiEndppint}/${id}`, customer);
  }
}
