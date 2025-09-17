import Image from 'next/image';
import DinnersSVG from '../../../public/comensales.svg';
import IngredientsSVG from '../../../public/ingredients.svg';
interface ISuggestion {
  title: string;
  description: string;
  price: number;
  ingredients?: string;
  dinners?: number;
  imgSrc: string;
}

export default function SuggestModal({
  suggestion,
  onClose,
}: {
  suggestion: ISuggestion;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {/* Info */}
        <h2 className="text-xl font-bold">{suggestion.title}</h2>
        {/* Imagen */}
        <div className="relative w-full h-48 mb-4">
          <Image
            src={suggestion.imgSrc}
            alt={suggestion.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>



        <div className="mt-3">
          {suggestion.ingredients && (
            <div className="flex">
              <Image src={IngredientsSVG} alt="" className="mr-1" />
              <p className="text-gray-800 text-sm">
                <span className="font-bold text-[16px]">Ingredientes: </span>
                {suggestion.ingredients}
              </p>
            </div>
          )}
        </div>
        <div className="mt-3">
          {suggestion.dinners && (
            <div className="flex">
              <Image src={DinnersSVG} alt="" />
              <p className="text-gray-800 text-sm">
                <span className="font-bold text-[16px]">Comensales: </span>
                {suggestion.dinners}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <span className="text-lg font-bold text-black ml-40">
            ${suggestion.price}
          </span>
        </div>
      </div>
    </div>
  );
}
