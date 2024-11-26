import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../core/services/productos.service';
import { Producto } from '../../core/interfaces/productos';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../core/interfaces/categorias';

@Component({
  selector: 'app-articulo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {
  headerService = inject(HeaderService);
  productosService = inject(ProductosService);
  cartService = inject(CartService);

  producto?: Producto;
  notas = "";
  monto?: number;

  constructor(private ac: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.headerService.titulo.set("Artículo");

    this.ac.params.subscribe(param => {
      if (param['id']) {
        this.productosService.getById(param['id']).then(producto => {
          this.producto = producto;
          this.headerService.titulo.set(producto!.nombre);
        });
      }
    });
  }

  agregarAlCarrito() {
    if (!this.producto) {
      alert('Producto no encontrado.');
      return;
    }
    this.cartService.agregarProducto(this.producto.id, this.notas);
    this.router.navigate(["/carrito"]);
  }
}
