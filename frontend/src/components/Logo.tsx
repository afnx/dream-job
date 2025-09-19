import React from 'react';

interface LogoProps {
    shrink?: boolean;
    className?: string;
    logoMargin?: string;
}

const Logo: React.FC<LogoProps> = ({ shrink = false, className = '', logoMargin = '' }) => (
    <div className={`select-none ${className}`} style={{ userSelect: 'none' }}>
        <h1
            className={`
                font-bold text-gray-900 ${!shrink ? 'mb-4' : ''}
                ${shrink
                    ? 'text-3xl md:text-4xl '
                    : 'text-4xl md:text-6xl'
                } ${logoMargin}
            `}
        >
            {!shrink && ('Find Your ')}
            <span className="bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent">
                Dream Job
            </span>
        </h1>
        {!shrink && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Search thousands of job opportunities with AI-powered matching
            </p>
        )}
    </div>
);

export default Logo;