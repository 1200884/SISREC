// favorite-movies.component.ts

import { Component } from '@angular/core';
import { AppointmentService } from '../_services/appointment.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.css']
})
export class FavoriteMoviesComponent {

  searchTerm: string = '';
  favoriteMovies: any[] = [];
  barbeirosFiltrados: any[] = [];
  favoritos: string[] = [];
  userEmail = this.authService.getUserEmail();
  marcacaoCancelada: boolean = false;

  constructor(private appointmentService: AppointmentService, private authService: AuthService) { }

  ngOnInit() {
    this.carregarFavoriteMovies();
    console.log("future appoitnments ->" + this.favoriteMovies)
  }

  carregarFavoriteMovies() {
    // Obter os compromissos do cliente usando subscribe
    this.appointmentService.getAppointmentsFromClient(this.userEmail).subscribe(allAppointments => {
      // Obter a data atual
      const currentDate = new Date();

      // Filtrar os compromissos futuros
      this.favoriteMovies = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.day);
        return appointmentDate > currentDate;
      });
      console.log("future appointments -> " + this.favoriteMovies)
    });
  }

  cancelarCompromisso(day: string, place: string, email: string, accountable: string, type: string) {
    this.appointmentService.deleteAppointment(day, place, email, accountable, type).subscribe(
      () => {
        this.marcacaoCancelada = true;
      },
      error => {
        console.error('Erro ao cancelar a marcação:', error);
      }
    );
    setTimeout(() => {
      //this.router.navigate(['/profile']);
    }, 2300); 
  }
}
