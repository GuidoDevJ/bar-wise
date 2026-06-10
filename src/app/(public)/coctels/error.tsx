'use client';

export default function CoctelsError({ reset }: { reset: () => void }) {
  return (
    <div className="p-4 flex flex-col items-center gap-4 text-center">
      <p className="text-red-500">Error inesperado al cargar los tragos.</p>
      <button onClick={reset} className="text-sm underline text-gray-600">Reintentar</button>
    </div>
  );
}
