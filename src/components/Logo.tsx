import { FC } from 'react';

import logo from '../assets/img/logo.png';

type LogoProps = {
  className?: string;
  isLink?: boolean;
};

const Logo: FC<LogoProps> = ({ className = '', isLink = false }) => {
  const logoImage = (
    <img src={logo} alt="logo" className={`h-20 ${className}`} />
  );

  return isLink ? (
    <a href="/" className="inline-block">
      {logoImage}
    </a>
  ) : (
    logoImage
  );
};

export default Logo;
