import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../_services/places.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barbeiros',
  templateUrl: './barbeiros.component.html',
  styleUrls: ['./barbeiros.component.css']
})
export class BarbeirosComponent implements OnInit{
  searchTerm: string = '';
  barbeiros: any[] = [];
  barbeirosFiltrados: any[] = [];
  favoritos: string[] = [];
  userEmail = this.authService.getUserEmail();

  constructor(private placeService: PlacesService, private authService: AuthService,private router:Router) {}

  ngOnInit() {
    this.carregarBarbeiros();
    this.carregarFavoritos();

  }

  carregarBarbeiros() {
    this.placeService.getBarbeiros().subscribe(
      (data: any) => {
        this.barbeiros = data;
        this.filtrarBarbeiros();
      },
      error => {
        console.error('Erro ao procurar barbeiros:', error);
      }
    );
  }
  carregarFavoritos() {
    this.authService.getFavorites(this.userEmail).subscribe(
      (data: any) => {
        this.favoritos = data;
      },
      error => {
        console.error('Erro ao buscar favoritos:', error);
      }
    );
  }

  filtrarBarbeiros() {
    if (!this.searchTerm) {
      this.barbeirosFiltrados = this.barbeiros;
    } else {
      const termoLowerCase = this.searchTerm.toLowerCase();
      this.barbeirosFiltrados = this.barbeiros.filter(barbeiro =>
        barbeiro.name.toLowerCase().includes(termoLowerCase)
      );
    }
  }
  isFavorite(nomebarbeiro: string): boolean {
    console.log("is favorite ->"+nomebarbeiro)
    return this.favoritos.includes(nomebarbeiro);
  }

  toggleFavorite(nomebarbeiro: string) {
    if (this.isFavorite(nomebarbeiro)) {
      this.authService.removeFavorite(this.userEmail, nomebarbeiro).subscribe(() => {
        // Atualizar localmente a lista de favoritos
        this.favoritos = this.favoritos.filter(favorite => favorite !== nomebarbeiro);
      });
    } else {
      this.authService.addFavorite(this.userEmail, nomebarbeiro).subscribe(() => {
        // Atualizar localmente a lista de favoritos
        this.favoritos.push(nomebarbeiro);
      });
    }
  }
  redirect(nomebarbeiro: string) {
    const nomebarbeiroendpoint = nomebarbeiro.replace(/\s/g, '').toLowerCase();
    const newurl = '/' + nomebarbeiroendpoint;
    this.router.navigate([newurl]);
  }
  goBack(){
    this.router.navigate(['/board-client'])
  }
}

