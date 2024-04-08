import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SocialAuthService,SocialUser} from '@abacritt/angularx-social-login';
import { AuthService } from './_services/auth.service';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form: any = {
    firstName: null,
    phoneNumber: null,
    lastName: null,
    email: null,
    role: null
  };
  newuserfirstname?: string;
  newuserlastname?: string;
  newuseremail?: string;
  newuserphonenumber?: string;
  newuserrole?: string;
  showRegistration: boolean | undefined;
  title = 'Angular12JwtAuth';
  private roles: string[] = [];
  username?: string;
  user: SocialUser | undefined;
  loggedIn: boolean | undefined;
  isSignInFailed = false;
  isAClient= false;
  isAEmployee=false;
  constructor(private authService: AuthService,public socialAuthService: SocialAuthService,private router: Router) {
   
      this.router.navigate(['/board-client']);
    
    if (this.isAEmployee) {
      // Navegar para a rota /board-employee
      console.log("alfrdedo")
      console.log("------------------------------------------")
      this.router.navigate(['/board-employee']);
    }
    if (!this.loggedIn){
      this.router.navigate(['/']);

    }
  
  }

  ngOnInit(): void {
    this.authService.logIn('JoaoGaspar', 'JoaoGaspar').subscribe(
      data => {
        console.log('Usuário autenticado com sucesso:', data);
        // Redirecionar para a página adequada após o login (por exemplo, página do cliente ou do funcionário)
        // Modifique de acordo com a lógica da sua aplicação
        this.router.navigate(['/board-client']);
      },
      err => {
        console.error('Erro ao autenticar o usuário:', err);
      }
    );
  
    console.log("ngnOnInit app accessed")
    this.hideRegistrationForm(); // Ocultar o formulário de registro
    this.showRegistration = false;
    //this.router.navigate(['/login']);
    const token = localStorage.getItem('token');
    if (token) {
      // Enviar o token para o servidor para verificação
      // Se for válido, o usuário continua autenticado
    }
    this.verifyLogin();
    
  }

  logout(): void {
    this.socialAuthService.signOut();
  }
  openRegisterForm(){
    console.log("opening register form")
    this.router.navigate(['/register']);
  }
  verifyLogin() {
    console.log("verify login")
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log("alberto é "+this.loggedIn)
      this.loggedIn = user != null; 
      if (this.loggedIn) {
        console.log(user.email);
        this.authService.logIn('JoaoGaspar', 'JoaoGaspar').subscribe(
          data => {
            this.isClient();
            this.isEmployee();
            this.authService.setUserEmail(user.email);
            //this.authService.setName(data.firstName+" "+ data.lastName);
            //this.authService.setPhoneNumber(data.phoneNumber);
          },
          err => {
            console.log("erro");
            this.socialAuthService.signOut();
            this.isSignInFailed = true;
          }
        );
        
        console.log("this is client"+this.isAClient)
        this.hideRegistrationForm();

      }
      else{
        console.log(this.loggedIn+ "is not loggedin?")
        this.loggedIn=false;
      }
    });
  }
  
  
  isClient() {
    console.log("isclient acedido");
    if (this.user) {
      this.authService.isClient(this.user.email).subscribe((isClient) => {
        if (isClient) {
          // O usuário é um cliente
          console.log('Usuário é um cliente.');
          this.isAClient=true;
          this.router.navigate(['/board-client']);
        } else {
          this.isAClient=false;
          // O usuário não é um cliente
          console.log('Usuário não é um cliente.');
          // Faça ações específicas para outros tipos de usuários aqui.
        }
      });
    }
  }
  isEmployee() {
    console.log("isEmployee acedido");
    if (this.user) {
      this.authService.isEmployee(this.user.email).subscribe((isEmployee) => {
        if (isEmployee) {
          console.log('Usuário é um Employee.');
          this.isAEmployee=true;
          this.router.navigate(['/board-employee']);
        } else {
          this.isAEmployee=false;
          console.log('Usuário não é um Employee.');
         
        }
      });
    }
  }
  submitRegistrationFormClient() {
    console.log('Primeiro Nome:', this.newuserfirstname);
    console.log('Último Nome:', this.newuserlastname);
    console.log('Email:', this.newuseremail);
    console.log('Número de Telefone:', this.newuserphonenumber);
    this.newuserrole='client';
    const {  newuserfirstname, newuserlastname,newuseremail, newuserphonenumber, newuserrole } = this.form;
    let user : User;
    user = this.form;
    this.authService.register(user).subscribe(
      data => {
        console.log(data);        
      },
      err => {
     
      }
    );

  }
  
  showRegistrationForm() {
    // Mostrar o formulário de registro definindo isRegistrationFormVisible como true
    this.showRegistration = true;
  }

  hideRegistrationForm() {
    this.showRegistration = false;
  }
}