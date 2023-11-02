import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { field: 'id', headerName: 'Id', width: 30 },
  { field: 'codigo', headerName: 'Código', width: 75 },
  { field: 'marca', headerName: 'Marca', width: 75 },
  { field: 'modelo', headerName: 'Modelo', width: 75 },
  { field: 'anio', headerName: 'Año', width: 70 },
  { field: 'placa', headerName: 'Placa', width: 70 },
  { field: 'color', headerName: 'Color', width: 70 },
  { field: 'kilometraje', headerName: 'Kilometraje', width: 130 },
  {
    field: 'esta_operativo',
    headerName: 'Operativo',
    width: 100,
    renderCell: (params) => {
      return params.row.esta_operativo ? 'SI' : 'NO';
    }
  },
  { field: 'descripcion', headerName: 'Descripción', width: 200 },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 200,
    renderCell: (params) => {
      return params.row.estado ? 'SI' : 'NO';
    }
  },
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

const VehicleList = ({ vehicles, onEdit, onDelete }) => {
  const rows = vehicles.map((vehicle) => ({
    ...vehicle,
    id: vehicle.id,
    onEdit: onEdit,
    onDelete: onDelete,
  }));

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} />
    </div>
  );
};

export default VehicleList;
