import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../core/services/productos.service';
import { Busqueda } from '../../core/interfaces/busqueda';
import { Producto } from '../../core/interfaces/productos';
import { TarjetaProductoComponent } from "../../core/components/tarjeta-producto/tarjeta-producto.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule, TarjetaProductoComponent, RouterModule],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent {
  headerService = inject(HeaderService);
  ProductosService = inject(ProductosService);
  productos:WritableSignal<Producto[]> = signal([]);
  
  ngOnInit(): void {
    this.headerService.titulo.set("Buscar");
    this.ProductosService.getAll().then(res => this.productos.set(res));
  }

  parametrosBusqueda:Busqueda = {
    texto: "",
    servicioPresencial: false,
    servicioOnline: false,
  }

  async buscar(){
    this.productos.set(await this.ProductosService.buscar(this.parametrosBusqueda));
  }

}
