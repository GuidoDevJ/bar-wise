import Image from "next/image"
import Link from "next/link"
import CoctelSvg from "../../../public/coctel_menu.svg"
import DrinksSvg from "../../../public/drink_menu.svg"
import FoodSvg from "../../../public/food_menu.svg"
import SugerenciasSvg from "../../../public/star_menu.svg"

const toggleBarOptions = [
  {
    title: "Sugerencias",
    imgSrc: SugerenciasSvg,
  },
  {
    title: "Comidas",
    imgSrc: FoodSvg,
  },
  {
    title: "Bebidas",
    imgSrc: DrinksSvg,
  },
  {
    title: "Tragos",
    imgSrc: CoctelSvg,
  }
]

const ToggleBarMenu = () => {
  return (
    <div className="w-[200px] h-auto bg-secondary-50 rounded-[4px] flex flex-col gap-4 p-1" >
      {toggleBarOptions.map((option, index) => (
        <Link
          key={index}
          href={`/${option.title.toLowerCase()}`}
          className="flex items-center gap-2 text-[#000] hover:bg-secondary-100 p-2 transition"
        >
          <Image src={option.imgSrc} alt={option.title} width={24} height={24} />
          <span className="text-sm font-medium">{option.title}</span>
        </Link>
      ))}
      {/* <div className="w-full h-[1px] bg-secondary-200"></div>
      <Link 
        href={"/reseñas"}
        className="flex items-center gap-2 hover:bg-secondary-100 p-2 transition"

      >
      <span className="text-sm font-medium">Ubicación</span>

      </Link>
      <Link 
        href={"/reseñas"}
        className="flex items-center gap-2 hover:bg-secondary-100 p-2 transition"

      >
      <span className="text-sm font-medium">Reseñas</span>

      </Link> */}
    </div>
  )
}

export default ToggleBarMenu
