import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  decodeJWT(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response) => {
          sessionStorage.setItem('auth-token', response.token);
          const decodedToken: any = this.decodeJWT(response.token);
          sessionStorage.setItem('user-role', decodedToken.role);
          sessionStorage.setItem('user-id', decodedToken['user-id']);

          this.toastService.success("Login feito com sucesso!");

          this.navigateToAppointments();
        },
        error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
      });
    } else {
      this.toastService.error("Preencha todos os campos corretamente!");
    }
  }

  navigateToAppointments(): void {
    this.router.navigate(['/appointment']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
