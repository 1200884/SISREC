import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { Appointment } from 'src/app/_models/Appointment';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { PlacesService } from 'src/app/_services/places.service';
import { addDays } from 'date-fns';
import { CalendarModule } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { AuthService } from 'src/app/_services/auth.service';
import { format } from 'date-fns';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-example',
  templateUrl: './appointment-example.component.html',
  styleUrls: ['./appointment-example.component.css']
})
export class AppointmentExampleComponent {
  selectedDate: Date = new Date(); // Adicione esta propriedade
  //selectedDate: string = '';
  selectedMinutes: string = '00'; // Adicione esta propriedade
  showavailableTimes: boolean =false;
  address: string = '';
  image: string = '';
  showButtons: boolean = true;
  showAdditionalButtons2: boolean = false;
  showAdditionalButtons3: boolean = false;
  showAdditionalButtons4: boolean = false;
  appointmentsBooked: Appointment[] = [];
  availableTimesFiltered:any[]= [];
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  availableTimes: Array<string> = []; // Adicione esta propriedade
  daysOfWeek = DAYS_OF_WEEK;
  nomeutilizador = this.authService.getName()
  emailutilizador = this.authService.getUserEmail()
  appointmentform: Appointment = {
    name: this.nomeutilizador, //"null", //this.authService.getName().toString(),
    place: "Solario 1",
    day: "null",
    accountable: "null",
    type: "null",
    email: this.emailutilizador
  };
  name: string = '';
  constructor(private appointmentService: AppointmentService, private authService: AuthService, private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.carregarSolario();
    console.log("nomeutilizador -> jaoo " + this.nomeutilizador)

    this.appointmentService
      .getAppointmentsFromPlaceAndBarber("Solario 1", "Joao")
      .subscribe(
        (appointments: Appointment[]) => {
          this.appointmentsBooked = appointments;
        },
        error => {
          console.error('Erro ao obter agendamentos:', error);
        }
      );
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 31; j = j + 30) {
        let time = i.toString() + ":" + j.toString();
        if (i < 10) {
          time = '0' + time;
        }
        if (j < 1) {
          time = time + '0';
        }
        this.availableTimes.push(time);
      }
    }

  }
  goBack(){
    this.router.navigate(['/solario1'])
  }
  goBackSleep() {
    setTimeout(() => {
      this.router.navigate(['/solario1']);
    }, 2300); 
  }
  
  goHomeSleep() {
    setTimeout(() => {
      this.router.navigate(['/board-client']);
    }, 2300); 
  }
  
  carregarSolario() {
    const nomeSolario = 'Solario 1';

    this.placesService.getPlace(nomeSolario).subscribe(
      (solario: any) => {
        this.name = solario.name;
        this.address = solario.address;
        this.image = solario.image;
      },
      error => {
        console.error('Erro ao buscar informações do solário:', error);
      }
    );

  }
  showAvailableTimes() {
    // Verifica se a data é válida
    if (!this.selectedDate) {
      // Esconde o select com as horas disponíveis
      this.showavailableTimes = false;
      return;
    }
  
    this.showavailableTimes = true;
    console.log("selecteddate is -> " + this.selectedDate)
  
      
    for (const appointment of this.appointmentsBooked) {
      const appointmentDate = appointment.day.split(" ")[0];
      const appointmentHour = appointment.day.split(" ")[1];
      console.log("AppointmentDate -> " + appointmentDate)
      console.log("AppointmentHour -> " + appointmentHour)
      console.log("this.selecteddate.tostring() -> "+this.selectedDate.toString())
      if (appointmentDate === this.selectedDate.toString()) {
        console.log("existe data já :::::::::")
        this.availableTimes = this.availableTimes.filter((time) => time !== appointmentHour);      }
    }
  
    //this.availableTimes = this.availableTimesFiltered;
  }
  
  
  registerLavarCabelo() {
    this.showButtons = false;
    this.showAdditionalButtons2 = true;
    this.appointmentform.type = "Lavar o Cabelo"
  }
  registerPintarCabelo() {
    this.showButtons = false;
    this.showAdditionalButtons2 = true;
    this.appointmentform.type = "Pintar o Cabelo"
  }
  registerCorte() {
    this.showButtons = false;
    this.showAdditionalButtons2 = true;
    this.appointmentform.type = "Corte"
  }
  registerJoao() {
    this.showAdditionalButtons2 = false;
    this.showAdditionalButtons3 = true;
    this.appointmentform.accountable = "Joao";
    this.getAppointmentsSolario1Barber();
    console.log("appointments booked -> JoaoJoao " + this.appointmentsBooked)


  }
  registerPedro() {
    this.showAdditionalButtons2 = false;
    this.showAdditionalButtons3 = true;
    this.appointmentform.accountable = "Pedro"
  }
  registerMiguel() {
    this.showAdditionalButtons2 = false;
    this.showAdditionalButtons3 = true;
    this.appointmentform.accountable = "Miguel"
    this.getAppointmentsSolario1Barber()
    console.log("appointments booked ->" + this.appointmentsBooked)
  }
  getAppointmentsSolario1Barber() {
    console.log("this.appointmentform.place ->" + this.appointmentform.place)
    console.log("this.appointmentform.accountable ->" + this.appointmentform.accountable)
    this.appointmentService
      .getAppointmentsFromPlaceAndBarber(this.appointmentform.place, this.appointmentform.accountable)
      .subscribe(
        (appointments: Appointment[]) => {
          this.appointmentsBooked = appointments;
        },
        error => {
          console.error('Erro ao obter agendamentos:', error);
        }
      );
    console.log(this.appointmentsBooked)

  }
  createAppointment() {
    this.showSuccessMessage=false;
    this.showErrorMessage=false;
    // Verificamos se a data foi selecionada
    if (!this.selectedDate) {
      console.error('Selecione uma data válida.');
      return;
    }
  
    // Verificamos se a hora foi selecionada
    if (!this.selectedMinutes) {
      console.error('Selecione uma hora válida.');
      return;
    }
  
    // Formatamos a data e hora escolhidas
    const formattedDate = format(new Date(this.selectedDate), 'yyyy-MM-dd');
    const formattedTime = this.selectedMinutes;
  
    // Combinamos a data e a hora formatadas
    const combinedDateTime = `${formattedDate} ${formattedTime}`;
  
    // Atribuímos ao appointmentform.day
    this.appointmentform.day = combinedDateTime;
  
    // Criamos o compromisso
    this.appointmentService.createAppointment(this.appointmentform).subscribe(
      (response) => {
        console.log('Compromisso criado com sucesso:', response);
        this.showSuccessMessage=true;
        this.goHomeSleep(); 

        },
      (error) => {
        console.error('Erro ao criar compromisso:', error);
        this.showErrorMessage=true;
        this.goBackSleep(); 

        if (error instanceof HttpErrorResponse) {
          console.error('Status do erro:', error.status);
          console.error('Detalhes do erro:', error.error);
        }
        // Lidar com erros, se necessário
      }
    );
  }
  


}
