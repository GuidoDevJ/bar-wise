import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  imgSrc: string;
  goTo: string;
};

const MainContainerCategory = ({ goTo, imgSrc, title }: Props) => {
    return (
      <Link href={goTo} className="block">
        <div className="relative w-full h-40 group overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover"
          />
  
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <h2 className="text-white text-xl font-semibold text-center">
              {title}
            </h2>
          </div>
        </div>
      </Link>
    );
  };

export default MainContainerCategory;
