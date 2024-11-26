import { Categoria } from "./categorias";

export interface Producto{
    idCarrito: number;
    id: number,
    nombre: string,
    precio: number,
    esPresencial: boolean,
    esOnline: boolean,
    informacion: string,
    seNecesita: string,
    fotoUrl: string
}