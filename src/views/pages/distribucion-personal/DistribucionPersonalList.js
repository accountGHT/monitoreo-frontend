import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadFromLocalStorage } from 'utils/localStorage';

const userLocalStorage = loadFromLocalStorage('user');

const columnsWithoutActions = [
    { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
    { field: 'fecha', headerName: 'Fecha', flex: 1, minWidth: 100, maxWidth: 120 },
    { field: 'hora', headerName: 'Hora', flex: 1, minWidth: 100, maxWidth: 120, renderCell: (params) => params.row.hora },
    { field: 'turno', headerName: 'Turno', flex: 1, minWidth: 100, maxWidth: 120 },
    // { field: 'patrullero_id', headerName: 'patrullero_id', flex: 0.5, minWidth: 100, maxWidth: 160 },
    {
        field: 'patrullero', headerName: 'Patrullero', flex: 1, minWidth: 120, maxWidth: 200,
        renderCell: (params) => {
            return params.row.patrullero.nombre_completo;
        }
    },
    // { field: 'vehiculo_id', headerName: 'vehiculo_id', flex: 2, minWidth: 150, maxWidth: 300 },
    {
        field: 'vehiculo', headerName: 'Vehículo', flex: 2, minWidth: 120, maxWidth: 150,
        renderCell: (params) => params.row.vehiculo.placa
    },
    // { field: 'zona_id', headerName: 'zona_id', flex: 1, minWidth: 150, maxWidth: 300 },
    {
        field: 'zona', headerName: 'Zona', flex: 1.5, minWidth: 120, maxWidth: 150,
        renderCell: (params) => params.row.zona.nombre
    },
    {
        field: 'patrullaje_integrado', headerName: 'PAT. MUN. O INTEGRADO?', flex: 1.5, minWidth: 130, maxWidth: 180,
        renderCell: (params) => params.row.patrullaje_integrado ? `PATRULLAJE INTEGRADO` : `PATRULLAJE MUNICIPAL`
    },
    // { field: 'ubicacion_persona', headerName: 'Ubicación', flex: 0.5, minWidth: 100, maxWidth: 120 },
    // { field: 'tipo_patrullaje_id', headerName: 'tipo_patrullaje_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'tipo_patrullaje', headerName: 'Tipo patrullaje', flex: 0.5, minWidth: 100, maxWidth: 120,
        renderCell: (params) => params.row.tipo_patrullaje.nombre
    },
    // { field: 'num_partes_ocurrencia', headerName: 'Num. Ocurrencia', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'entrega_hoja_ruta', headerName: 'Entregó hoja de ruta?', flex: 0.5, minWidth: 100, maxWidth: 120,
        renderCell: (params) => params.row.entrega_hoja_ruta ? `SI` : `NO`
    },
    { field: 'codigo_radio', headerName: 'Cód. radio', flex: 0.5, minWidth: 100, maxWidth: 120 },
    // { field: 'supervisor_id', headerName: 'supervisor_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
    {
        field: 'supervisor', headerName: 'Supervisor', flex: 1, minWidth: 120, maxWidth: 200,
        renderCell: (params) => params.row.supervisor.nombre_completo
    },
    {
        field: 'estado', headerName: 'estado', flex: 0.5, minWidth: 120, maxWidth: 130,
        renderCell: (params) => params.row.estado ? (<span className="status-success">Habilitado</span>) : 
            (<span className="status-error">Deshabilitado</span>)
    },
];

const columnsWithActions = [
    ...columnsWithoutActions,
    {
        field: 'actions', headerName: 'Acciones', flex: 0.5, minWidth: 120, maxWidth: 150,
        renderCell: (params) => (
            <>
                <IconButton color="primary" aria-label="Editar" onClick={() => params.row.onEdit(params.row.id)}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="Eliminar" onClick={() => params.row.onDelete(params.row)}>
                    <DeleteIcon />
                </IconButton>
            </>
        ),
    },
];

const DistribucionPersonalList = ({ data, onEdit, onDelete }) => {
    const rows = data.map((row) => ({
        ...row,
        id: row.id,
        onEdit: onEdit,
        onDelete: onDelete,
    }));

    const columnsToDisplay = userLocalStorage ? columnsWithActions : columnsWithoutActions;

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={rows} columns={columnsToDisplay} pageSize={10} />
        </div>
    );
};

export default DistribucionPersonalList;