import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  loading: boolean = false;

  constructor(private toastr: ToastrService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    // Validando que el usuasrio ingrese valores
    if (this.username == "" || this.password == "") {
      this.toastr.error('Todos los campos son requeridos', 'Error');
      return;
    }

    // Creamos el objeto user que vamos a loguear
    const user: User = {
      username: this.username,
      password: this.password
    }

    this.loading = true;

    this.userService.login(user).subscribe({
      next: (res: any) => {
        this.loading = false;
        localStorage.setItem("token", res.token);
        this.router.navigate(["/dashboard"]);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(
          e.error.msg ?? "¡Ups, ocurrió un error inesperado. Inténtelo más tarde! ", 
          "Error"
        ); // msg tiene que existir en el json respuesta sino mostramos uno personalizado
        this.username = "";
        this.password = "";
      }
    });
  }

}
