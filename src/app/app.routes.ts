import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { AuthGuard } from './services/auth-guard';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
export const routes: Routes = [
    {
        path: "",
        component: LoginComponent
    },
    {
        path: "signup",
        component: SignUpComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "appointment",
        component: AppointmentComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PATIENT', 'DOCTOR', 'ADMIN', 'RECEPTIONIST'] }
    },
    {
        path: "appointment/patient",
        component: AppointmentComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PATIENT'] }
    },
    {
        path: "not-authorized",
        component: NotAuthorizedComponent
    },
    {
        path: "**",
        redirectTo: "/not-authorized"
    }
];
