import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  onSubmit(): void {
    // Aqui você pode adicionar a lógica para enviar os dados de login para o servidor
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    this.authService.logIn(this.email, this.password)
    // Por enquanto, estamos apenas imprimindo os valores do email e senha no console
  }
}
