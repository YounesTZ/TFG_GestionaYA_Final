import { Injectable } from '@angular/core';
import { Categoria } from '../interfaces/categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor() { }

  async getAll(): Promise<Categoria[]> {
    const res = await fetch("./../../../assets/data/database.json");
    if (!res.ok) {
      throw new Error('Error al cargar los datos: ' + res.statusText);
    }
    const resJson: Categoria[] = await res.json();
    return resJson;
  }

  async getById(id: number): Promise<Categoria | undefined> {
    const res = await fetch("./../../../assets/data/database.json");
    if (!res.ok) {
      throw new Error('Error al cargar los datos: ' + res.statusText);
    }
    const resJson: Categoria[] = await res.json();
    return resJson.find(categoria => categoria.id === id);
  }
}



