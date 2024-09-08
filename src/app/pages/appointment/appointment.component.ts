import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../services/appointment.service';
import { AuthGuard } from '../../services/auth-guard';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  appointments: any[] = [];
  newAppointment = { dateTime: '', reason: '' };
  userRole: string | null = null;
  constructor(
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private authGuard: AuthGuard
  ) { }

  ngOnInit() {
    this.userRole = this.authGuard.getRole();
    this.loadAppointments();
  }

  loadAppointments() {
    if (this.userRole === 'PATIENT') {
      this.fetchPatientAppointments();
    } else {
      this.fetchAppointments();
    }
  }

  fetchPatientAppointments() {
    this.appointmentService.getPatientAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => this.toastr.error('Falha ao carregar suas consultas.')
    });
  }

  fetchAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => this.toastr.error('Falha ao carregar as consultas.')
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.appointmentService.scheduleAppointment(this.newAppointment).subscribe({
        next: () => {
          this.toastr.success('Consulta agendada com sucesso!');
          this.loadAppointments();
          form.reset();
        },
        error: () => this.toastr.error('Falha ao agendar a consulta.')
      });
    }
  }

  confirmDeletion(id: string) {
    if (confirm('Você tem certeza que deseja excluir esta consulta?')) {
      this.deleteAppointment(id);
    }
  }

  deleteAppointment(id: string) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.toastr.success('Consulta excluída com sucesso!');
        this.loadAppointments();
      },
      error: () => this.toastr.error('Falha ao excluir a consulta.')
    });
  }

  canCreate(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'DOCTOR' || this.userRole === 'RECEPTIONIST';
  }

  canDelete(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'DOCTOR';
  }

  logout() {
    this.authGuard.logout();
  }
}



