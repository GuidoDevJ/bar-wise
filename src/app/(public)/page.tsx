import MainContainerCategory from '@/components/container/MainContainerCategory/MainContainerCategory';

type MainContainerItems = {
  goTo: string;
  imgSrc: string;
  title: string;
};

const mainContainers: MainContainerItems[] = [
  {
    goTo: '/suggestions',
    imgSrc: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop',
    title: 'Sugerencias',
  },
  {
    goTo: '/foods',
    imgSrc: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
    title: 'Comidas',
  },
  {
    goTo: '/drinks',
    imgSrc: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&auto=format&fit=crop',
    title: 'Bebidas',
  },
  {
    goTo: '/coctels',
    imgSrc: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop',
    title: 'Tragos',
  },
];

export default function Home() {
  return (
    <div className="w-[80vw] mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
      {mainContainers.map((container, index) => (
        <div key={index} className="w-full h-full">
          <MainContainerCategory
            goTo={container.goTo}
            imgSrc={container.imgSrc}
            title={container.title}
          />
        </div>
      ))}
    </div>
  );
}
