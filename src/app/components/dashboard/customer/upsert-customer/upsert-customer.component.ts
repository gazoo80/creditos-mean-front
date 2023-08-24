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
  idCustomer: number; // Id enviado por el componente que abre el modal
  
  constructor(public dialogRef: MatDialogRef<UpsertCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, // Para recibir data del componente padre (el q abre el modal) 
              private fb: FormBuilder,
              private customerService: CustomerService,
              private toastr: ToastrService) { 
    
    this.maxDate = new Date(); // Para el calendario
    this.idCustomer = data.id; //id pasado al modal en data

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
    this.maxRatingArr = Array(this.maxRating).fill(0); // RAting
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

  // Handler del evento del componente mapa onSelectedCoordinate
  selectedCoordinate(coordinate: Coordinate): void {
    console.log(coordinate);
    this.emittedCoordinate = coordinate;
  }

  //#endregion

  isEdit(id: number) {
    if (id !== 0) {
      this.operation = "Editar ";
      // Obtenemos el customer que vamos a editar
      this.getCustomer(id);    
    }
    else {
      // Si estamos agregando mostramos el mapa centrado con las coordenadas de Lima y 
      // sin marcador
      const coordinate: Coordinate= {
        latitude: "-12.061144802538239",
        longitude: "-77.03682766782327",
        marker: false // Sin marcador
      };
      // Colocamos las coordenadas en la variable input del mapa
      this.initialCoordinate.push(coordinate);
    }
  }

  getCustomer(id: number) {
    this.loading = true;
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        console.log(customer);
        this.loading = false;
        this.form.patchValue(customer); // Llenamos el form con los datos del customer a editar
        this.setRating(customer); // Seteamos el rating 
        this.setLocation(customer); // Seteamos la ubicacion en el mapa
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
    // Si el rating obtenido de BD es null o undefined, asignamos el valor 0 lo que significa que 
    // ninguna estrella se pintara
    this.selectedRating = rating ?? 0;
    // Mantenemos en memoria el rating previamente seleccionado
    this.previousRating = this.selectedRating;
  }

  setLocation(customer: Customer) {
    const { latitude, longitude } = customer;
    const res = latitude || false;
    
    // Si existen coordenadas en BD para el customer
    if (res) {
      console.log(res);
      //Coordenadas para el mapa en modo edicion
      const coordinate: Coordinate= {
        latitude: latitude!,
        longitude: longitude!,
        marker: true // Con marcador
      };

      // Colocamos la coordenada en la variable input del mapa
      this.initialCoordinate.push(coordinate);
      // ejecutamos nuevamente el ngOnInit() del mapa para q se cree el mapa con la coordenada
      // centrada y con el marker respectivo
      this.mapComponent.ngOnInit(); 

      // Le doy a emittedCoordinate las coordenadas existentes por si el usuario no las modifica 
      // en el mapa. Asi evito que emittedCoordinate quede en null y se pierdan las coordenadas
      // existentes
      this.emittedCoordinate = coordinate;
    }
    else { // Si no existen coordenadas en BD para el customer (null, undefined, "")
      // Damos por defecto las coordenadas de Lima y sin marcador
      const coordinate: Coordinate= {
        latitude: "-12.061144802538239",
        longitude: "-77.03682766782327",
        marker: false // Sin marcador
      };
      // Colocamos la coordenada en la variable input del mapa
      this.initialCoordinate.push(coordinate);
      // ejecutamos nuevamente el ngOnInit() del mapa para q se cree el mapa con la coordenada
      // centrada y con el marker respectivo
      this.mapComponent.ngOnInit(); 
    }
  }

  addEditCustomer() {
    /*console.log(this.form.value.firstName);
    console.log(this.form.get("firstName")?.value);*/

    if (this.form.invalid) {
      return;
    }

    const customer: Customer = this.form.value as Customer
    customer.rating = this.selectedRating,
    customer.latitude = this.emittedCoordinate?.latitude ?? "",
    customer.longitude = this.emittedCoordinate?.longitude ?? ""
    console.log(customer);
    //   // Si hubiera algun problema con la fecha al momento de enviar a registro
    //   dateOfBirth: this.form.value.dateOfBirth.toISOString().slice(0, 10), // 2020-03-18
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
