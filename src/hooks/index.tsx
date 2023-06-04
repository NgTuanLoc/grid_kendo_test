import { useState, useEffect } from "react";

const useDebounce = <T,>(
    value: T | undefined,
    delay: number
): [T | undefined, T | undefined] => {
    const [debouncedValue, setDebouncedValue] = useState<T | undefined>(value);
    const [previousValue, setPreviousValue] = useState<T | undefined>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    useEffect(() => {
        setPreviousValue(debouncedValue);
    }, [debouncedValue]);

    return [debouncedValue, previousValue];
};

export default useDebounce;
