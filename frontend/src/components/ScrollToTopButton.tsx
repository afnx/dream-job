import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 1000);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return visible ? (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white bg-opacity-60 backdrop-blur-md text-gray-800 shadow-2xl hover:bg-blue-500 hover:text-white hover:bg-opacity-80 transition-all duration-300 cursor-pointer"
            aria-label="Scroll to top"
        >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    ) : null;
}