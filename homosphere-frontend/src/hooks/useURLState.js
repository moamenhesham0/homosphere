import { useCallback, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export const useURLState = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const currentURL = useMemo(() => {
        const queryString = searchParams.toString();
        return queryString ? `${location.pathname}?${queryString}` : location.pathname;
    }, [location.pathname, searchParams]);

    const updateURLState = useCallback(
        (nextParams = {}, options = { replace: true }) => {
            const safeParams = isPlainObject(nextParams) ? nextParams : {};
            const newParams = new URLSearchParams();

            Object.keys(safeParams).forEach((key) => {
                const value = safeParams[key];
                if (value === undefined || value === null || value === '') {
                    return;
                }

                newParams.set(key, String(value));
            });

            newParams.sort();
            const currentParams = new URLSearchParams(searchParams);
            currentParams.sort();

            if (newParams.toString() !== currentParams.toString()) {
                setSearchParams(newParams, options);
            }
        },
        [searchParams, setSearchParams],
    );

    const getParam = useCallback(
        (key, fallback = '') => {
            const value = searchParams.get(key);
            return value === null ? fallback : value;
        },
        [searchParams],
    );

    return {
        currentURL,
        searchParams,
        getParam,
        updateURLState,
    };
};
