import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { field: 'id', headerName: 'Id', width: 30 },
  { field: 'nombres', headerName: 'Nombres', width: 150 },
  { field: 'p_apellido', headerName: 'P. Apellido', width: 120 },
  { field: 's_apellido', headerName: 'S. Apellido', width: 120 },
  { field: 'dni', headerName: 'Dni', width: 100 },
  { field: 'correo', headerName: 'Correo', width: 200 },
  { field: 'fecha_nacimiento', headerName: 'Fecha Nac.', width: 120 },
  { field: 'genero', headerName: 'genero', width: 130 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 120,
    renderCell: (params) => (
      <>
        <IconButton color="primary" aria-label="Editar" onClick={() => params.row.onEdit(params.row.id)}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="Eliminar" onClick={() => params.row.onDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
];

const PersonList = ({ persons, onEdit, onDelete }) => {
  const rows = persons.map((person) => ({
    ...person,
    id: person.id,
    onEdit: onEdit,
    onDelete: onDelete,
  }));

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} />
    </div>
  );
};

export default PersonList;
