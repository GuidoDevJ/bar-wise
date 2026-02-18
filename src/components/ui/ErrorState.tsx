interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = 'Ocurrio un error al cargar los datos', onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-red-600 font-medium mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-[#f69524] text-white px-4 py-2 rounded-md hover:opacity-80 transition"
      >
        Reintentar
      </button>
    )}
  </div>
);

export default ErrorState;
