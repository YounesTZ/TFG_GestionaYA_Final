import { Injectable } from '@angular/core';
import { Cart } from '../interfaces/carrito';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  carrito: Cart[] = [];

  constructor() {
    const cart = localStorage.getItem("cart");
    if (cart) {
      this.carrito = JSON.parse(cart);
    }
  }

  agregarProducto(idProducto: number, notas: string) {
    const idCarrito = new Date().getTime();  // Crea un ID único para cada producto
    const nuevoProducto: Cart = { idCarrito, idProducto, notas };
    this.carrito.push(nuevoProducto);
    this.actualizarAlmacenamiento();
  }

  eliminarProducto(idCarrito: number) {
    // Filtra el carrito eliminando solo el producto cuyo idCarrito coincida con el proporcionado
    this.carrito = this.carrito.filter(producto => producto.idCarrito !== idCarrito);
    if (this.carrito.length === 0) localStorage.removeItem("cart");
    this.actualizarAlmacenamiento();
  }

  actualizarAlmacenamiento() {
    localStorage.setItem("cart", JSON.stringify(this.carrito));
  }

  vaciar(){
    this.carrito = [];
    localStorage.removeItem("cart");
  }
}
