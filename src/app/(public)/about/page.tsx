import PageTransition from '@/components/layout/PageTransition';

export default function About() {
  return (
    <PageTransition>
      <div className="w-[90%] md:w-[70%] max-w-[700px] mx-auto flex flex-col gap-6 py-4">
        <h1 className="text-3xl font-bold text-[#5d2886]">Bar Wise</h1>

        <section>
          <h2 className="text-xl font-semibold mb-2">Sobre nosotros</h2>
          <p className="text-slate-700 leading-relaxed">
            Bienvenidos a Bar Wise, tu lugar favorito para disfrutar de las mejores
            comidas, bebidas y tragos en un ambiente unico. Ofrecemos una experiencia
            gastronomica con platos cuidadosamente elaborados y una carta de bebidas
            para todos los gustos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Horarios de atencion</h2>
          <div className="bg-secondary-50 rounded-lg p-4 shadow-md">
            <div className="flex justify-between py-1">
              <span className="text-slate-700">Lunes a Viernes</span>
              <span className="font-medium">18:00 - 02:00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-700">Sabados</span>
              <span className="font-medium">12:00 - 03:00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-700">Domingos</span>
              <span className="font-medium">12:00 - 00:00</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contacto</h2>
          <div className="flex flex-col gap-2 text-slate-700">
            <p>Av. Libertador, F. Quiroga y, N3364 San Vicente, Misiones</p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
