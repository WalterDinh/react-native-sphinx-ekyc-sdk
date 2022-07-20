import { useEffect, useRef, useState } from "react";

export const useCountDown = (remainingTime: number) => {
    const [time, setTime] = useState(remainingTime);
    const interval = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (interval.current) {
            clearInterval(interval.current);
        }
        setTime(remainingTime);
        interval.current = setInterval(() => {
            setTime(prevState => {
                const _time = Math.max(prevState - 1, 0);
                if (_time === 0 && interval.current) {
                    clearInterval(interval.current);
                    interval.current = undefined;
                }

                return _time;
            })
        }, 1000);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        }
    }, [setTime, remainingTime]);

    return time;
}