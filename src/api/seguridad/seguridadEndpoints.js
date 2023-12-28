export const seguridadEndpoints = {
  // list: 'multi-table',
  list: 'personas',
  users: 'users',
  // autocomplete: 'multi-table-autocomplete',
  autocomplete: 'personas-autocomplete',
  autocompleteZonas: '/multi-table-autocomplete?nombre_lista=ZONA',
  autocompleteTiposPatrullaje: '/multi-table-autocomplete?nombre_lista=TIPO DE PATRULLAJE',
  autocompleteTiposComunicacion: '/multi-table-autocomplete?nombre_lista=TIPO DE COMUNICACIÓN',
  autocompleteTiposIncidencia: '/multi-table-autocomplete?nombre_lista=TIPO DE INCIDENCIA',
  autocompleteCamaras: '/multi-table-autocomplete?nombre_lista=CÁMARA',
};

export const rolesEndpoints = {
  list: 'roles',
};

