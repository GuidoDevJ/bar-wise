import ToogleFoodOptions from "@/components/toggle/FoodsOptions";
export default function Foods() {
const dishes = [ { title: "Empanadas por unidad", description: "Jamon y queso, carne y pollo", price:1000 }, { title: "Tortilla de papa española", description: null, price:1000 }, { title: "Papas fritas", description: "Jamon y queso, carne y pollo", price:1000 }, { title: "Mandioca con BBQ", description: null, price:1000 } ]

  return ( 
    <div className="w-full h-[100vh] flex flex-col space-y-2">
      <ToogleFoodOptions dishes={dishes} title="Entradas"/>
      <ToogleFoodOptions dishes={dishes} title="Entradas"/>
      <ToogleFoodOptions dishes={dishes} title="Entradas"/>
      <ToogleFoodOptions dishes={dishes} title="Entradas"/>
      <ToogleFoodOptions dishes={dishes} title="Entradas"/>
      <ToogleFoodOptions dishes={dishes} title="Entradas"/>
    </div>
  );
}
