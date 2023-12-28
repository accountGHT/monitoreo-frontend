import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getTableDashboardMonitoreoCamaras } from 'api/monitoreo-camaras/monitoreoCamarasApi';

const columnsWithoutActions = [
    { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 100, maxWidth: 120, renderCell: (params) => params.row.fecha },
    { field: 'hora_inicio', headerName: 'Hora inicio', flex: 1, minWidth: 100, maxWidth: 120 },
    { field: 'hora_fin', headerName: 'Hora fin', flex: 1, minWidth: 100, maxWidth: 120 },
    { field: 'turno', headerName: 'Turno', flex: 1, minWidth: 100, maxWidth: 120 },
    // { field: 'descripcion_incidencia', headerName: 'Desc. Incidencia', flex: 1, minWidth: 150, maxWidth: 200 },
    // { field: 'zona_id', headerName: 'zona_id', flex: 1, minWidth: 150, maxWidth: 300 },
    {
        field: 'zona', headerName: 'Zona', flex: 1.5, minWidth: 120, maxWidth: 150,
        renderCell: (params) => params.row.zona.nombre
    },
    {
        field: 'camara', headerName: 'Cámara', flex: 1, minWidth: 150, maxWidth: 200,
        renderCell: (params) => { return params.row.camara.nombre; }
    },
    // { field: 'operador_camaras_id', headerName: 'operador_camaras_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'operador_camaras', headerName: 'Operador', flex: 1, minWidth: 120, maxWidth: 200,
        renderCell: (params) => params.row.operador_camaras.nombre_completo
    },
    {
        field: 'tipo_incidencia', headerName: 'Tipo de Incidencia', flex: 0.5, minWidth: 130, maxWidth: 150,
        renderCell: (params) => { return params.row.tipo_incidencia.nombre; }
    },
    {
        field: 'personal_serenazgo', headerName: 'Pers. Serenazgo', flex: 1, minWidth: 120, maxWidth: 200,
        renderCell: (params) => { return params.row.personal_serenazgo.nombre_completo }
    },
    {
        field: 'vehiculo_serenazgo', headerName: 'Vehiculo de Serenazgo', flex: 1.5, minWidth: 180, maxWidth: 200,
        renderCell: (params) => { return params.row.vehiculo_serenazgo.placa; }
    },
    {
        field: 'encargado', headerName: 'Encargado', flex: 2, minWidth: 200, maxWidth: 230,
        renderCell: (params) => { return params.row.encargado.nombre_completo; }
    },
];

const MonitoreoCamarasTable = ({ filters }) => {

    const [data, setData] = useState([]);

    const payloadFormated = (values) => {
        // console.log(`setDataForAPI`, values);
        const payload = {
            fecha_inicio: dayjs(values.fecha_inicio).format('YYYY-MM-DD'),
            fecha_fin: dayjs(values.fecha_fin).format('YYYY-MM-DD'),
            zona: null,
            turno: values.turno === 'TODOS' ? '' : values.turno,
        }
        return payload;
    }

    useEffect(() => {
        const fetchData = async () => {
            const payload = payloadFormated(filters);
            const response = await getTableDashboardMonitoreoCamaras(payload);
            // console.log(`response`, response);
            setData(response.data);
        };

        fetchData();
    }, [filters]);

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={data} columns={columnsWithoutActions} pageSize={10} />
        </div>
    )
}

export default MonitoreoCamarasTable;