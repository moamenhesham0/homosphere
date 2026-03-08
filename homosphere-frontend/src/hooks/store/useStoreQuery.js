import { useSearchParams } from 'react-router-dom';
import { PROPERTY_SEARCH_PARAMS } from '@constants/storeQuery.js';
import { parseValue } from '@utils/typeParser.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
const useStoreQuery = () => {
    const [params] = useSearchParams();
    const [queryParams, setQueryParams] = useState({}) ;

    const updateQueryParams = useEffect(() => {
        const newQueryParams = {}
        for (let key in params) {
            let paramConfig = PROPERTY_SEARCH_PARAMS[key] || null;
            if (paramConfig) newQueryParams[key] = parseValue(key, paramConfig.type);
        }
        setQueryParams(newQueryParams);
    }, [params]);


    return queryParams;
};

