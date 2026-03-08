
export const parseValue = (value, type) => {
    const parsers = {
        number: (val) => Number(val),
        boolean: (val) => String(val) === 'true',
        string: (val) => String(val),
    };
    return (parsers[type] || parsers.string)(value);
};