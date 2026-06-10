'use client';
import CurrentLocation from "@/components/maps/currentLocation";
import Image from "next/image";
import LocationSVG from "../../../../public/location.svg";


export default function Location() {
  return (
      <div className="flex flex-col justify-center items-center">
          <div className="flex items-center">
              <Image src={LocationSVG} alt="" className="w-[20%]" />
              <h2 className="text-center self-center">Av. Libertador, F. Quiroga y, N3364 San Vicente, Misiones</h2>
          </div>
      <CurrentLocation />
    </div>
  );
}
