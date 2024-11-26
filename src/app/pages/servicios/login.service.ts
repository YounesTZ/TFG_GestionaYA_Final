import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Perfil } from '../../core/interfaces/perfil';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private backendURL: string = "http://localhost:3000";
  constructor(private http: HttpClient, private router: Router) { }

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(this.backendURL + '/login', {correo, password});
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  register(perfil: Perfil): Observable<any> {
    const { nombre, apellidos, correo, documentacion, telefono, password } = perfil;
    return this.http.post<any>(this.backendURL + '/register', {nombre, apellidos, correo, documentacion, telefono, password});
  }

  getProfileInfo(): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.backendURL + '/profile', { headers });
  }

  deleteUser(): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(this.backendURL + '/delete-user', { headers });
  }

  editEmail(email: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = {
      correo: email,
    };
    return this.http.put<any>(this.backendURL + '/update-email', body, { headers });
  }
}
