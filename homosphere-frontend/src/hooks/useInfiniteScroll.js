import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function normalizeResult(result) {
    if (Array.isArray(result)) {
        return {
            items: result,
            hasMore: result.length > 0,
        };
    }

    return {
        items: Array.isArray(result?.items) ? result.items : [],
        hasMore: Boolean(result?.hasMore),
    };
}

export const useInfiniteScroll = (fetchingFn, dependencies = []) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // const [limits, setLimits] = useState({
    //     minPrice : '',
    //     maxPrice : '',
    //     minLotArea: '',
    //     maxLotArea: '',
    //     minPropertyArea: '',
    //     maxPropertyArea: '',
    //     minBedroom: '',
    //     maxBedroom: '',
    //     minBathroom: '',
    //     maxBathroom: ''
    // });

    const observer = useRef(null);
    const isResettingRef = useRef(false);
    const dependencyKey = useMemo(() => JSON.stringify(dependencies), [dependencies]);

    useEffect(() => {
        isResettingRef.current = true;
        setItems([]);
        setPage(0);
        setHasMore(true);
    }, [dependencyKey]);

    const loadNextPage = useCallback(() => {
        if (isLoading || !hasMore) {
            return;
        }

        setPage((prevPage) => prevPage + 1);
    }, [hasMore, isLoading]);

    const lastElementRef = useCallback(
        (node) => {
            if (isLoading || !hasMore) {
                return;
            }

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting) {
                    loadNextPage();
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [hasMore, isLoading, loadNextPage],
    );

    useEffect(() => {
        if (isResettingRef.current && page !== 0) {
            return;
        }

        if (isResettingRef.current && page === 0) {
            isResettingRef.current = false;
        }

        let ignore = false;

        const fetchItems = async () => {
            setIsLoading(true);

            try {
                const result = await fetchingFn(page, dependencies);
                const normalized = normalizeResult(result);
                // getNewLimits(normalized.items);

                if (!ignore) {
                    setItems((prev) => (page === 0 ? normalized.items : [...prev, ...normalized.items]));
                    setHasMore(normalized.hasMore);
                }
            } catch (error) {
                if (!ignore) {
                    console.error('Error fetching items:', error);
                    setHasMore(false);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        fetchItems();

        return () => {
            ignore = true;
        };
    }, [dependencyKey, fetchingFn, page]);

    // function getNewLimits(items) {
    //     const newLimits = { ...limits };
    //     for (const item of items) {
    //         newLimits.minPrice = newLimits.minPrice === '' ? item.price : Math.min(newLimits.minPrice, item.price);
    //         newLimits.maxPrice = newLimits.maxPrice === '' ? item.price : Math.max(newLimits.maxPrice, item.price);
    //         newLimits.minLotArea = newLimits.minLotArea === '' ? item.lotAreaSqFt : Math.min(newLimits.minLotArea, item.lotAreaSqFt);
    //         newLimits.maxLotArea = newLimits.maxLotArea === '' ? item.lotAreaSqFt : Math.max(newLimits.maxLotArea, item.lotAreaSqFt);
    //         newLimits.minPropertyArea = newLimits.minPropertyArea === '' ? item.propertyAreaSqFt : Math.min(newLimits.minPropertyArea, item.propertyAreaSqFt);
    //         newLimits.maxPropertyArea = newLimits.maxPropertyArea === '' ? item.propertyAreaSqFt : Math.max(newLimits.maxPropertyArea, item.propertyAreaSqFt);
    //         newLimits.minBedroom = newLimits.minBedroom === '' ? item.bedrooms : Math.min(newLimits.minBedroom, item.bedrooms);
    //         newLimits.maxBedroom = newLimits.maxBedroom === '' ? item.bedrooms : Math.max(newLimits.maxBedroom, item.bedrooms);
    //         newLimits.minBathroom = newLimits.minBathroom === '' ? item.bathrooms : Math.min(newLimits.minBathroom, item.bathrooms);
    //         newLimits.maxBathroom = newLimits.maxBathroom === '' ? item.bathrooms : Math.max(newLimits.maxBathroom, item.bathrooms);
    //     }
    //     console.log(`Limits updated: ${JSON.stringify(newLimits)}`);
    //     setLimits(newLimits);
    // }

    return {
        items,
        page,
        isLoading,
        hasMore,
        loadNextPage,
        lastElementRef,
        // limits,
    };
};
