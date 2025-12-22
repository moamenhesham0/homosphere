
export function enumToText(enumText) {
    enumText.replace(/_/g, ' ');
    enumText.toLowerCase();
    enumText.charAt(0).toUpperCase() + enumText.slice(1);

    return enumText;
}

export function textToEnum(text) {
    return text.replace(/ /g, '_').toUpperCase();
}