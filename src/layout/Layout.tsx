import { ReactNode, FC } from 'react';
import Footer from './Footer';
import Header from './Header';

interface Category {
  documentId: number | string;
  name: string;
}

interface LayoutProps {
  children: ReactNode;
  categories: Category[];
}

const Layout: FC<LayoutProps> = ({ children, categories }) => {
  return (
    <div>
      <Header categories={categories} />
      <main>{children}</main>
      <Footer categories={categories} />
    </div>
  );
};

export default Layout;
