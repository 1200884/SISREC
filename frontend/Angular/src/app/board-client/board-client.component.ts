import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Movie } from '../_models/Movie';

@Component({
  selector: 'app-board-client',
  templateUrl: './board-client.component.html',
  styleUrls: ['./board-client.component.css']
})
export class BoardClientComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

  movies: Movie[] = [];

  ngOnInit() {
    // Chamar o método para obter as recomendações de filmes no momento da inicialização do componente
    this.getNonPersonalizedRecommendations();
  }

  getNonPersonalizedRecommendations() {
    // Chamar o método do serviço para obter as recomendações de filmes não personalizadas
    this.authService.getMoviesNonPersonalized().subscribe(
      (movies: Movie[]) => {
        // Atribuir os resultados ao array de filmes
        this.movies = movies;
      },
      (error) => {
        console.error('Erro ao obter as recomendações de filmes:', error);
      }
    );
  }
}
