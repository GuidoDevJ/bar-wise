'use client';

import SuggestContainer from '@/components/container/SuggetsContainer/SuggestContainer';
import SuggestModal from '@/components/utils/SuggestModal';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import PageTransition from '@/components/layout/PageTransition';
import { Suggestions, useGetAllSuggestions } from '@/hooks/useGetAllSuggestions';
import { useState } from 'react';

export default function SuggestionsPage() {
  const { suggestions, error, loading } = useGetAllSuggestions();
  const [selected, setSelected] = useState<Suggestions | null>(null);

  if (loading) return <div className="p-4"><Skeleton variant="card" count={3} /></div>;
  if (error) return <ErrorState message="Error al cargar las sugerencias" />;
  if (suggestions.length === 0) return <EmptyState message="No hay sugerencias disponibles" />;

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 p-4">
        {suggestions.map((sug, idx) => (
          <div key={idx} onClick={() => setSelected(sug)} className="cursor-pointer">
            <SuggestContainer
              description={sug.description}
              price={sug.price}
              title={sug.title}
              imgSrc={sug.imageURL}
            />
          </div>
        ))}

        {selected && (
          <SuggestModal suggestion={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </PageTransition>
  );
}
