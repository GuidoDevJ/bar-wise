import Image from 'next/image';
import StartComplete from '../../../../public/start_complete.svg';
import StartSimple from '../../../../public/start_simple.svg';

interface ReviewCardProps {
  calification: number | null;
  food: string | null;
  review: string | null;
  fullName: string | null;
}

const ReviewCard = ({ calification, food, review, fullName }: ReviewCardProps) => {
  return (
    <div className="bg-secondary-50 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-[#1D1B20]">{fullName ?? 'Anonimo'}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              key={star}
              src={star <= (calification ?? 0) ? StartComplete : StartSimple}
              alt=""
              width={16}
              height={16}
            />
          ))}
        </div>
      </div>
      {food && <p className="text-sm font-semibold text-[#f69524]">{food}</p>}
      {review && <p className="text-sm text-slate-700 mt-1">{review}</p>}
    </div>
  );
};

export default ReviewCard;
