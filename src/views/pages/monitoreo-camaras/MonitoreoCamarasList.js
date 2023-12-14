import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadFromLocalStorage } from 'utils/localStorage';

const userLocalStorage = loadFromLocalStorage('user');

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
        field: 'vehiculo_serenazgo', headerName: 'Vehiculo de Serenazgo', flex: 1, minWidth: 180, maxWidth: 200,
        renderCell: (params) => { return params.row.vehiculo_serenazgo.placa; }
    },
    {
        field: 'encargado', headerName: 'Encargado', flex: 1, minWidth: 120, maxWidth: 200,
        renderCell: (params) => { return params.row.encargado.nombre_completo; }
    },
    // {
    //     field: 'estado', headerName: 'estado', flex: 0.5, minWidth: 120, maxWidth: 130,
    //     renderCell: (params) => params.row.estado ? (<span className="status-success">Habilitado</span>) :
    //         (<span className="status-error">Deshabilitado</span>)
    // },
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

const MonitoreoCamarasList = ({ data, onEdit, onDelete }) => {
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

export default MonitoreoCamarasList;