import React from 'react';

const Title = ({ title, subTitle }) => {
  return (
    <div className={`flex flex-col`}>
        <h1 className='font-medium text-3xl'>{title}</h1>
        <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-xl'>{subTitle}</p>
    </div>
  );
};

export default Title;