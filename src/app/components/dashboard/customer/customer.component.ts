import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from '../../../interfaces/customer';
import { UpsertCustomerComponent } from './upsert-customer/upsert-customer.component';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from "sweetalert2";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ["firstName", "rating", "telephone", "email", "idCardType", "idCardNumber", "actions"];
  dataSource: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading: boolean = false;

  constructor(public dialog: MatDialog,
              private toastr: ToastrService,
              private customerService: CustomerService) { 
    // this.dataSource = new MatTableDataSource(listCustomers);
    this.dataSource = new MatTableDataSource();
  }
  
  ngOnInit(): void {
    this.getCustomers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addEditCustomer(id: number = 0): void {
    const dialogRef = this.dialog.open(UpsertCustomerComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.getCustomers();
      }
    });
  }

  getCustomers() {
    this.loading = true;

    this.customerService.getCustomers().subscribe({
      next: (customers: any) => {
        this.loading = false;
        this.dataSource.data = customers;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(
          e.error.msg ?? "¡Ups, ocurrió un error. Inténtelo más tarde! ", 
          "Error"
        );
      }
    });
  }

  deleteCustomer(id: number) {
    Swal.fire({
      title: 'Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
        if (result.isConfirmed) { 
          this.loading = true;

          this.customerService.deleteCustomer(id).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.getCustomers();
              this.toastr.success(
                res.msg ?? "¡El cliente fue eliminado con éxito!"
              );
            },
            error: (e: HttpErrorResponse) => {
              this.loading = false;
              this.toastr.error(
                e.error.msg ?? "¡Ups, ocurrió un error. Inténtelo más tarde! ", 
                "Error"
              );
            }
          });
        }
    });
  }

}
