// solarios.component.ts
import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../_services/places.service';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-solarios',
  templateUrl: './solarios.component.html',
  styleUrls: ['./solarios.component.css']
})
export class SolariosComponent implements OnInit {
  searchTerm: string = '';
  solarios: any[] = [];
  solariosFiltrados: any[] = [];
  favoritos: string[] = [];
  userEmail = this.authService.getUserEmail();

  constructor(private placeService: PlacesService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.carregarSolarios();
    this.carregarFavoritos();
  }

  carregarSolarios() {
    this.placeService.getSolarios().subscribe(
      (data: any) => {
        this.solarios = data;
        this.filtrarSolarios();
      },
      error => {
        console.error('Erro ao buscar solários:', error);
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

  filtrarSolarios() {
    if (!this.searchTerm) {
      this.solariosFiltrados = this.solarios;
    } else {
      const termoLowerCase = this.searchTerm.toLowerCase();
      this.solariosFiltrados = this.solarios.filter(solario =>
        solario.name.toLowerCase().includes(termoLowerCase)
      );
    }
  }

  redirect(nomesolario: string) {
    const nomesolarioendpoint = nomesolario.replace(/\s/g, '').toLowerCase();
    const newurl = '/' + nomesolarioendpoint;
    this.router.navigate([newurl]);
  }

  isFavorite(nomesolario: string): boolean {
    console.log("is favorite ->"+nomesolario)
    return this.favoritos.includes(nomesolario);
  }

  toggleFavorite(nomesolario: string) {
    if (this.isFavorite(nomesolario)) {
      this.authService.removeFavorite(this.userEmail, nomesolario).subscribe(() => {
        // Atualizar localmente a lista de favoritos
        this.favoritos = this.favoritos.filter(favorite => favorite !== nomesolario);
      });
    } else {
      this.authService.addFavorite(this.userEmail, nomesolario).subscribe(() => {
        // Atualizar localmente a lista de favoritos
        this.favoritos.push(nomesolario);
      });
    }
  }
  goBack(){
    this.router.navigate(['/board-client'])
  }
}
