import Image from 'next/image';

const SuggestContainer = () => {
  return (
    <div className="flex w-full h-[120px] flex-row justify-between items-center bg-secondary-50 shadow-lg rounded-lg">
      <div className="grow flex p-1 md:p-4">
        <div className="w-3/4 flex flex-col justify-center">
          <h2 className="font-bold text-[#1D1B20] text-[16px]">
            Pollo al verdeo
          </h2>
          <p className="text-[#1D1B20] text-[12px]">
            El pollo al verdeo es un plato típico de la cocina argentina.
          </p>
        </div>
        <div className="flex items-end justify-center w-1/4">
          <h2 className="font-bold text-[#1D1B20] text-[18px]">$9.99</h2>
        </div>
      </div>
      <div className="relative w-[150px] h-[120px]">
        <Image
          fill
          className="object-cover w-full h-full rounded-r-lg"
          src="https://cdn7.kiwilimon.com/recetaimagen/13784/640x426/6139.jpg.webp"
          alt=""
        />
      </div>
    </div>
  );
};

export default SuggestContainer;
