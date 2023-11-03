const monitoreoCamarasEndpoints = {
    list: '/monitoreo-camaras',
    create: '/monitoreo-camaras',
    zonas: '/multi-table-autocomplete?nombre_lista=ZONA',
    tiposIncidencia: '/multi-table-autocomplete?nombre_lista=TIPO DE INCIDENCIA',
    camaras: '/multi-table-autocomplete?nombre_lista=CÁMARA',
    personas: '/personas',
    vehiculos: '/vehiculos',
    tiposComunicacion: '/multi-table-autocomplete?nombre_lista=TIPO DE COMUNICACIÓN',
    tiposPatrullaje: '/multi-table-autocomplete?nombre_lista=TIPO DE PATRULLAJE',
    createCentralComunicacion: '/central-comunicaciones',
    createDistribucionPersonal: '/distribucion-personal',
    datosGrafico: '/monitoreo-camara/datos-grafico',
    datosGraficoCentralComunicaciones: '/monitoreo-camara/datos-grafico',
    tablaGrafico: '/monitoreo-camara/tabla-grafico',
  };
  
  export default monitoreoCamarasEndpoints;
  