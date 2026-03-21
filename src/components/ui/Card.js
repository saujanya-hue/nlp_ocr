import React from 'react';

const Card = ({ children, className = '', title, ...props }) => {
    return (
        <div
            className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 ${className}`}
            {...props}
        >
            {title && (
                <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            )}
            {children}
        </div>
    );
};

export default Card;
