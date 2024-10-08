import { User } from "@/Store/UserStore/Authentication/Interfaces";
import { useState, useEffect } from 'react';
export const useOnline = () => {
    const [online, setOnline] = useState<User[]>([])
    return { online, setOnline }
}


function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export default useWindowDimensions;
