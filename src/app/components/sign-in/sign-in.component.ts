import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  loading: boolean = false;

  constructor(private toastr: ToastrService,
              private userService: UserService,
              private router: Router) { } 

  ngOnInit(): void {
  }

  addUser() {
    if (this.username == "" || this.password == "" || this.password == "") {
      this.toastr.error('Todos los campos son requeridos', 'Error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Los passwords ingresados deben ser iguales', 'Error');
      return;
    }

    const user: User = {
      username: this.username,
      password: this.password
    }

    this.loading = true;

    this.userService.signin(user).subscribe({
      next: (res) => {
        this.toastr.success(`El usuario ${this.username} fue registrado con éxito`, 'Ok');
        this.loading = false;
        this.router.navigate(["/login"]);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(
          e.error.msg ?? "¡Ups, ocurrió un error inesperado. Inténtelo más tarde! ", 
          "Error"
        ); 
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
      }
    });
  }

}
