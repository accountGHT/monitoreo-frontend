import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadFromLocalStorage } from 'utils/localStorage';

const userLocalStorage = loadFromLocalStorage('user');

const columnsWithoutActions = [
  { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
  { field: 'name', headerName: 'Nombre', flex: 2, minWidth: 150, maxWidth: 200 },
  { field: 'guard_name', headerName: 'Guardián', flex: 1, minWidth: 120, maxWidth: 160 },
  { field: 'created_at', headerName: 'Fecha de creación', flex: 1, minWidth: 150, maxWidth: 300 },
  { field: 'updated_at', headerName: 'Última actualización', flex: 1, minWidth: 150, maxWidth: 300 },
];

const columnsWithActions = [
  ...columnsWithoutActions,
  {
    field: 'actions', headerName: 'Acciones',  flex: 0.5, minWidth: 120, maxWidth: 150,
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

const RolesList = ({ data, onEdit, onDelete }) => {
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

export default RolesList;
