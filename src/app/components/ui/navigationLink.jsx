import { memo } from "react";

const NavigationLink = memo(function NavigationLink({ href, text, className = '' }) {
  return (
    <div className={`bg-gray-100 dark:bg-surface-900 flex justify-center pr-10 pb-10 pt-0 font-poppins ${className}`}>
      <a href={href} className='text-blue-600 underline hover:text-blue-700'>
        Move To {text}
      </a>
    </div>
  );
};

export default NavigationLink;