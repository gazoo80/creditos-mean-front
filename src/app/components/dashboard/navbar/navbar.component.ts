import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string = "";

  constructor(private router: Router,
              public userService: UserService) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

}
