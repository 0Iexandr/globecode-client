import { FC } from 'react';

import Hero from '../views/Hero';
import Categories from '../views/Categories';
import About from '../views/About';
import Disclaimer from '../views/Disclaimer';
import SearchBar from '../views/SearchBar';

interface Category {
  documentId: number | string;
  name: string;
}

interface HomeProps {
  categories: Category[];
}

const Home: FC<HomeProps> = ({ categories }) => {
  return (
    <div>
      <Hero />
      <SearchBar />
      <Categories categories={categories} />
      <About />
      <Disclaimer />
    </div>
  );
};

export default Home;
