import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from '../../core/interfaces/perfil';
import { PerfilService } from '../../core/services/perfil.service';
import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  router = inject(Router);
  perfilService = inject(PerfilService);
  loginService = inject(LoginService);

  showErrorDialog = false; // Controla la visibilidad del mensaje de error


  perfil:Perfil = {
    nombre: "",
    correo: "",
    documentacion: "",
    telefono: "",
    apellidos: '',
    password: ''
  }

  registrarse() {
    // Aquí puedes agregar lógica para registrar el usuario
    this.loginService.register(this.perfil).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.showErrorDialog = true;
      }
      // si el correo ya existe, dar un error
    );
}
}
