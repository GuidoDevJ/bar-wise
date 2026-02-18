interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'No hay elementos para mostrar' }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <p className="text-slate-400 text-lg">{message}</p>
  </div>
);

export default EmptyState;
