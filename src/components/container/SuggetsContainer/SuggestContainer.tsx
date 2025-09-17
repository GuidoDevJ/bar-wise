import Image from 'next/image';
interface ISuggetionsItems {
  title: string;
  description: string;
  price: number;
  ingredients?: string;
  dinners?: number;
  imgSrc: string;
}
const SuggestContainer = ({
  title,
  description,
  price,
  imgSrc,
}:ISuggetionsItems) => {
  return (
    <div className="flex w-full h-[120px] flex-row justify-between items-center bg-secondary-50 shadow-lg rounded-lg">
      <div className="grow flex p-1 md:p-4">
        <div className="w-3/4 flex flex-col justify-center">
          <h2 className="font-bold text-[#1D1B20] text-[16px]">
            {title}
          </h2>
          <p className="text-[#1D1B20] text-[12px]">
            {description}
          </p>
        </div>
        <div className="flex items-end justify-center w-1/4">
          <h2 className="font-bold text-[#1D1B20] text-[18px]">${price}</h2>
        </div>
      </div>
      <div className="relative w-[150px] h-[120px]">
        <Image
          fill
          className="object-cover w-full h-full rounded-r-lg"
          src={imgSrc}
          // src="https://cdn7.kiwilimon.com/recetaimagen/13784/640x426/6139.jpg.webp"
          alt={imgSrc}
        />
      </div>
    </div>
  );
};

export default SuggestContainer;
