import type { Categoria } from '@/features/categories';

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen_url: string;
    stock: number;
    disponible: boolean;
    activo: boolean;
    categoria_id: number;
    categoria?: Categoria | null;
}

export interface ProductosPaginados {
    total: number;
    items: Producto[];
}

export interface ProductoFormData {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen_url: string;
    stock: number;
    disponible: boolean;
    categoria_id: number;
}

export interface ProductoStockUpdate {
    stock: number;
    disponible: boolean;
}

export interface ProductoFilters {
    skip?: number;
    limit?: number;
    search?: string;
    categoria_id?: number | null;
    disponible?: boolean | null;
}