import MainContainerCategory from '@/components/container/MainContainerCategory/MainContainerCategory';
import MainLayout from '@/components/layout/MainLayout';

const mainContainers = [
  {
    goTo: '/category',
    imgSrc:
      'https://tiendaabrasadorencasa.com/cdn/shop/articles/11.png?v=1704976118',
    title: 'Sugerencias',
  },
  {
    goTo: '/food',
    imgSrc:
      'https://tiendaabrasadorencasa.com/cdn/shop/articles/11.png?v=1704976118',
    title: 'Comidas',
  },
  {
    goTo: '/drinks',
    imgSrc:
      'https://tiendaabrasadorencasa.com/cdn/shop/articles/11.png?v=1704976118',
    title: 'Bebidas',
  },
  {
    goTo: '/coctels',
    imgSrc:
      'https://tiendaabrasadorencasa.com/cdn/shop/articles/11.png?v=1704976118',
    title: 'Tragos',
  },
];

export default function Home() {
  return (
    <MainLayout>
      <div className="m-4 w-[80vw] grid grid-cols-1 md:grid-cols-3 gap-4">
        {mainContainers.map((container, index) => (
          <div key={index} className="w-full h-full">
            <MainContainerCategory goTo={ container.goTo} imgSrc={container.imgSrc} title={container.title} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
