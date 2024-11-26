import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';
import { Producto } from '../../core/interfaces/productos';
import { RouterModule } from '@angular/router';
import { PerfilService } from '../../core/services/perfil.service';
import { NUMERO_WHATSAPP } from '../../core/constantes/telefono';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {
  headerService = inject(HeaderService);
  cartService = inject(CartService);
  productosService = inject(ProductosService);
  perfilService = inject(PerfilService);
  router = inject(Router);

  productosCarrito:Producto[]= [];

  total = 0;
  @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;
  
  ngOnInit(): void {
    this.headerService.titulo.set("Carrito");
    this.cartService.carrito.forEach(async itemCarrito =>{
      const res = await this.productosService.getById(itemCarrito.idProducto)
      if(res) this.productosCarrito.push(res);
      this.calcularInformacion();
    })
  }

  eliminarProducto(idCarrito: number) {
    this.cartService.eliminarProducto(idCarrito);
    this.productosCarrito = this.productosCarrito.filter(producto => producto.idCarrito !== idCarrito);
    this.calcularInformacion();
  }
  

  calcularInformacion (){
    this.total = 0;
    for (let i = 0; i < this.cartService.carrito.length; i++) {
      this.total += this.productosCarrito[i].precio;
    }
  }

  async enviarMensaje() {
    let pedido = "";
    for (let i = 0; i < this.cartService.carrito.length; i++) {
      const itemCarrito = this.cartService.carrito[i];
      const producto = await this.productosService.getById(itemCarrito.idProducto);
      if (producto) {
        // Eliminamos saltos de línea innecesarios en las notas
        const notas = itemCarrito.notas?.trim().replace(/\n/g, ' ') || "Sin notas";
        pedido += `* ${producto.nombre} - Notas: ${notas}\n`;
      }
    }
  
    const mensaje = `
  Hola! Soy ${this.perfilService.perfil()?.nombre}, y te quiero hacer el siguiente pedido:
  ${pedido}
  Si te quieres comunicar conmigo hazlo al Nº desde el que te hablo o al ${this.perfilService.perfil()?.telefono}.
  Mi dirección de correo es: ${this.perfilService.perfil()?.correo} y mi Nº de doc: ${this.perfilService.perfil()?.documentacion}.
  Muchas gracias
  `;
  
    // Codifica completamente el mensaje
    const mensajeCodificado = encodeURIComponent(mensaje);
  
    // Generar el enlace de WhatsApp
    const link = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
    window.open(link, "_blank");
    this.dialog.nativeElement.showModal();
  }
  
  

  finalizarPedido(){
    this.cartService.vaciar();
    this.dialog.nativeElement.close();
    this.router.navigate(['/home']);
  }

  editarPedido(){
    this.dialog.nativeElement.close();
  }

}
