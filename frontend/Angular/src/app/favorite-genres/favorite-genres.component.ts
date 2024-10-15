import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
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
export class FavoriteGenresComponent implements OnInit {
  genres: Genre[] = [
    { id: 1, name: 'Action', selected: false },
    { id: 2, name: 'Adventure', selected: false },
    { id: 3, name: 'Animation', selected: false },
    { id: 4, name: 'Children', selected: false },
    { id: 5, name: 'Comedy', selected: false },
    { id: 6, name: 'Fantasy', selected: false },
    { id: 7, name: 'Romance', selected: false },
    { id: 8, name: 'Drama', selected: false },
    { id: 9, name: 'Crime', selected: false },
    { id: 10, name: 'Thriller', selected: false },
    { id: 11, name: 'Horror', selected: false },
    { id: 12, name: 'Mystery', selected: false },
    { id: 13, name: 'Sci-Fi', selected: false },
    { id: 14, name: 'IMAX', selected: false },
    { id: 15, name: 'Documentary', selected: false },
    { id: 16, name: 'War', selected: false },
    { id: 17, name: 'Musical', selected: false },
    { id: 18, name: 'Western', selected: false },
    { id: 19, name: 'Film-Noir', selected: false }
  ];

  genres1: Genre[] = [
    { id: 1, name: 'Action', selected: false },
    { id: 2, name: 'Adventure', selected: false },
    { id: 3, name: 'Animation', selected: false },
    { id: 4, name: 'Children', selected: false },
    { id: 5, name: 'Comedy', selected: false },
    { id: 6, name: 'Fantasy', selected: false },
    { id: 7, name: 'Romance', selected: false },
    { id: 8, name: 'Drama', selected: false },
    { id: 9, name: 'Crime', selected: false },
    { id: 10, name: 'Thriller', selected: false },
    { id: 11, name: 'Horror', selected: false },
    { id: 12, name: 'Mystery', selected: false },
    { id: 13, name: 'Sci-Fi', selected: false },
    { id: 14, name: 'IMAX', selected: false },
    { id: 15, name: 'Documentary', selected: false },
    { id: 16, name: 'War', selected: false },
    { id: 17, name: 'Musical', selected: false },
    { id: 18, name: 'Western', selected: false },
    { id: 19, name: 'Film-Noir', selected: false }
  ];

  selectedGenres: Genre[] = [];
  leastfavoriteselectedGenres: Genre[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Ensure genres are not selected initially
    this.genres.forEach(genre => genre.selected = false);
    this.genres1.forEach(genre => genre.selected = false);
  }

  checkSelection(genre: Genre): boolean {
    const foundGenre = this.genres1.find(g => g.id === genre.id);
    return !(foundGenre && foundGenre.selected);
  }

  check1Selection(genre: Genre): boolean {
    const foundGenre = this.genres.find(g => g.id === genre.id);
    return !(foundGenre && foundGenre.selected);
  }

  toggleSelection(genre: Genre): void {
    if (genre.selected) {
      this.selectedGenres = this.selectedGenres.filter(g => g.id !== genre.id);
      genre.selected = false;

    } else {
      if (this.selectedGenres.length < 5) {
        this.selectedGenres.push(genre);
        this.deselectInOtherArray(genre, this.genres1);
        genre.selected = true;
      } else {
        alert('You can only select up to 5 favorite genres, so only the first 5 will be considered');
        this.deselectInOtherArray(genre, this.genres);
        genre.selected = false;

      }
    }
  }

  toggle1Selection(genre: Genre): void {
    if (genre.selected) {
      this.leastfavoriteselectedGenres = this.leastfavoriteselectedGenres.filter(g => g.id !== genre.id);
      genre.selected = false;

    } else {
      if (this.leastfavoriteselectedGenres.length < 6) {
        this.leastfavoriteselectedGenres.push(genre);
        this.deselectInOtherArray(genre, this.genres);
        genre.selected = true;
      } else {
        alert('You can only select up to 5 leasst favorite genres, so only the first 5 will be considered.');
        this.deselectInOtherArray(genre, this.genres1);
        genre.selected = false;
        
      }
    }
  }

  deselectInOtherArray(genre: Genre, array: Genre[]): void {
    const foundGenre = array.find(g => g.id === genre.id);
    if (foundGenre) {
      foundGenre.selected = false;
      if (array === this.genres) {
        this.selectedGenres = this.selectedGenres.filter(g => g.id !== genre.id);
      } else {
        this.leastfavoriteselectedGenres = this.leastfavoriteselectedGenres.filter(g => g.id !== genre.id);
      }
    }
  }

  submitGenres(): void {
    if (this.selectedGenres.length < 3) {
      alert('At least 3 favorite genres should be selected.');
      return;
    }
    const selectedGenreNames: string[] = this.selectedGenres.map(genre => genre.name);
    const leastselectedGenreNames: string[] = this.leastfavoriteselectedGenres.map(genre1 => genre1.name);

    this.authService.registerGenres(selectedGenreNames, leastselectedGenreNames).subscribe(
      (success: boolean) => {
        if (success) {
          console.log('Genres registered successfully!');
          this.authService.setUserEmail(this.authService.getNewUserEmail());
          location.reload();
        } else {
          console.log('Failed to register genres.');
        }
      },
      error => {
        console.error('Error submitting genres:', error);
      }
    );
  }
}
