'use client';

import { useEffect, useState } from 'react';
import SupabaseService from '@/lib/supabase/service';
import { Database } from '@/lib/supabase/database';
import DataTable, { Column } from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import CommentForm from '@/components/admin/forms/CommentForm';

type Comment = Database['public']['Tables']['comments']['Row'];

const columns: Column<Comment>[] = [
  { key: 'fullName', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'food', label: 'Comida' },
  {
    key: 'calification',
    label: 'Calificacion',
    render: (item) =>
      item.calification ? '★'.repeat(item.calification) : '-',
  },
  {
    key: 'review',
    label: 'Resena',
    render: (item) => {
      const rev = item.review ?? '-';
      return rev.length > 40 ? rev.substring(0, 40) + '...' : rev;
    },
  },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Comment | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Comment | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.getAllComments();
      setComments(data as Comment[]);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleEdit = (item: Comment) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleDelete = (item: Comment) => {
    setDeleteConfirm(item);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await SupabaseService.delete('comments', deleteConfirm.id);
      setDeleteConfirm(null);
      fetchComments();
    } catch {
      /* silent */
    }
  };

  const handleSubmit = async (data: { fullName: string; email: string; food: string; calification: number; review: string }) => {
    setSaving(true);
    try {
      if (editing) {
        await SupabaseService.update('comments', editing.id, data);
      }
      setModalOpen(false);
      setEditing(null);
      fetchComments();
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Resenas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona las resenas de los clientes
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : (
        <DataTable
          columns={columns}
          data={comments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title="Editar resena"
      >
        <CommentForm
          initialData={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          loading={saving}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar eliminacion"
      >
        <p className="text-gray-600 mb-6">
          Estas seguro de eliminar la resena de{' '}
          <strong>{deleteConfirm?.fullName}</strong>? Esta accion no se puede
          deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 h-11 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 h-11 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
