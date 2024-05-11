import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserLoginComponent } from '../user-login/user-login.component';
import { Router } from '@angular/router';
interface Genre {
  id: number;
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-favorite-genres',
  templateUrl: './favorite-genres.component.html',
  styleUrls: ['./favorite-genres.component.css']
})
export class FavoriteGenresComponent {
  genres: Genre[] = [
    { id: 1, name: 'Action', selected: false },
    { id: 2, name: 'Adventure', selected: false },
    { id: 3, name: 'Animation', selected: false },
    { id: 4, name: 'Children', selected: false },
    { id: 5, name: 'Comedy', selected: false },
    { id: 6, name: 'Fantasy', selected: false },
    { id: 7, name: 'Romance', selected: false },
    { id: 8, name: 'Drama', selected: false },
    { id: 9, name: 'Action', selected: false },
    { id: 10, name: 'Crime', selected: false },
    { id: 11, name: 'Thriller', selected: false },
    { id: 12, name: 'Horror', selected: false },
    { id: 13, name: 'Mystery', selected: false },
    { id: 14, name: 'Sci-Fi', selected: false },
    { id: 15, name: 'IMAX', selected: false },
    { id: 16, name: 'Documentary', selected: false },
    { id: 17, name: 'War', selected: false },
    { id: 18, name: 'Musical', selected: false },
    { id: 19, name: 'Western', selected: false },
    { id: 20, name: 'Film-Noir', selected: false }
  ];
  constructor(private authService: AuthService, private router: Router) { }
  selectedGenres: Genre[] = [];

  toggleSelection(genre: Genre): void {
    if (genre.selected) {
      this.selectedGenres = this.selectedGenres.filter(g => g.id !== genre.id);
    } else {
      if (this.selectedGenres.length < 5) {
        this.selectedGenres.push(genre);
      } else {
        // Limite de 5 gêneros já selecionados
        // Você pode exibir uma mensagem para o usuário aqui
      }
    }
    genre.selected = !genre.selected;
  }
  submitGenres(): void {
    if (this.selectedGenres.length < 3) {
      alert('Pelo menos 3 géneros devem ser selecionados.');
      return;
    }
    const selectedGenreNames: string[] = this.selectedGenres.map(genre => genre.name);

    this.authService.registerGenres(selectedGenreNames).subscribe(
      (success: boolean) => {
        if (success) {
          // Lógica adicional para lidar com o sucesso
          console.log('Géneros registados com sucesso!');
          this.authService.setUserEmail(this.authService.getNewUserEmail())
          this.router.navigate(['/personalized-recommendations'])
        } else {
          // Lógica adicional para lidar com o fracasso
          console.log('Falha ao registar os géneros.');
        }
      },
      error => {
        console.error('Erro ao enviar géneros:', error);
      }
    );
  }
  
}
