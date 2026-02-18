'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '@/lib/supabase/database';

type FoodTypes = Database['public']['Enums']['FoodTypes'];
type SubFoodTypes = Database['public']['Enums']['SubFoodTypes'];

const FOOD_TYPES: FoodTypes[] = ['COMIDAS', 'BEBIDAS', 'TRAGOS'];

const SUB_FOOD_TYPE_MAP: Record<FoodTypes, SubFoodTypes[]> = {
  COMIDAS: ['ENTRADAS', 'PRINCIPALES', 'GUARNICIONES', 'PIZZAS', 'SANDWICHES'],
  BEBIDAS: ['CERVEZAS', 'VINOS', 'ESPUMANTES', 'BEBIDAS SIN ALCOHOL'],
  TRAGOS: [],
};

interface FoodFormData {
  title: string;
  description: string;
  price: number;
  type: FoodTypes;
  subFoodType: SubFoodTypes | '';
}

interface FoodFormProps {
  initialData?: {
    title: string | null;
    description: string | null;
    price: number | null;
    type: FoodTypes | null;
    subFoodType: SubFoodTypes | null;
  };
  onSubmit: (data: FoodFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function FoodForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: FoodFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FoodFormData>({
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      type: initialData?.type ?? 'COMIDAS',
      subFoodType: initialData?.subFoodType ?? '',
    },
  });

  const selectedType = watch('type');
  const subTypes = SUB_FOOD_TYPE_MAP[selectedType] ?? [];

  useEffect(() => {
    if (!initialData) {
      setValue('subFoodType', '');
    }
  }, [selectedType, initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo *
        </label>
        <select
          {...register('type', { required: 'El tipo es obligatorio' })}
          className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {FOOD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {subTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-tipo
          </label>
          <select
            {...register('subFoodType')}
            className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Sin sub-tipo</option>
            {subTypes.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      )}

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
