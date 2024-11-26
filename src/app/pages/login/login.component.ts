import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from '../../core/interfaces/perfil';
import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  perfil = {
    correo: '',
    password: ''
  };

  showDialog: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {}


  iniciarSesion() {
    // Aquí iría la lógica para validar el inicio de sesión
    this.loginService.login(this.perfil.correo, this.perfil.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        // guardar perfil entero
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/home']);
      },
      error: (e) => {
        console.log("error en login");
        this.showDialog = true;
      }
    }
    );
  }

  cerrarDialogo() {
    this.showDialog = false;
    this.perfil = { correo: '', password: '' }; // Limpiar campos del formulario
  }

  irARegistro() {
    this.router.navigate(['/registro']);  // Redirige al formulario de registro
  }
}

