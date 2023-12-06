
export const fnFormatDate = (fecha) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString(undefined, options);
}

export const fnFormatTime = (hora) => {
    // const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(hora).toLocaleTimeString(undefined, options);
}
