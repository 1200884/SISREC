import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private appcomponent: AppComponent, private router: Router) { }

  onSubmit(): void {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    this.authService.logIn(this.email, this.password).subscribe(
      (isLoggedIn: boolean) => {
        if (this.authService.isLoggedIn) {
          console.log("is Logged In")
          this.appcomponent.loggedIn=true;
          this.authService.setUserEmail(this.email)
          this.router.navigate(['/personalized-recommendations']);
        } else {
          console.log("is Not Logged In")
          console.error('O login falhou');
        }
      },
      (error) => {
        console.error('Erro ao fazer login:', error);
      }
    );
  }
}  