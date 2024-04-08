import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './board-admin/register/register.component';
import { LoginComponent } from './login/login.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { GetUsersComponent } from './board-admin/get-users/get-users.component';
import { BoardClientComponent } from './board-client/board-client.component';
import { TesteComponent } from './teste/teste.component';
import { BoardEmployeeComponent } from './board-employee/board-employee.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { DisableEmployeeComponent } from './disable-employee/disable-employee.component';
import { SolariosComponent } from './solarios/solarios.component';
import { EsteticistasComponent } from './esteticistas/esteticistas.component';
import { CabeleireirosComponent } from './cabeleireiros/cabeleireiros.component';
import { BarbeirosComponent } from './barbeiros/barbeiros.component';
import { ExemploestabelecimentoComponent } from './estabelecimentosespecificos/exemploestabelecimento/exemploestabelecimento.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { DescriptionExampleComponent } from './Descriptions/description-example/description-example.component';
import { AppointmentExampleComponent } from './Appointments/appointment-example/appointment-example.component';
import { ProfileComponent } from './profile/profile.component';
import { PastAppointmentsComponent } from './past-appointments/past-appointments.component';
import { FutureAppointmentsComponent } from './future-appointments/future-appointments.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'users', component: GetUsersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'board-client', component: BoardClientComponent },
  { path: 'teste', component: TesteComponent },
  { path: 'board-employee', component: BoardEmployeeComponent },
  { path: 'register-employee', component: RegisterEmployeeComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'disable-employee', component: DisableEmployeeComponent },
  { path: 'solarios', component: SolariosComponent },
  { path: 'esteticistas', component: EsteticistasComponent },
  { path: 'cabeleireiros', component: CabeleireirosComponent },
  { path: 'barbeiros', component: BarbeirosComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'solario1', component: ExemploestabelecimentoComponent },
  { path: 'description1', component: DescriptionExampleComponent },
  { path: 'appointment1', component: AppointmentExampleComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'past-appointments', component: PastAppointmentsComponent },
  { path: 'future-appointments', component: FutureAppointmentsComponent },
  {path: 'account-settings', component: AccountSettingsComponent}
  //{ path: 'login/callback', component: OktaCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
