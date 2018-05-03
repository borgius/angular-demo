import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorage } from '../core/token.storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private token: TokenStorage
  ) {}

  username = 'admin';
  password = 'admin';

  ngOnInit() {}

  login(): void {
    this.authService
      .attemptAuth(this.username, this.password)
      .subscribe(data => {
        this.token.saveToken(data.jwt);
        this.router.navigate(['books']);
      });
  }
}
