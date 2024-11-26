import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { ProductosService } from '../../core/services/productos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Producto } from '../../core/interfaces/productos';
import { TarjetaProductoComponent } from '../../core/components/tarjeta-producto/tarjeta-producto.component';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../../core/services/categorias.service';
import { Categoria } from '../../core/interfaces/categorias';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [TarjetaProductoComponent, CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  headerService = inject(HeaderService);
  categoriaService = inject(CategoriasService);
  ac = inject(ActivatedRoute);
  productos: WritableSignal<Producto[]> = signal([]);
  
  async ngOnInit(): Promise<void> {
    this.ac.params.subscribe(async params => {
      const id = parseInt(params['id'], 10);
      try {
        const categoria = await this.categoriaService.getById(id);
        if (categoria) {
          this.productos.set(categoria.productos);
          this.headerService.titulo.set(categoria.nombre);
        } else {
          console.warn('Categoría no encontrada');
        }
      } catch (error) {
        console.error('Error al obtener la categoría:', error);
      }
    });
  }
}


