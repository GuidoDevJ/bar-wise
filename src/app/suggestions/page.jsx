'use client'
import SuggestContainer from "@/components/container/SuggetsContainer/SuggestContainer";
import SuggestModal from "@/components/utils/SuggestModal";
import { useState } from "react";
const suggetions = [
    {
        title: "Pollo al verdeo",
        description: "el mejor pollo al verdeo con papas de la ciudad de corrientes",
        ingredients: "Pollo, sal, mostaza, nuez moscada",
        dinners: 2,
        price: 10,
        imgSrc: "https://cdn7.kiwilimon.com/recetaimagen/13784/640x426/6139.jpg.webp"
    },
    {
        title: "Pollo al verdeo",
        description: "el mejor pollo al verdeo con papas de la ciudad de corrientes",
        ingredients: "Pollo, sal, mostaza, nuez moscada",
        dinners: 4,
        price: 20,
        imgSrc: "https://cdn7.kiwilimon.com/recetaimagen/13784/640x426/6139.jpg.webp"
    }
]
export default function SuggetionsPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col gap-4 p-4">
      {suggetions.map((sug, idx) => (
        <div key={idx} onClick={() => setSelected(sug)}>
          <SuggestContainer
            description={sug.description}
            price={sug.price}
            title={sug.title}
            imgSrc={sug.imgSrc}
          />
        </div>
      ))}

      {/* Modal */}
      {selected && (
        <SuggestModal
          suggestion={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}