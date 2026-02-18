'use client';

import ToggleFoodOptions from '@/components/toggle/FoodsOptions';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import PageTransition from '@/components/layout/PageTransition';
import { useGroupedFoodsByType } from '@/hooks/useGetFoodsByType';

export default function Foods() {
  const { foods, loading, error } = useGroupedFoodsByType('COMIDAS');

  if (loading) return <div className="p-4"><Skeleton variant="card" count={4} /></div>;
  if (error) return <ErrorState message="Error al cargar las comidas" />;
  if (foods.length === 0) return <EmptyState message="No hay comidas disponibles" />;

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
