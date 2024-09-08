import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  deleteAppointment(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getAppointments(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }

  getPatientAppointments(): Observable<any> {
    const userId = sessionStorage.getItem('user-id');
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/patient/${userId}`, { headers });
  }

  scheduleAppointment(appointment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}`, appointment, { headers });
  }
}

