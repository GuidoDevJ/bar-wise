/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import HamburgerSVG from '../../../public/hamburger.svg';
import Search from '../../../public/search.svg';
import SearchBar from '../input/SearchMenus';
import ToggleBarMenu from '../toggle/BarMenu';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  //   const navigate = useRouter();
  //   const navigateToPost = () => navigate.push(`/`);

  const posts: any = [];

  return (
    <header className="w-full h-[10vh] flex justify-between bg-secondary-500 text-white p-4 items-center relative">
      

      <div className="flex items-center">
        <Image
          src={HamburgerSVG}
          alt="Menu icon"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
      </div>
      <h1 className='text-center text-[32px] font-bold z-0'>Bar Wise</h1>

      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: showSearch ? 1 : 0, x: showSearch ? 0 : 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative ${showSearch ? 'block' : 'hidden'}`}
        >
          <SearchBar posts={posts} />
        </motion.div>
        <Image
          src={Search}
          alt="Search icon"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={() => setShowSearch((prev) => !prev)}
        />
      </div>

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: showMenu ? 0 : '-100%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-auto w-auto shadow-lg z-501"
      >
        <ToggleBarMenu />
      </motion.div>
    </header>
  );
};

export default Header;
