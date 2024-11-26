import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/productos';
import { Categoria } from '../interfaces/categorias';
import { Busqueda } from '../interfaces/busqueda';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor() { }

  async getByCategoria(id: number): Promise<Producto[]> {
    const res = await fetch("./../../../assets/data/database.json");
    const resJson: Categoria[] = await res.json();
    const productos = resJson.find(categoria => categoria.id === id)?.productos;
    if (productos) return productos;
    return [];
  }

  async getAll(): Promise<Producto[]> {
    const res = await fetch("./../../../assets/data/database.json");
    const resJson: Categoria[] = await res.json();
    let productos: Producto[] = [];
    resJson.forEach(categoria => {
      productos = [...productos, ...categoria.productos];
    });
    return productos;
  }

  async getById(id: number): Promise<Producto | undefined> {
    const productos = await this.getAll();
    const productoElegido = productos.find(producto => producto.id === id);
    return productoElegido ? productoElegido : undefined;
  }

  async buscar(parametros: Busqueda) {
    const productos = await this.getAll();  // Obtiene todos los productos
    const productosFiltrados = productos.filter(producto => {
      // Verifica si se requiere servicio presencial y si el producto no lo ofrece
      if (parametros.servicioPresencial && !producto.esPresencial) return false;
      // Verifica si se requiere servicio online y si el producto no lo ofrece
      if (parametros.servicioOnline && !producto.esOnline) return false;
      // Filtra por el texto de búsqueda en el nombre del producto
      const busquedaTitulo = producto.nombre.toLowerCase().includes(parametros.texto.toLowerCase());
      // Si el texto no coincide, no incluye el producto
      if (!busquedaTitulo) return false;
      // Si pasa todas las condiciones, retorna true
      return true;
    });    
    // Retorna los productos filtrados
    return productosFiltrados;
}


}
