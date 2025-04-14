// No necesitamos la importación de cookies ya que estamos usando document.cookie
// import { cookies } from 'next/headers';

export const setLocalStorage = (user: any) => {
    // Guardar en localStorage (cliente)
    if (typeof window !== 'undefined') {
        localStorage.setItem('Auth_token', JSON.stringify(user));
        // Establecer una cookie para que el middleware pueda acceder
        document.cookie = `Auth_token=${JSON.stringify(user)}; path=/; max-age=2592000`; // 30 días
    }
}

export const getLocalStorage = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('Auth_token') || '{}');
    }
    return {};
}

export const updateLocalStorage = (updateProperty: any, property: any) => {
    if (typeof window !== 'undefined') {
        let authToken = JSON.parse(localStorage.getItem('Auth_token') || '{}');
        authToken[property] = updateProperty;
        localStorage.setItem('Auth_token', JSON.stringify(authToken));
        // Actualizar también la cookie
        document.cookie = `Auth_token=${JSON.stringify(authToken)}; path=/; max-age=2592000`;
    }
}

export const removeLocalStorage = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('Auth_token');
        // Eliminar la cookie
        document.cookie = 'Auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}