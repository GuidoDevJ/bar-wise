'use client';

import { useCallback, useState } from 'react';
import FormReview from '@/components/form/review';
import ReviewCard from '@/components/container/ReviewCard/ReviewCard';
import { useGetAllComments } from '@/hooks/useGetAllComments';

export default function Review() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { comments, loading } = useGetAllComments(refreshKey);

  const handleReviewSubmitted = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8 py-4">
      <FormReview onReviewSubmitted={handleReviewSubmitted} />

      <section className="w-[90%] md:w-[70%] max-w-[700px]">
        <h2 className="text-xl font-bold mb-4">Resenas de clientes</h2>
        {loading && <p className="text-slate-500">Cargando resenas...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-slate-400">Aun no hay resenas</p>
        )}
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <ReviewCard
              key={comment.id}
              calification={comment.calification}
              food={comment.food}
              review={comment.review}
              fullName={comment.fullName}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
