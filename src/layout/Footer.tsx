import { FC } from 'react';
import Logo from '../components/Logo';
import Socials from '../components/Socials';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';

interface Category {
  documentId: number | string;
  name: string;
}

interface FooterProps {
  categories: Category[];
}

const Footer: FC<FooterProps> = ({ categories }) => {
  return (
    <footer className="bg-main grain-effect container max-w-none pt-12 flex flex-col gap-16 text-white">
      <div className="flex justify-center flex-col md:flex-row gap-12">
        <div className="flex flex-col gap-4">
          <Logo className="w-fit" />
          <p className="section__description text-slate-400 max-w-60">
            Do you want to advertise on niceadvice.com? Let’s talk about this!
            Contact us!{' '}
            <a className="text-white" href="mailto:niceadvice@gmail.com">
              niceadvice@gmail.com
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="section__description text-white">Categories</h4>
          <NavBar
            categories={categories}
            className="flex flex-col gap-y-5"
            textClassName="lg:text-2xl md:text-2xl text-xl break-words text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="section__description text-white">About</h4>
          <Link
            to="/privacy"
            className="section__description text-slate-400 dark:text-slate-400"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="section__description text-slate-400 dark:text-slate-400"
          >
            Terms
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="section__description text-white">Follow us:</h4>
          <Socials
            textClassName="text-slate-400"
            IconsClassName="fill-slate-400"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <hr className="w-full border-t-2 border-white m-0 opacity-50" />
        <p className="section__description text-skin opacity-40 text-white py-6">
          ©All Rights reserved 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
