import React from 'react';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  size = 'md',
  showText = true
}) => {
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'h-8 w-8';
      case 'md': return 'h-10 w-10';
      case 'lg': return 'h-12 w-12';
      case 'xl': return 'h-16 w-16';
      default: return 'h-10 w-10';
    }
  };
  
  const getTextSizeClass = () => {
    switch(size) {
      case 'sm': return 'text-base';
      case 'md': return 'text-lg';
      case 'lg': return 'text-xl';
      case 'xl': return 'text-3xl';
      default: return 'text-lg';
    }
  };
  
  const getVariantClass = () => {
    switch(variant) {
      case 'light': return 'text-white';
      case 'dark': return 'text-[#1B3C25]';
      default: return 'text-[#1B3C25]';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Only show the image if not showing text, or both image and text */}
      <div className={`${getSizeClass()} flex items-center justify-center`}>
        <img 
          src="/assets/logos/logo2.png" 
          alt="NaattuMarket" 
          className="w-full h-full"
        />
      </div>
      
      {showText && (
        <span className={`font-bold ${getTextSizeClass()} ${getVariantClass()}`}>
          NaattuMarket
        </span>
      )}
    </div>
  );
};

export default Logo;
