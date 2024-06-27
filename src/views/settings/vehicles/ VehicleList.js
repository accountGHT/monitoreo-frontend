import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadFromLocalStorage } from 'utils/localStorage';

const userLocalStorage = loadFromLocalStorage('user');

const columnsWithoutActions = [
  { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
  {
    field: 'tipo',
    headerName: 'Tipo',
    flex: 1,
    minWidth: 100,
    maxWidth: 120,
    valueGetter: (params) => {
      switch (params.row.tipo) {
        case 1:
          return 'AUTO';
        case 2:
          return 'MOTO';
        case 3:
          return 'CAMIONETA';
        default:
          return '';
      }
    }
  },
  { field: 'codigo', headerName: 'Código', flex: 1, minWidth: 75, maxWidth: 100 },
  { field: 'marca', headerName: 'Marca', flex: 1, minWidth: 75, maxWidth: 100 },
  { field: 'modelo', headerName: 'Modelo', flex: 1, minWidth: 75, maxWidth: 100 },
  { field: 'anio', headerName: 'Año', flex: 0.8, minWidth: 70, maxWidth: 80 },
  { field: 'placa', headerName: 'Placa', flex: 0.8, minWidth: 70, maxWidth: 80 },
  { field: 'color', headerName: 'Color', flex: 0.8, minWidth: 70, maxWidth: 80 },
  { field: 'kilometraje', headerName: 'Kilometraje', flex: 1.5, minWidth: 130, maxWidth: 150 },
  {
    field: 'esta_operativo', headerName: 'Operativo', flex: 1, minWidth: 100, maxWidth: 120,
    renderCell: (params) => {
      return params.row.esta_operativo ? 'SI' : 'NO';
    }
  },
  { field: 'descripcion', headerName: 'Descripción', flex: 5, minWidth: 200 },
  {
    field: 'estado', headerName: 'Estado', flex: 1, minWidth: 60, maxWidth: 300,
    renderCell: (params) => {
      return params.row.estado ? 'SI' : 'NO';
    }
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

const VehicleList = ({ vehicles, onEdit, onDelete }) => {
  const rows = vehicles.map((vehicle) => ({
    ...vehicle,
    id: vehicle.id,
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

export default VehicleList;
