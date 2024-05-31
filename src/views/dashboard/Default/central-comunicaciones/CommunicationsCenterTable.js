import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getTableDashboardCommunicationsCenter } from 'api/communications-center/communicationsCenterApi';

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

const columnsWithoutActions = [
    { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 100, maxWidth: 120, renderCell: (params) => params.row.fecha ?? 'Sin fecha' },
    { field: 'hora_llamada', headerName: 'Hora Llamada', flex: 1, minWidth: 120, maxWidth: 140, renderCell: (params) => params.row.hora ?? 'Sin hora' },
    {
        field: 'tipo_comunicacion',
        headerName: 'Tipo comunicación',
        flex: 0.5,
        minWidth: 100,
        maxWidth: 120,
        renderCell: (params) => (params.row.tipo_comunicacion?.nombre ?? 'Sin tipo')
    },
    { field: 'turno', headerName: 'Turno', flex: 1, minWidth: 100, maxWidth: 120, renderCell: (params) => params.row.turno ?? 'Sin turno' },
    {
        field: 'zona_incidencia',
        headerName: 'Zona',
        flex: 1.5,
        minWidth: 120,
        maxWidth: 150,
        renderCell: (params) => (params.row.zona_incidencia?.nombre ?? 'Sin zona')
    },
    {
        field: 'operador',
        headerName: 'Operador',
        flex: 1,
        minWidth: 180,
        maxWidth: 200,
        renderCell: (params) => (params.row.operador?.nombre_completo ?? 'Sin operador')
    },
    {
        field: 'tipo_apoyo_incidencia',
        headerName: 'Tipo Incidencia',
        flex: 1,
        minWidth: 130,
        maxWidth: 150,
        renderCell: (params) => (params.row.tipo_apoyo_incidencia?.nombre ?? 'Sin tipo')
    },
    {
        field: 'vehiculo',
        headerName: 'Vehículo (Placa)',
        flex: 2,
        minWidth: 120,
        maxWidth: 150,
        renderCell: (params) => (params.row.vehiculo?.placa ?? 'Sin vehículo')
    },
    {
        field: 'personal_serenazgo',
        headerName: 'Personal serenazgo',
        flex: 1,
        minWidth: 180,
        maxWidth: 200,
        renderCell: (params) => (params.row.personal_serenazgo?.nombre_completo ?? 'Sin personal')
    },
    {
        field: 'supervisor',
        headerName: 'Supervisor',
        flex: 1.5,
        minWidth: 200,
        maxWidth: 230,
        renderCell: (params) => (params.row.supervisor?.nombre_completo ?? 'Sin supervisor')
    },
];

export { columnsWithoutActions };
