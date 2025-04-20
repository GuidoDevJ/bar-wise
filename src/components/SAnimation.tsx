'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const colors = ['#F06E2F', '#F69524', '#5D2886CC'];
const sizeClasses = ['w-6 h-6', 'w-8 h-8', 'w-10 h-10'];
const count = 15;
const containerWidth = 160;
const containerHeight = 350;

// Coordenadas fijas que dibujan una "S" (15 puntos)
const sShapePositions = [
  { x: 42, y: 16 }, // Bloque 0
  { x: 80, y: 20 }, // Bloque 1
  { x: 100, y: 30 }, // Bloque 2
  { x: 20, y: 30 }, // Bloque 3
  { x: 32, y: 4 }, // Bloque 4
  { x: 16, y: 80 }, // Bloque 5 
  { x: 70, y: 122 }, // Bloque 6 
  { x: 100, y: 150 }, // Bloque 7
  { x: 100, y: 170 }, // Bloque 8
  { x: 109, y: 185 }, // Bloque 8 
  { x: 58, y: 216 }, // Bloque 8  
  { x: 92, y: 195 }, // Bloque 8
  { x: 40, y: 220 }, // Bloque 8 ->
  { x: 0, y: 200 }, // Bloque 8
  { x: 1, y: 48 }, // Bloque 8
  { x: 0, y: 200 }, // Bloque 8
];

// Genera posiciones iniciales dispersas (dentro/fuera del contenedor)
const generateScattered = () =>
  Array.from({ length: count }, () => ({
    x: Math.random() * (containerWidth * 1.5) - containerWidth * 0.25,
    y: Math.random() * (containerHeight * 1.5) - containerHeight * 0.25,
  }));
const scatteredPositions = generateScattered();

const Block = ({ index, toShape }: { index: number; toShape: boolean }) => {
  const initial = scatteredPositions[index];
  const final = sShapePositions[index];
  const color = colors[index % colors.length];
  const size = sizeClasses[index % sizeClasses.length];

  return (
    <motion.div
      className={`absolute rounded-full ${size}`}
      style={{ backgroundColor: color }}
      initial={{ x: initial.x, y: initial.y }}
      animate={
        toShape ? { x: final.x, y: final.y } : { x: initial.x, y: initial.y }
      }
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 12,
        delay: index * 0.03, // cascada suave
      }}
    />
  );
};

export default function SAnimation() {
  const [toShape, setToShape] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / containerWidth;
      const scaleY = window.innerHeight / containerHeight;
      setScale(Math.min(scaleX, scaleY));
    };
  
    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setToShape(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-amber-200 relative overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 origin-center"
       style={{
    transform: `translate(-50%, -50%) scale(${scale})`,
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
  }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Block key={i} index={i} toShape={toShape} />
        ))}
      </div>
    </div>
  );
}
