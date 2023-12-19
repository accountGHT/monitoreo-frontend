
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getTableDashboardCommunicationsCenter } from 'api/communications-center/communicationsCenterApi';

const columnsWithoutActions = [
    { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
    // { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 100, maxWidth: 120, renderCell: (params) => fnFormatDate(params.row.fecha) },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 100, maxWidth: 120, renderCell: (params) => params.row.fecha },
    { field: 'hora_llamada', headerName: 'Hora Llamada', flex: 1, minWidth: 120, maxWidth: 140, renderCell: (params) => params.row.hora },
    // { field: 'tipo_comunicacion_id', headerName: 'tipo_comunicacion_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'tipo_comunicacion', headerName: 'Tipo comunicación', flex: 0.5, minWidth: 100, maxWidth: 120,
        renderCell: (params) => params.row.tipo_comunicacion.nombre
    },
    { field: 'turno', headerName: 'Turno', flex: 1, minWidth: 100, maxWidth: 120 },
    // { field: 'descripcion_llamada', headerName: 'Desc. llamada', flex: 1, minWidth: 150, maxWidth: 200 },
    // { field: 'zona_incidencia_id', headerName: 'zona_incidencia_id', flex: 1, minWidth: 150, maxWidth: 300 },
    {
        field: 'zona_incidencia', headerName: 'Zona', flex: 1.5, minWidth: 120, maxWidth: 150,
        renderCell: (params) => params.row.zona_incidencia.nombre
    },
    // { field: 'operador_id', headerName: 'operador_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'operador', headerName: 'Operador', flex: 1, minWidth: 180, maxWidth: 200,
        renderCell: (params) => params.row.operador.nombre_completo
    },
    // { field: 'tipo_apoyo_incidencia_id', headerName: 'tipo_apoyo_incidencia_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'tipo_apoyo_incidencia', headerName: 'Tipo Incidencia', flex: 1, minWidth: 130, maxWidth: 150,
        renderCell: (params) => params.row.tipo_apoyo_incidencia.nombre
    },
    // { field: 'vehiculo_id', headerName: 'vehiculo_id', flex: 2, minWidth: 150, maxWidth: 300 },
    {
        field: 'vehiculo', headerName: 'Vehículo (Placa)', flex: 2, minWidth: 120, maxWidth: 150,
        renderCell: (params) => params.row.vehiculo.placa
    },
    // { field: 'personal_serenazgo_id', headerName: 'personal_serenazgo_id', flex: 2, minWidth: 150, maxWidth: 300 },
    {
        field: 'personal_serenazgo', headerName: 'Personal serenazgo', flex: 1, minWidth: 180, maxWidth: 200,
        renderCell: (params) => params.row.personal_serenazgo.nombre_completo
    },
    // { field: 'detalle_atencion', headerName: 'detalle_atencion', flex: 0.5, minWidth: 100, maxWidth: 120 },
    // { field: 'supervisor_id', headerName: 'supervisor_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'supervisor', headerName: 'Supervisor', flex: 1.5, minWidth: 200, maxWidth: 230,
        renderCell: (params) => params.row.supervisor.nombre_completo
    },
];

const CommunicationsCenterTable = ({ filters }) => {

    const [data, setData] = useState([]);

    const payloadFormated = (values) => {
        console.log(`setDataForAPI`, values);
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
            const response = await getTableDashboardCommunicationsCenter(payload);
            console.log(`response`, response);
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

export default CommunicationsCenterTable;