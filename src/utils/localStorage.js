// src/utils/localStorage.js

// Función para guardar datos en el localStorage
export const saveToLocalStorage = (key, data) => {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        console.error("Error saving to localStorage: ", error);
    }
};

// Función para obtener datos del localStorage
export const loadFromLocalStorage = (key) => {
    try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) {
            return undefined;
        }
        return JSON.parse(serializedData);
    } catch (error) {
        console.error("Error loading from localStorage: ", error);
        return undefined;
    }
};

// Función para eliminar datos del localStorage
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage: ", error);
    }
};

