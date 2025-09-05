import React from 'react';

interface FilledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    isDisabled?: boolean;
    text: string;
}

const FilledButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & FilledButtonProps> = ({
    isLoading,
    loadingText,
    isDisabled,
    text,
    ...props
}) => {
    return isLoading ? (
        <div className="flex justify-center items-center py-3">
            <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-2 text-indigo-500 font-medium">{loadingText || 'Loading...'}</span>
        </div>
    ) : (
        <button
            type="submit"
            className={`py-3 px-4 rounded-lg border-none font-semibold text-base transition-colors
            ${isDisabled
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-400 text-white cursor-pointer'
                }`}
            disabled={isDisabled}
            {...props}
        >
            {text}
        </button>
    );
};

export default FilledButton;