'use client';

import ToggleFoodOptions from '@/components/toggle/FoodsOptions';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import PageTransition from '@/components/layout/PageTransition';
import { useGroupedFoodsByType } from '@/hooks/useGetFoodsByType';

export default function Drinks() {
  const { foods, loading, error } = useGroupedFoodsByType('BEBIDAS');

  if (loading) return <div className="p-4"><Skeleton variant="card" count={4} /></div>;
  if (error) return <ErrorState message="Error al cargar las bebidas" />;
  if (foods.length === 0) return <EmptyState message="No hay bebidas disponibles" />;

  return (
    <PageTransition>
      <div className="w-full min-h-[100vh] flex flex-col space-y-2">
        {foods.map((group) => (
          <ToggleFoodOptions
            key={group.subFoodType}
            dishes={group.items}
            title={group.subFoodType}
          />
        ))}
      </div>
    </PageTransition>
  );
}
