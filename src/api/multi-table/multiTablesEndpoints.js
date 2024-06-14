const vehiculosEndpoints = {
  list: 'multi-table',
  autocomplete: 'multi-table-autocomplete',
  autocompleteZonas: '/multi-table-autocomplete?nombre_lista=ZONA',
  autocompleteTiposPatrullaje: '/multi-table-autocomplete?nombre_lista=TIPO DE PATRULLAJE',
  autocompleteTiposComunicacion: '/multi-table-autocomplete?nombre_lista=TIPO DE COMUNICACIÓN',
  autocompleteTiposIncidencia: '/multi-table-autocomplete?nombre_lista=TIPO DE INCIDENCIA',
  autocompleteCamaras: '/multi-table-autocomplete?nombre_lista=CÁMARA',
  autoCompleteClasificadores: '/multi-table-autocomplete?nombre_lista=CLASIFICADOR',
  autoCompleteInstituciones: '/multi-table-autocomplete?nombre_lista=INSTITUCION',
  autoCompleteAreas: '/multi-table-autocomplete?nombre_lista=AREA',
};

export default vehiculosEndpoints;
