import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Movie } from '../_models/Movie';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personalized-recommendations',
  templateUrl: './personalized-recommendations.component.html',
  styleUrls: ['./personalized-recommendations.component.css']
})
export class PersonalizedRecommendationsComponent {
  isDropdownOpen: boolean = false;
  searchQuery: string = '';
  movies: any[] = [];
  filteredMovies: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  rating: number = 0;
  selectedMovie: Movie | null = null; // Inicializando como null
  idMovie=this.selectedMovie?.id;
  constructor(private http: HttpClient, private authservice:AuthService) {}

  searchMovies() {
    this.isLoading = true;
    this.filteredMovies = [];
    this.error = null;

    if (this.searchQuery.length >= 3) {
      this.authservice.getPersonalizedMovies(this.searchQuery)
        .subscribe({
          next: (data) => {
            this.movies = data as any[];

            this.filterMovies();
            this.isLoading = false;
          },
          error: (err) => {
            this.error = err.message;
            this.isLoading = false;
          },
        });
    } else {
      this.filteredMovies = [];
      this.isLoading = false;
    }
  }

  filterMovies() {
    this.filteredMovies = this.movies.filter((movie) => {
      const title = movie.title.toLowerCase();
      return title.includes(this.searchQuery.toLowerCase());
    });
  }

  selectMovie(movie: any) {
    console.log('Movie selected:', movie);
    this.selectedMovie = movie; // Atualizando o selectedMovie com o filme selecionado
    console.log(this.selectedMovie?.url)
  }
  rateMovie(stars: number, movieId: number) {
    this.rating = stars;
    console.log(this.idMovie)
    console.log(this.selectedMovie?.id)
    console.log("Estrelas -> " + stars);
    this.authservice.rate(stars, movieId).subscribe(
      (result) => {
        if (result) {
          console.log(result)
          console.log('Classificação enviada com sucesso!');
          // Faça algo aqui se a classificação for enviada com sucesso
        } else {
          console.error('Erro ao enviar classificação.');
          // Faça algo aqui se houver um erro ao enviar a classificação
        }
      },
      (error) => {
        console.error('Erro ao enviar classificação:', error);
        // Faça algo aqui se houver um erro na solicitação HTTP
      },
      () => {
        console.log('A solicitação de classificação foi concluída.');
        // Faça algo aqui após a conclusão da solicitação HTTP (opcional)
      }
    );
  }
  
  openDropdown() {
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}
