import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../../../../interfaces/customer';
import { Coordinate } from '../../../../interfaces/coordinate';
import { CustomerService } from '../../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MapComponent } from '../../map/map.component';

@Component({
  selector: 'app-upsert-customer',
  templateUrl: './upsert-customer.component.html',
  styleUrls: ['./upsert-customer.component.css']
})
export class UpsertCustomerComponent implements OnInit {

  idCardTypes: string[] = ["DNI", "Pasaporte", "Carnet de Extranjería"];
  maxDate: Date;
  form: FormGroup;

  // Rating
  maxRating: number = 5;
  selectedRating: number = 0;
  maxRatingArr: number[] = [];
  previousRating: number = 0;

  // Map
  initialCoordinate: Coordinate[] = [];
  emittedCoordinate!: Coordinate;
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  loading: boolean = false;
  operation: string = "Agregar ";
  idCustomer: number; 
  
  constructor(public dialogRef: MatDialogRef<UpsertCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private fb: FormBuilder,
              private customerService: CustomerService,
              private toastr: ToastrService) { 
    
    this.maxDate = new Date(); // Condicion para el calendario
    this.idCustomer = data.id; 

    this.form = this.fb.group({
      firstName: ["", [
        Validators.required 
        //Validators.maxLength(20)
      ]],
      lastName: ["", Validators.required],
      email: ["", [
        Validators.required,
        Validators.email
      ]],
      telephone: ["", [
        Validators.required,
        Validators.pattern("^[0-9]*$") // Solo caracteres numericos
      ]],
      idCardType: [null, Validators.required],
      idCardNumber: [null, [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]],
      dateOfBirth: [null, Validators.required],
      address: ["", Validators.required],
    });           
  }

  ngOnInit(): void {
    this.maxRatingArr = Array(this.maxRating).fill(0);
    this.isEdit(this.idCustomer);
  }

  //#region MODAL
  cancel() {
    this.dialogRef.close(false);
  }
  //#endregion

  //#region RATING

  handleMouseEnter(indice: number): void {
    this.selectedRating = indice + 1;
  }

  handleMouseLeave(): void {
    if (this.previousRating !== 0) {
      this.selectedRating = this.previousRating;
    }
    else {
      this.selectedRating = 0;
    }
  }

  rate(indice: number): void {
    this.selectedRating = indice + 1;
    this.previousRating = this.selectedRating;
  }

  //#endregion

  //#region MAP

  selectedCoordinate(coordinate: Coordinate): void {
    this.emittedCoordinate = coordinate;
  }

  //#endregion

  isEdit(id: number) {
    if (id !== 0) {
      this.operation = "Editar ";
      this.getCustomer(id);    
    }
    else {
      const coordinate: Coordinate= {
        latitude: "-12.061144802538239",
        longitude: "-77.03682766782327",
        marker: false 
      };

      this.initialCoordinate.push(coordinate);
    }
  }

  getCustomer(id: number) {
    this.loading = true;
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.loading = false;
        this.form.patchValue(customer);
        this.setRating(customer);
        this.setLocation(customer);
      },
      error: (e: HttpErrorResponse) => {
        this.errorAction(e);
        // this.loading = false;
        // this.dialogRef.close(false);
        // this.toastr.error(
        //   e.error.msg ?? "¡Ups, ocurrió un error. Inténtelo más tarde! ", 
        //   "Error"
        // );
      }
    });
  }

  setRating(customer: Customer) {
    const { rating } = customer;
    this.selectedRating = rating ?? 0;
    this.previousRating = this.selectedRating;
  }

  setLocation(customer: Customer) {
    const { latitude, longitude } = customer;
    const res = latitude || false;
    
    if (res) {
      const coordinate: Coordinate= {
        latitude: latitude!,
        longitude: longitude!,
        marker: true
      };

      this.initialCoordinate.push(coordinate);

      this.mapComponent.ngOnInit(); 

      this.emittedCoordinate = coordinate;
    }
    else { 
      const coordinate: Coordinate= {
        latitude: "-12.061144802538239",
        longitude: "-77.03682766782327",
        marker: false 
      };

      this.initialCoordinate.push(coordinate);
      this.mapComponent.ngOnInit(); 
    }
  }

  addEditCustomer() {
    if (this.form.invalid) {
      return;
    }

    const customer: Customer = this.form.value as Customer
    customer.rating = this.selectedRating,
    customer.latitude = this.emittedCoordinate?.latitude ?? "",
    customer.longitude = this.emittedCoordinate?.longitude ?? ""

    this.loading = true;

    if (this.idCustomer === 0) {
      this.addCustomer(customer);
    }
    else {
      customer.id = this.idCustomer;
      this.editCustomer(customer, this.idCustomer);
    }
  }

  addCustomer(customer: Customer) {
    this.customerService.createCustomer(customer).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toastr.success(
          res.msg ?? "¡El cliente fue agregado con éxito!"
        );
      },
      error: (e: HttpErrorResponse) => {
        this.errorAction(e);
      }
    });
  }

  editCustomer(customer: Customer, id: number) {
    this.customerService.updateCustomer(id, customer).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toastr.success(
          res.msg ?? "¡El cliente fue agregado con éxito!"
        );
      },
      error: (e: HttpErrorResponse) => {
        this.errorAction(e);
      }
    });
  }

  errorAction(e: HttpErrorResponse) {
    this.loading = false;
    this.dialogRef.close(false);
    this.toastr.error(
      e.error.msg ?? "¡Ups, ocurrió un error. Inténtelo más tarde! ", 
      "Error"
    );
  }
}
