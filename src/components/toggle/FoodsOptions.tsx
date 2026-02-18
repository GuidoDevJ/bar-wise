'use client';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { KeyboardEvent, memo, useState } from 'react';
interface Dish {
  id: number;
  title: string | null;
  description?: string | null;
  price: number| null;
}

interface ToggleFoodOptionsProps {
  dishes: Dish[];
  title: string;
}

const DishItem = memo(({ dish }: { dish: Dish }) => (
  <li
    role="menuitem"
    tabIndex={0}
    className="cursor-pointer text-slate-800 text-sm flex justify-between items-center rounded-md p-3 
               hover:bg-slate-100 focus:bg-slate-200 focus:outline-none"
  >
    <div className='flex flex-col'>
      <span className="font-semibold">{dish.title}</span>
      {dish.description && (
        <span className="text-xs text-slate-500">{dish.description}</span>
      )}
    </div>

    <span className="text-xs text-slate-700 mt-1">${dish.price}</span>
  </li>
));
DishItem.displayName = 'DishItem';

const ToggleFoodOptions = ({ dishes,title }: ToggleFoodOptionsProps) => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') setOpenMenu((prev) => !prev);
    if (e.key === 'Escape') setOpenMenu(false);
    // Se puede agregar ArrowUp / ArrowDown aquí para navegar por items
  };

  return (
    <div className="relative inline-block w-full text-left top-1">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={openMenu}
        aria-controls="food-options-menu"
        onClick={() => setOpenMenu((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={clsx(
          'w-full text-left rounded-md bg-[#f69524] py-2 px-4 text-sm font-semibold text-black',
          'border border-transparent transition-all shadow-md hover:shadow-lg'
        )}
      >
      {title}
      </button>

      <AnimatePresence>
        {openMenu && (
          <motion.ul
            id="food-options-menu"
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mt-2 min-w-[220px] rounded-lg border border-slate-200 bg-[#EFEAF3] p-1.5 shadow-lg origin-top"
          >
            {dishes.map((dish) => (
              <DishItem key={dish.id} dish={dish} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToggleFoodOptions;
