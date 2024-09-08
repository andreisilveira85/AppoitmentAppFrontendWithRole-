import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authToken = sessionStorage.getItem('auth-token');
    const userRole = sessionStorage.getItem('user-role');

    if (authToken && userRole) {
      const requiredRoles = next.data['roles'];
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        this.router.navigate(['/not-authorized']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  getRole(): string | null {
    return sessionStorage.getItem('user-role');
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-role');
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
