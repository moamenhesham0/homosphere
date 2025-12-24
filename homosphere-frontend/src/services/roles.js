import { enumToText } from '@utils/enumConverter.js';
import { ROLES } from '@constants/roles.js';

const PUBLIC_API_URL = `${import.meta.env.BASE_URL}/public`;

export async function fetchSignUpRoles() {
    const response = await fetch(`${PUBLIC_API_URL}/roles`);
    if (!response.ok) {
        console.error('Failed to fetch roles:', response.statusText);
    }
    const roles = (await response.json()).map(enumToText);
    return roles;
}

export async function fetchAllRoles() {
    const response = await fetch(`${PUBLIC_API_URL}/all-roles`);
    if (!response.ok) {
        console.error('Failed to fetch all roles:', response.statusText);
    }
    const roles = (await response.json()).map(enumToText);
    return roles;
}

export function isAdmin(user) {
    const role = enumToText(user?.role || '');
    return role === ROLES.ADMIN;
}

export function isBuyer(user) {
    const role = enumToText(user?.role || '');
    return role === ROLES.BUYER;
}

export function isSeller(user) {
    const role = enumToText(user?.role || '');
    return role === ROLES.SELLER;
}

export function isBroker(user) {
    const role = enumToText(user?.role || '');
    return role === ROLES.BROKER;
}