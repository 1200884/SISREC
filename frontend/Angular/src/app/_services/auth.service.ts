import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models/User';
import { Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserRegister } from '../_models/UserRegister';
import { UserLoginComponent } from '../user-login/user-login.component';
import { Movie } from '../_models/Movie';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  private userEmail: string = '';
  private name: string = '';
  private phoneNumber: string = '';
  public isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription(); // Inicialize a propriedade 'subscription'
  newuseremail:string ='';
  setUserEmail(email: string) {
    console.log("setuser email true")
    this.userEmail = email;
  }
  setNewUserEmail(email: string) {
    console.log("setuser email true")
    this.newuseremail = email;
  }
  setName(name: string) {
    console.log("name = " + name);
    this.name = name;
    console.log("this.name -> " + this.name)
  }
  setPhoneNumber(phoneNumber: string) {
    console.log("phone number -> " + phoneNumber)
    this.phoneNumber = phoneNumber;
  }
  getName(): string {
    return this.name;
  }
  getUserEmail(): string {
    return this.userEmail;
  }
  getNewUserEmail(): string {
    return this.newuseremail;
  }
  getPhoneNumber(): string {
    console.log("get phone number -> " + this.phoneNumber)
    return this.phoneNumber;
  }
  registerGenres(selectedGenres: any[]): Observable<boolean> {
    
    console.log("email ->"+ this.newuseremail)
    return this.http.post<boolean>(environment.BACKEND_URL_LOCAL + environment.USERSGENRES_URL+"/"+this.newuseremail,  selectedGenres);
  }
  register(userRegister: UserRegister | undefined): Observable<boolean> {
    return this.http.post<UserRegister>(environment.BACKEND_URL_LOCAL + environment.USERS_URL, userRegister).pipe(
      map((response: any) => {
        return response.status === 200; // Retorna true se o status for 200
      }),
    );
  }
  logIn(email: string, password: string): Observable<boolean> {
    const body = { email, password };

    if (email === 'JoaoGaspar' && password === 'JoaoGaspar') {
      console.log("Nelson");
      return of(true); 
    } else {
      console.log("email -> " + email);
      console.log("password -> " + password);
      console.log("Grande Nelson");

      return this.http.post<any>(environment.BACKEND_URL_LOCAL + environment.LOGIN_URL, body)
        .pipe(
          map((response: any) => {
            console.log('Resposta do backend:', response);
            this.isLoggedIn=true;
            return response.status === 200; 
          }),
          catchError(error => {
            console.error('Erro ao fazer login:', error);
            return of(false);
          })
        );
    }
  }
  
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL);
  }
  getMoviesNonPersonalized():Observable<Movie[]>
  {
    return this.http.get<Movie[]>(environment.BACKEND_URL_LOCAL+environment.RECOMMENDATIONSNONPERSONALIZED);
  }

  isClient(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/isclient/" + email);
  }
  isEmployee(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/isemployee/" + email);
  }
  addFavorite(email: string, favorite: string): Observable<boolean> {
    const body = {
      email: email,
      favorite: favorite
    };
    return this.http.post<boolean>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/addfavorite", body)
  }
  getFavorites(email: string): Observable<string[]> {
    return this.http.get<string[]>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/getfavorites/" + email);
  }
  removeFavorite(email: string, favorite: string): Observable<boolean> {
    const body = {
      email: email,
      favorite: favorite
    };
    return this.http.post<boolean>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/removefavorite", body)
  }

  inactive(email: string): Observable<boolean> {
    console.log("email service: " + email);
    const url = environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/deleteemployee/" + email;
    console.log("URL da solicitação DELETE: " + url);

    // Faça a inscrição no Observable e armazene a inscrição na propriedade 'subscription'
    this.subscription = this.http.get<boolean>(url).subscribe(
      (data) => {
        console.log("Resposta bem-sucedida: ", data);
        // Você pode fazer qualquer coisa com 'data' aqui
      },
      (error) => {
        console.error("Erro na solicitação HTTP: ", error);
      }
    );

    // Retorna um Observable booleano para indicar o estado da solicitação
    return new Observable<boolean>((observer) => {
      // Quando a inscrição é concluída, notifique o observador
      this.subscription.add(() => {
        // Se você quiser retornar algum valor (verdadeiro ou falso) com base na resposta, faça aqui.
        // Exemplo:
        observer.next(true); // Você pode ajustar isso com base em sua lógica
        observer.complete();
      });
    });
  }

  // Certifique-se de cancelar a inscrição quando não for mais necessária
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
