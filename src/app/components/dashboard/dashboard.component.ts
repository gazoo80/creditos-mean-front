import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService ) { 
    // productService.getProducts().subscribe({
    //   next: (products: Product[]) => {
    //     this.products = products;
    //     console.log(this.products);
    //   }
    // });
  }

  ngOnInit(): void {
  }

}
