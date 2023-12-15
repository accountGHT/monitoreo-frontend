import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadFromLocalStorage } from 'utils/localStorage';

const userLocalStorage = loadFromLocalStorage('user');

const columnsWithoutActions = [
  // { field: 'id', headerName: 'Id', width: 30 },
  { field: 'codigo', headerName: 'Código', flex: 1, minWidth: 100, maxWidth: 400 },
  { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 100, maxWidth: 400 },
  // { field: 'nombre_plural', headerName: 'Nombre Plural', width: 160 },
  // { field: 'es_tabla', headerName: 'es_tabla', width: 100, renderCell: (params) => { return params.row.esta_operativo ? 'SI' : 'NO'; } },
  { 
    field: 'padre', headerName: 'Padre', flex: 1, minWidth: 100, maxWidth: 400, 
    renderCell: (params) => params.row.padre ? params.row.padre.nombre : '' 
  },
  {
    field: 'estado', headerName: 'Estado', flex: 1, minWidth: 60, maxWidth: 400,
    renderCell: (params) => params.row.estado ? 'HABILITADO' : 'INHABILITADO'
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

const MultiTableList = ({ data, onEdit, onDelete }) => {
  const rows = data.map((obj) => ({
    ...obj,
    id: obj.id,
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

export default MultiTableList;
