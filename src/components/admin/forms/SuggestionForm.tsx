'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUpload from '@/components/admin/ImageUpload';

interface SuggestionFormData {
  title: string;
  description: string;
  price: number;
  imageURL: string | null;
}

interface SuggestionFormProps {
  initialData?: {
    title: string | null;
    description: string | null;
    price: number | null;
    imageURL: string | null;
  };
  onSubmit: (data: SuggestionFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function SuggestionForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: SuggestionFormProps) {
  const [imageURL, setImageURL] = useState<string | null>(
    initialData?.imageURL ?? null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuggestionFormData>({
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
    },
  });

  const onFormSubmit = (data: SuggestionFormData) => {
    return onSubmit({ ...data, imageURL });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titulo *
        </label>
        <input
          {...register('title', { required: 'El titulo es obligatorio' })}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripcion
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Precio *
        </label>
        <input
          type="number"
          step="0.01"
          {...register('price', {
            required: 'El precio es obligatorio',
            valueAsNumber: true,
            min: { value: 0, message: 'El precio debe ser positivo' },
          })}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen
        </label>
        <ImageUpload value={imageURL} onChange={setImageURL} />
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
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
