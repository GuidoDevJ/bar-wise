import MainContainerCategory from '@/components/container/MainContainerCategory/MainContainerCategory';

type MainContainerItems = {
  goTo: string;
  imgSrc: string;
  title: string;
};

const mainContainers: MainContainerItems[] = [
  {
    goTo: '/suggestions',
    imgSrc:
      'https://aiejxpvrpgiclnjhhcot.supabase.co/storage/v1/object/sign/bar%20wise/sugerencias.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZmYzNGRkZS1lNDgyLTRkNGMtYmE2NC1mMTEyNTA2ZWU4Y2QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiYXIgd2lzZS9zdWdlcmVuY2lhcy53ZWJwIiwiaWF0IjoxNzU4MzkzOTMxLCJleHAiOjE3ODk5Mjk5MzF9.rpER6tbNM7J60b6_wj26-I4EeDcJJ7eZxHRGUaRZ7K0',
    title: 'Sugerencias',
  },
  {
    goTo: '/foods',
    imgSrc:
      'https://aiejxpvrpgiclnjhhcot.supabase.co/storage/v1/object/sign/bar%20wise/comidas.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZmYzNGRkZS1lNDgyLTRkNGMtYmE2NC1mMTEyNTA2ZWU4Y2QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiYXIgd2lzZS9jb21pZGFzLndlYnAiLCJpYXQiOjE3NTgzOTM2NTQsImV4cCI6MTc4OTkyOTY1NH0.GcH8if6Z9BkbUukb1UOU_YKHCsAqVMzd2S1gWh3S4E8',
    title: 'Comidas',
  },
  {
    goTo: '/drinks',
    imgSrc:
      'https://aiejxpvrpgiclnjhhcot.supabase.co/storage/v1/object/sign/bar%20wise/bebidas.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZmYzNGRkZS1lNDgyLTRkNGMtYmE2NC1mMTEyNTA2ZWU4Y2QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiYXIgd2lzZS9iZWJpZGFzLmpwZyIsImlhdCI6MTc1ODM5MzUzNSwiZXhwIjoxODQ0NzkzNTM1fQ.MTN119hngRnkZFKeyfrXMebBsucJoYSYFFppC7BlMic',
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
