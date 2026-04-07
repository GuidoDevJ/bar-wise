'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SupabaseService from '@/lib/supabase/service';
import { Database } from '@/lib/supabase/database';
import DataTable, { Column } from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import SuggestionForm from '@/components/admin/forms/SuggestionForm';
import { syncUpsert, syncDelete } from '@/lib/embedSync';

type Suggestion = Database['public']['Tables']['suggestions']['Row'];

const columns: Column<Suggestion>[] = [
  {
    key: 'imageURL',
    label: 'Imagen',
    render: (item) =>
      item.imageURL ? (
        <div className="w-12 h-12 relative rounded overflow-hidden">
          <Image
            src={item.imageURL}
            alt={item.title ?? ''}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
          Sin img
        </div>
      ),
  },
  { key: 'title', label: 'Titulo' },
  {
    key: 'description',
    label: 'Descripcion',
    render: (item) => {
      const desc = item.description ?? '-';
      return desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
    },
  },
  {
    key: 'price',
    label: 'Precio',
    render: (item) => (item.price != null ? `$${item.price}` : '-'),
  },
];

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Suggestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Suggestion | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.getAllSuggestions();
      setSuggestions(data as Suggestion[]);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Suggestion) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleDelete = (item: Suggestion) => {
    setDeleteConfirm(item);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await SupabaseService.delete('suggestions', deleteConfirm.id);
      // Sync: elimina el embedding del item borrado
      void syncDelete('suggestion', deleteConfirm.id);
      setDeleteConfirm(null);
      fetchSuggestions();
    } catch {
      /* silent */
    }
  };

  const handleSubmit = async (data: { title: string; description: string; price: number; imageURL: string | null }) => {
    setSaving(true);
    try {
      if (editing) {
        await SupabaseService.update('suggestions', editing.id, data);
        // Sync: actualiza solo el embedding de este item
        void syncUpsert('suggestion', { ...data, id: editing.id });
      } else {
        const created = await SupabaseService.insert('suggestions', data) as { id: number } | null;
        // Sync: crea el embedding del nuevo item
        void syncUpsert('suggestion', { ...data, id: created?.id });
      }
      setModalOpen(false);
      setEditing(null);
      fetchSuggestions();
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sugerencias</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las sugerencias del chef
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition"
        >
          + Agregar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : (
        <DataTable
          columns={columns}
          data={suggestions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Editar sugerencia' : 'Nueva sugerencia'}
      >
        <SuggestionForm
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
          Estas seguro de eliminar <strong>{deleteConfirm?.title}</strong>? Esta
          accion no se puede deshacer.
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
