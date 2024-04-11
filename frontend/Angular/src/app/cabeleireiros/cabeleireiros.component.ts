import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../_services/places.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cabeleireiros',
  templateUrl: './cabeleireiros.component.html',
  styleUrls: ['./cabeleireiros.component.css']
})
export class CabeleireirosComponent implements OnInit {
  searchTerm: string = '';
  cabeleireiros: any[] = [];
  cabeleireirosFiltrados: any[] = [];
  favoritos: string[] = [];
  userEmail = this.authService.getUserEmail();
  constructor(private placeService: PlacesService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.carregarCabeleireiros();
    this.carregarFavoritos();

  }

  carregarCabeleireiros() {
    this.placeService.getCabeleireiros().subscribe(
      (data: any) => {
        this.cabeleireiros = data;
        this.filtrarCabeleireiros();
      },
      error => {
        console.error('Erro ao buscar cabeleireiros:', error);
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
  filtrarCabeleireiros() {
    if (!this.searchTerm) {
      this.cabeleireirosFiltrados = this.cabeleireiros;
    } else {
      const termoLowerCase = this.searchTerm.toLowerCase();
      this.cabeleireirosFiltrados = this.cabeleireiros.filter(cabeleireiro =>
        cabeleireiro.name.toLowerCase().includes(termoLowerCase)
      );
    }
  }
  isFavorite(nomecabeleireiro: string): boolean {
    console.log("is favorite ->"+nomecabeleireiro)
    return this.favoritos.includes(nomecabeleireiro);
  }

  toggleFavorite(nomecabeleireiro: string) {
    if (this.isFavorite(nomecabeleireiro)) {
      this.authService.removeFavorite(this.userEmail, nomecabeleireiro).subscribe(() => {
        // Atualizar localmente a lista de favoritos
        this.favoritos = this.favoritos.filter(favorite => favorite !== nomecabeleireiro);
      });
    } else {
      this.authService.addFavorite(this.userEmail, nomecabeleireiro).subscribe(() => {
        // Atualizar localmente a lista de favoritos
        this.favoritos.push(nomecabeleireiro);
      });
    }
  }
  redirect(nomecabeleireiro: string) {
    const nomecabeleireiroendpoint = nomecabeleireiro.replace(/\s/g, '').toLowerCase();
    const newurl = '/' + nomecabeleireiroendpoint;
    this.router.navigate([newurl]);
  }
  goBack(){
    this.router.navigate(['/board-client'])
  }
}
