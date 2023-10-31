const monitoreoCamarasEndpoints = {
    list: '/monitoreo-camaras',
    create: '/monitoreo-camaras',
    zonas: '/multi-table?nombre_lista=ZONA',
    tiposIncidencia: '/multi-table?nombre_lista=TIPO DE INCIDENCIA',
    camaras: '/multi-table?nombre_lista=CÁMARA',
    personas: '/personas',
    vehiculos: '/vehiculos',
    tiposComunicacion: '/multi-table?nombre_lista=TIPO DE COMUNICACIÓN',
    tiposPatrullaje: '/multi-table?nombre_lista=TIPO DE PATRULLAJE',
    createCentralComunicacion: '/central-comunicaciones',
    createDistribucionPersonal: '/distribucion-personal',
    datosGrafico: '/monitoreo-camara/datos-grafico',
  };
  
  export default monitoreoCamarasEndpoints;
  