const vehiculosEndpoints = {
    list: 'multi-table',
    autocomplete: 'multi-table-autocomplete',
    autocompleteZonas: '/multi-table-autocomplete?nombre_lista=ZONA',
    autocompleteTiposPatrullaje: '/multi-table-autocomplete?nombre_lista=TIPO DE PATRULLAJE',
    autocompleteTiposComunicacion: '/multi-table-autocomplete?nombre_lista=TIPO DE COMUNICACIÓN',
    autocompleteTiposIncidencia: '/multi-table-autocomplete?nombre_lista=TIPO DE INCIDENCIA',
    camaras: '/multi-table?nombre_lista=CÁMARA',
  };
  
  export default vehiculosEndpoints;
  