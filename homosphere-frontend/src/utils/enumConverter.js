
export function toNormalString(value) {
    const temp = value.trim()
                            .replace('_', ' ')
                            .toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
}

export function toEnum(value) {
    return value.trim()
                .replace(/\s/g, '_')
                .toUpperCase();
}