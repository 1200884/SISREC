import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../_services/places.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esteticistas',
  templateUrl: './esteticistas.component.html',
  styleUrls: ['./esteticistas.component.css']
})
export class EsteticistasComponent implements OnInit {
    searchTerm: string = '';
    esteticistas: any[] = [];
    esteticistasFiltrados: any[] = [];
    favoritos: string[] = [];
    userEmail = this.authService.getUserEmail();


    constructor(private placeService: PlacesService,private authService: AuthService, private router: Router) {}
  
    ngOnInit() {
      this.carregarEsteticistas();
      this.carregarFavoritos();

    }
  
    carregarEsteticistas() {
      this.placeService.getEsteticistas().subscribe(
        (data: any) => {
          this.esteticistas = data;
          this.filtrarEsteticistas();
        },
        error => {
          console.error('Erro ao buscar esteticistas:', error);
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
  
    filtrarEsteticistas() {
      if (!this.searchTerm) {
        this.esteticistasFiltrados = this.esteticistas;
      } else {
        const termoLowerCase = this.searchTerm.toLowerCase();
        this.esteticistasFiltrados = this.esteticistas.filter(esteticista =>
          esteticista.name.toLowerCase().includes(termoLowerCase)
        );
      }
    }

    isFavorite(nomeesteticista: string): boolean {
      console.log("is favorite ->"+nomeesteticista)
      return this.favoritos.includes(nomeesteticista);
    }
  
    toggleFavorite(nomeesteticista: string) {
      if (this.isFavorite(nomeesteticista)) {
        this.authService.removeFavorite(this.userEmail, nomeesteticista).subscribe(() => {
          // Atualizar localmente a lista de favoritos
          this.favoritos = this.favoritos.filter(favorite => favorite !== nomeesteticista);
        });
      } else {
        this.authService.addFavorite(this.userEmail, nomeesteticista).subscribe(() => {
          // Atualizar localmente a lista de favoritos
          this.favoritos.push(nomeesteticista);
        });
      }
    }
    redirect(nomeesteticista: string) {
      const nomeesteticistaendpoint = nomeesteticista.replace(/\s/g, '').toLowerCase();
      const newurl = '/' + nomeesteticistaendpoint;
      this.router.navigate([newurl]);
    }
    goBack(){
      this.router.navigate(['/board-client'])
    }
  }
  