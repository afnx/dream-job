'use client';

import React, { useState, useRef } from 'react';
import { ArrowRight, LoaderPinwheel } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingText } from './LoadingText';

interface SearchInputProps {
    value?: string;
    onSubmit: (_value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export function SearchInput({
    value = '',
    onSubmit,
    placeholder = "I want to work with animals in San Francisco with hourly pay of $20...",
    isLoading = false
}: SearchInputProps) {
    const [inputValue, setInputValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading && inputValue.trim()) {
            onSubmit(inputValue);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow new line
                return;
            } else {
                e.preventDefault(); // Prevent new line
                setIsFocused(false); // Blur the textarea
                if (!isLoading && inputValue.trim()) {
                    onSubmit(inputValue);
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl mx-auto"
        >
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="w-full pl-6 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors bg-white shadow-sm resize-none min-h-[60px]"
                        disabled={isLoading}
                        rows={isFocused ? 6 : 1}
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className={`absolute right-4 top-4 text-blue-500 hover:text-blue-700 disabled:text-gray-300 transition-colors ${isLoading || !inputValue.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label="Submit"
                    >
                        {isLoading ? (
                            <LoaderPinwheel className="animate-spin" size={26} />
                        ) : (
                            <ArrowRight size={26} />
                        )}
                    </button>
                </div>
            </form>

            <LoadingText
                isVisible={isLoading}
                className="mt-4"
            />
        </motion.div>
    );
}