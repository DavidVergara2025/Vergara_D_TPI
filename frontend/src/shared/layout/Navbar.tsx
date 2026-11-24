import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';

const ADMIN_LINKS = [
    { to: '/admin/resumen', label: 'Resumen' },
    { to: '/admin/pedidos', label: 'Pedidos' },
    { to: '/admin/productos', label: 'Productos' },
    { to: '/admin/categorias', label: 'Categorías' },
    { to: '/admin/usuarios', label: 'Usuarios' },
];

export const Navbar = () => {
    const usuario = useAuthStore((s) => s.usuario);
    const logout = useAuthStore((s) => s.logout);
    const items = useCartStore((s) => s.items);
    const { darkMode, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const location = useLocation();

    const cantidadCarrito = items.reduce((acc, item) => acc + item.cantidad, 0);
    const isAdmin = usuario?.role === 'admin';

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-xs sticky top-0 z-40 transition-colors">
            <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight"
                    >
                        🍔 Food Store
                    </Link>

                    <nav className="flex items-center gap-2 text-sm font-semibold">
                        <Link
                            to="/"
                            className={`px-3.5 py-2 rounded-xl transition-colors ${isActive('/')
                                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            Catálogo
                        </Link>

                        <Link
                            to="/carrito"
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors ${isActive('/carrito')
                                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <span>Carrito</span>
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-600 text-white">
                                {cantidadCarrito}
                            </span>
                        </Link>

                        {usuario && (
                            <Link
                                to="/mis-pedidos"
                                className={`px-3.5 py-2 rounded-xl transition-colors ${isActive('/mis-pedidos')
                                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                Mis pedidos
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                        title={
                            darkMode
                                ? 'Cambiar a modo claro'
                                : 'Cambiar a modo oscuro'
                        }
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    {usuario ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
                                {usuario.full_name}
                                <span
                                    className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-bold ${usuario.role === 'admin'
                                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                        }`}
                                >
                                    {usuario.role}
                                </span>
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold px-3.5 py-2"
                            >
                                Ingresar
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div className="border-t border-purple-100 dark:border-purple-950/60 bg-purple-50/70 dark:bg-purple-950/25">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 mr-2">
                            Panel de Administración:
                        </span>
                        {ADMIN_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors ${isActive(link.to)
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'text-purple-800 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/40'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};