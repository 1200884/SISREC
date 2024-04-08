import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-client',
  templateUrl: './board-client.component.html',
  styleUrls: ['./board-client.component.css']
})
export class BoardClientComponent {
  constructor(private router: Router) {}

  solarios() {
    // Redirecionar para a página de registro de funcionários
    this.router.navigate(['/solarios']);
  }

  barbearias() {
    // Redirecionar para a página de visualização de reservas
    this.router.navigate(['/barbeiros']);
  }
  
  cabeleireiros(){
    this.router.navigate(['/cabeleireiros'])
  }

  esteticistas(){
    this.router.navigate(['/esteticistas'])
  }
  favoritos(){
    this.router.navigate(['/favoritos'])
  }
}
