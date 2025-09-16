/* eslint-disable @next/next/no-img-element */
import Maps from '../../../public/maps_footer.svg';
import Menu from '../../../public/menu_footer.svg';
import SugerenciasSvg from '../../../public/reseñas_footer.svg';

const optionsFooter = [
  {
    title: 'Menu',
    imgSrc: Menu,
  },
  {
    title: 'Ubicacion',
    imgSrc: Maps,
  },
  {
    title: 'Reseñas',
    imgSrc: SugerenciasSvg,
  },
];  

const MainFooter = () => {
  return (
    <footer className="bg-secondary-500 flex justify-center items-center">
      <div className="w-[300px] md:w-[450px] flex justify-between items-center text-white py-4">
        {optionsFooter.map((opt, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2"
          >
            <img src={opt.imgSrc.src} alt={opt.title} />
            <span className="text-sm font-medium">{opt.title}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default MainFooter;
