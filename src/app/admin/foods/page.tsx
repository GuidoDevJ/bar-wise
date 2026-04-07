'use client';

import { useEffect, useState } from 'react';
import SupabaseService from '@/lib/supabase/service';
import { Database } from '@/lib/supabase/database';
import DataTable, { Column } from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import FoodForm from '@/components/admin/forms/FoodForm';
import { syncUpsert, syncDelete } from '@/lib/embedSync';

type Food = Database['public']['Tables']['foods']['Row'];

const columns: Column<Food>[] = [
  { key: 'title', label: 'Titulo' },
  { key: 'type', label: 'Tipo' },
  { key: 'subFoodType', label: 'Sub-tipo' },
  {
    key: 'price',
    label: 'Precio',
    render: (item) => (item.price != null ? `$${item.price}` : '-'),
  },
];

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Food | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Food | null>(null);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.getAll('foods');
      setFoods(data as Food[]);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Food) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: Food) => {
    setDeleteConfirm(item);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await SupabaseService.delete('foods', deleteConfirm.id);
      // Sync: elimina el embedding del item borrado
      void syncDelete('food', deleteConfirm.id);
      setDeleteConfirm(null);
      fetchFoods();
    } catch {
      /* silent */
    }
  };

  const handleSubmit = async (data: { title: string; description: string; price: number; type: string; subFoodType: string }) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type as Database['public']['Enums']['FoodTypes'],
        subFoodType: (data.subFoodType || null) as Database['public']['Enums']['SubFoodTypes'] | null,
      };
      if (editing) {
        await SupabaseService.update('foods', editing.id, payload);
        // Sync: actualiza solo el embedding de este item
        void syncUpsert('food', { ...payload, id: editing.id });
      } else {
        const created = await SupabaseService.insert('foods', payload) as { id: number } | null;
        // Sync: crea el embedding del nuevo item
        void syncUpsert('food', { ...payload, id: created?.id });
      }
      setModalOpen(false);
      setEditing(null);
      fetchFoods();
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
          <h1 className="text-2xl font-bold text-gray-800">Comidas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona el menu de comidas, bebidas y tragos
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
          data={foods}
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
        title={editing ? 'Editar comida' : 'Nueva comida'}
      >
        <FoodForm
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
