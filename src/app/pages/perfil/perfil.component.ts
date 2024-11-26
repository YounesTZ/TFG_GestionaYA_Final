import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from '../../core/interfaces/perfil';
import { HeaderService } from '../../core/services/header.service';
import { PerfilService } from '../../core/services/perfil.service';
import { LoginService } from '../servicios/login.service';
import { response } from 'express';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PerfilComponent {
  headerService = inject(HeaderService);
  router = inject(Router);
  perfilService = inject(PerfilService);
  loginService = inject(LoginService);

  showErrorDialog=false;

  ngOnInit(): void {
    this.headerService.titulo.set("Perfil");
    if (localStorage.getItem('user') != null) {
      this.perfil = JSON.parse(localStorage.getItem('user') || '{}');
    } else {
      this.loginService.getProfileInfo().subscribe(
        (response) => {
          this.perfil = response;
        }
      );
    }
  }

  perfil:Perfil = {
    nombre: "",
    correo: "",
    documentacion: "",
    telefono: "",
    password: '',
    apellidos: ''
  }

  showConfirmDelete: boolean = false;


  guardarDatosPerfil(){ 
    this.loginService.editEmail(this.perfil.correo).subscribe(
      (response) => {
        this.loginService.logout();
      },
      (error) => { 
        this.showErrorDialog = true;
      }
    )
  }

  cerrarSesion() {
    // Aquí puedes realizar cualquier lógica de cierre de sesión, por ejemplo, limpiar el estado del usuario
    this.loginService.logout();
    this.router.navigate(["/inicio"]); // Redirige a la página de inicio
  }

   // Mostrar el cuadro de confirmación para borrar usuario
   mostrarConfirmacion() {
    this.showConfirmDelete = true;
  }

  // Eliminar usuario y redirigir
  borrarUsuario() {
    // Elimina el perfil del localStorage
    this.loginService.deleteUser().subscribe(
      (response) => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/inicio']); // Redirige al inicio
      },
      (error) => {
        
      }
    )
 
  }

  // Cancelar la acción de borrar
  cancelarBorrado() {
    this.showConfirmDelete = false; // Cierra el cuadro de confirmación
  }
}

