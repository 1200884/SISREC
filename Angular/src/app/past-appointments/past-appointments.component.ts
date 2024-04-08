import { Component } from '@angular/core';
import { AppointmentService } from '../_services/appointment.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { Appointment } from '../_models/Appointment';

@Component({
  selector: 'app-past-appointments',
  templateUrl: './past-appointments.component.html',
  styleUrls: ['./past-appointments.component.css']
})
export class PastAppointmentsComponent {

  p: number = 1;
  searchTerm: string = '';
  pastAppointments: Appointment[] = [];
  barbeirosFiltrados: any[] = [];
  favoritos: string[] = [];
  userEmail = this.authService.getUserEmail();

  constructor(private appointmentService: AppointmentService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.carregarPastAppointments();
    console.log("past appoitnments ->" + this.pastAppointments)
  }

  carregarPastAppointments() {
    // Obter os compromissos do cliente usando subscribe
    this.appointmentService.getAppointmentsFromClient(this.userEmail).subscribe(allAppointments => {
      // Obter a data atual
      const currentDate = new Date();

      // Filtrar os compromissos futuros
      this.pastAppointments = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.day); // Certifique-se de que a propriedade 'day' existe no objeto do compromisso
        console.log("appointmentdate= " + appointmentDate)
        console.log("current date -> " + currentDate)
        return appointmentDate < currentDate;
      });
      this.pastAppointments.reverse();
      console.log("past appointments -> " + this.pastAppointments)
    });
  }


}
