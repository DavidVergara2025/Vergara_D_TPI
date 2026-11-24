import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminUsersPage, LoginPage, RegisterPage } from '@/features/auth';
import { CategoriesPage } from '@/features/categories';
import {
    AdminPedidosPage,
    AdminResumenPage,
    CarritoPage,
    CheckoutPage,
    MisPedidosPage,
} from '@/features/pedidos';
import { CatalogoPage, ProductsPage } from '@/features/products';
import { UnauthorizedPage } from '@/shared/components/UnauthorizedPage';
import { MainLayout } from '@/shared/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <MainLayout>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<CatalogoPage />} />
                <Route path="/carrito" element={<CarritoPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Rutas Protegidas por Sesión (Cliente / Admin) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/mis-pedidos" element={<MisPedidosPage />} />
                </Route>

                {/* Rutas Protegidas por Rol (Panel de Administración) */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route
                        path="/admin/resumen"
                        element={<AdminResumenPage />}
                    />
                    <Route
                        path="/admin/categorias"
                        element={<CategoriesPage />}
                    />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route
                        path="/admin/productos"
                        element={<ProductsPage />}
                    />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route
                        path="/admin/pedidos"
                        element={<AdminPedidosPage />}
                    />
                    <Route
                        path="/admin/usuarios"
                        element={<AdminUsersPage />}
                    />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </MainLayout>
    );
};