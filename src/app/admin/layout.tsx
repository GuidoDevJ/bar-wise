'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Pedidos', href: '/admin/orders', icon: '🛒' },
  { label: 'Comidas', href: '/admin/foods', icon: '🍽️' },
  { label: 'Sugerencias', href: '/admin/suggestions', icon: '⭐' },
  { label: 'Reseñas', href: '/admin/comments', icon: '💬' },
  { label: 'Usuarios', href: '/admin/users', icon: '👤' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  // Login page renders without admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-secondary-800 text-white transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-secondary-700">
          <Link href="/admin" className="text-xl font-bold text-primary-400">
            Bar Wise
          </Link>
          <p className="text-secondary-300 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                  isActive
                    ? 'bg-secondary-600 text-white'
                    : 'text-secondary-200 hover:bg-secondary-700 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-200 hover:bg-secondary-700 hover:text-white transition text-sm"
          >
            <span>🌐</span>
            <span>Ver sitio publico</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={async () => {
                await signOut();
                router.push('/admin/login');
              }}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Cerrar sesion
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
