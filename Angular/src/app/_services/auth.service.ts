import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_models/User';
import { Subscription } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Declare uma propriedade para manter a inscrição

  constructor(private http: HttpClient) { }
  private userEmail: string = '';
  private name: string = '';
  private phoneNumber: string = '';

  private subscription: Subscription = new Subscription(); // Inicialize a propriedade 'subscription'

  setUserEmail(email: string) {
    console.log("setuser email true")
    this.userEmail = email;
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
  getPhoneNumber(): string {
    console.log("get phone number -> " + this.phoneNumber)
    return this.phoneNumber;
  }
  register(user: User | undefined): Observable<User> {
    return this.http.post<User>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL + "/signup", user);
  }
  logIn(username: string, password: string): Observable<Boolean> {
    if (username === 'JoaoGaspar' && password === 'JoaoGaspar') {
      return of(true);
    }
    else return this.http.post<Boolean>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL, { username, password });
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.LOGISTICS_URL_LOCAL + environment.AUTH_URL);
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
