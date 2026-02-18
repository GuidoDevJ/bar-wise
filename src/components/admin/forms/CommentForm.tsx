'use client';

import { useForm } from 'react-hook-form';

interface CommentFormData {
  fullName: string;
  email: string;
  food: string;
  calification: number;
  review: string;
}

interface CommentFormProps {
  initialData?: {
    fullName: string | null;
    email: string | null;
    food: string | null;
    calification: number | null;
    review: string | null;
  };
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CommentForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormData>({
    defaultValues: {
      fullName: initialData?.fullName ?? '',
      email: initialData?.email ?? '',
      food: initialData?.food ?? '',
      calification: initialData?.calification ?? 1,
      review: initialData?.review ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <input
          {...register('fullName', { required: 'El nombre es obligatorio' })}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: { value: /^\S+@\S+$/i, message: 'Email no valido' },
          })}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comida
        </label>
        <input
          {...register('food')}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Calificacion (1-5) *
        </label>
        <select
          {...register('calification', {
            required: 'La calificacion es obligatoria',
            valueAsNumber: true,
          })}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)} ({n})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resena
        </label>
        <textarea
          {...register('review')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Actualizar'}
        </button>
      </div>
    </form>
  );
}
