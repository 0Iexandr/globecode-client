import { FC, useEffect, useState } from 'react';

import Logo from '../components/Logo';
import BurgerMenu from '../components/BurgerMenu';
import ThemeToggle from '../components/ThemeToggle';

import { search } from '../utils/Icons';
import { burger } from '../utils/Icons';
import { useLocation, useNavigate } from 'react-router-dom';

interface Category {
  documentId: number | string;
  name: string;
}

interface HeaderProps {
  categories: Category[];
}

const Header: FC<HeaderProps> = ({ categories }) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollToSearch, setScrollToSearch] = useState(false);

  const handleSearchClick = () => {
    if (location.pathname !== '/') {
      setScrollToSearch(true);
      navigate('/');
    } else {
      const searchElement = document.getElementById('search');
      if (searchElement) {
        searchElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    if (scrollToSearch && location.pathname === '/') {
      const interval = setInterval(() => {
        const searchElement = document.getElementById('search');
        if (searchElement) {
          searchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          clearInterval(interval);
          setScrollToSearch(false);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [location.pathname, scrollToSearch]);

  return (
    <header className="flex justify-between items-center py-4 w-full container max-w-none gap-x-5 border-b">
      <button
        className="flex justify-center items-center"
        onClick={() => setIsBurgerOpen(true)}
      >
        <svg
          className="h-10 md:h-6 stroke-black dark:stroke-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {burger}
        </svg>
      </button>
      <Logo className="lg:h-20 md:h-16 h-14" isLink />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <a
          className="justify-center items-center hidden md:flex cursor-pointer"
          onClick={handleSearchClick}
        >
          <svg
            className="h-4 fill-black dark:fill-white"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {search}
          </svg>
        </a>
      </div>
      <BurgerMenu
        categories={categories}
        isBurgerOpen={isBurgerOpen}
        setIsBurgerOpen={setIsBurgerOpen}
      />
    </header>
  );
};

export default Header;
