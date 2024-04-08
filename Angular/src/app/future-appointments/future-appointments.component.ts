// future-appointments.component.ts

import { Component } from '@angular/core';
import { AppointmentService } from '../_services/appointment.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-future-appointments',
  templateUrl: './future-appointments.component.html',
  styleUrls: ['./future-appointments.component.css']
})
export class FutureAppointmentsComponent {

  searchTerm: string = '';
  futureAppointments: any[] = [];
  barbeirosFiltrados: any[] = [];
  favoritos: string[] = [];
  userEmail = this.authService.getUserEmail();
  marcacaoCancelada: boolean = false;

  constructor(private appointmentService: AppointmentService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.carregarFutureAppointments();
    console.log("future appoitnments ->" + this.futureAppointments)
  }

  carregarFutureAppointments() {
    // Obter os compromissos do cliente usando subscribe
    this.appointmentService.getAppointmentsFromClient(this.userEmail).subscribe(allAppointments => {
      // Obter a data atual
      const currentDate = new Date();

      // Filtrar os compromissos futuros
      this.futureAppointments = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.day);
        return appointmentDate > currentDate;
      });
      console.log("future appointments -> " + this.futureAppointments)
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
      this.router.navigate(['/profile']);
    }, 2300); 
  }
}
