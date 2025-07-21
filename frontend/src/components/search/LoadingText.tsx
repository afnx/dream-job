'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingTextProps {
    isVisible: boolean;
    className?: string;
}

const loadingMessages = [
    { text: "Analyzing your input", duration: 4000 },
    { text: "Finding jobs", duration: 6000 },
    { text: "Extracting job details", duration: 8000 },
    { text: "Processing results", duration: 8000 },
    { text: "Preparing your matches", duration: 3500 },
    { text: "Almost there...", duration: 0 } // 0 means stay forever
];

export function LoadingText({ isVisible, className = "" }: LoadingTextProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            setCurrentMessageIndex(0);
            return;
        }

        let timeoutId: ReturnType<typeof setTimeout>;

        const scheduleNext = (index: number) => {
            // If we're at the last message or duration is 0, don't schedule next
            if (index >= loadingMessages.length - 1 || loadingMessages[index].duration === 0) {
                return;
            }

            timeoutId = setTimeout(() => {
                setCurrentMessageIndex(index + 1);
                scheduleNext(index + 1);
            }, loadingMessages[index].duration);
        };

        // Start the scheduling
        scheduleNext(currentMessageIndex);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isVisible, currentMessageIndex]);

    if (!isVisible) return null;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-3"
            >
                {/* Animated text */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-blue-600 font-medium text-base"
                    >
                        {loadingMessages[currentMessageIndex].text}
                    </motion.span>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}