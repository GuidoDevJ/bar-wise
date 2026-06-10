'use client';

import { useEffect, useState } from 'react';
import SupabaseService from '@/lib/supabase/service';

interface AdminUser {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getToken = async () => {
    const { data: { session } } = await SupabaseService.client.auth.getSession();
    return session?.access_token ?? null;
  };

  const fetchUsers = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) return;
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    setError(null);
    setSuccess(null);

    const token = await getToken();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: inviteEmail }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? 'Error al invitar usuario');
    } else {
      setSuccess(`Invitación enviada a ${inviteEmail}`);
      setInviteEmail('');
      fetchUsers();
    }
    setInviting(false);
    setTimeout(() => { setError(null); setSuccess(null); }, 5000);
  };

  const handleDelete = async (id: string, email: string | undefined) => {
    if (!confirm(`¿Eliminar el acceso de ${email}? Esta acción no se puede deshacer.`)) return;

    const token = await getToken();
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? 'Error al eliminar usuario');
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
    setTimeout(() => setError(null), 5000);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Usuarios Admin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestioná quién tiene acceso al panel de administración.
        </p>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Invitar nuevo administrador</h2>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
          />
          <button
            type="submit"
            disabled={inviting}
            className="px-5 py-2 bg-secondary-600 hover:bg-secondary-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            {inviting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {inviting ? 'Enviando...' : 'Invitar'}
          </button>
        </form>

        {success && <p className="mt-3 text-sm text-green-600 font-medium">✓ {success}</p>}
        {error   && <p className="mt-3 text-sm text-red-600 font-medium">✗ {error}</p>}

        <p className="mt-3 text-xs text-gray-400">
          El usuario recibirá un email con un enlace para crear su contraseña y acceder al panel.
        </p>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">
            Administradores activos
            {!loading && (
              <span className="ml-2 text-sm font-normal text-gray-400">({users.length})</span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay usuarios registrados.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Creado</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Último acceso</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-800">{u.email}</td>
                  <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{formatDate(u.created_at)}</td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{formatDate(u.last_sign_in_at)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id, u.email)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
