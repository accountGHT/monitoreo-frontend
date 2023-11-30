export function handleError(error) {
    let errorMessage = 'Ocurrió un error en la solicitud.';
    let errorCode = null;
    let responseData = null;

    if (error.response) {
        errorCode = error.response.status;
        responseData = error.response.data;

        if (errorCode === 401) {
            errorMessage = 'No estás autorizado para realizar esta acción.';
        } else if (errorCode === 403) {
            errorMessage = 'No tienes permiso para acceder a este recurso.';
        } else if (errorCode === 404) {
            errorMessage = 'El recurso solicitado no se encontró en el servidor.';
        } else if (errorCode >= 500) {
            errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
        } else {
            errorMessage = `Error ${errorCode}: ${error.response.statusText}`;
        }
    } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor.';
    } else {
        errorMessage = 'Error en la configuración de la solicitud.';
    }

    console.error('Código de error HTTP:', errorCode);
    console.error('Respuesta del servidor:', responseData);

    return {
        // success: false,
        error: true,
        errorCode,
        errorMessage,
        responseData,
    };
}