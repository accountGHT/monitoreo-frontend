/*eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { loadFromLocalStorage } from 'utils/localStorage';
// import { fnFormatDate, fnFormatTime } from 'utils/date-and-time';

const userLocalStorage = loadFromLocalStorage('user');

const columnsWithoutActions = [
  { field: 'id', headerName: 'Id', flex: 0.5, minWidth: 50, maxWidth: 60 },
  // estado
  { field: 'estado', headerName: 'Estado', flex: 0.5, minWidth: 100, maxWidth: 120 },

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
    field: 'operador', headerName: 'Operador', flex: 1, minWidth: 120, maxWidth: 200,
    renderCell: (params) => params.row.operador.nombre_completo
  },
  // { field: 'tipo_apoyo_incidencia_id', headerName: 'tipo_apoyo_incidencia_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
  {
    field: 'tipo_apoyo_incidencia', headerName: 'Tipo Incidencia', flex: 1, minWidth: 130, maxWidth: 150,
    renderCell: (params) => params.row.tipo_apoyo_incidencia.nombre
  },
  // { field: 'vehiculo_id', headerName: 'vehiculo_id', flex: 2, minWidth: 150, maxWidth: 300 },
  /*
  {
      field: 'vehiculo', headerName: 'Vehículo (Placa)', flex: 2, minWidth: 120, maxWidth: 150,
      renderCell: (params) => params.row.vehiculo.placa
  },
  */
  // { field: 'personal_serenazgo_id', headerName: 'personal_serenazgo_id', flex: 2, minWidth: 150, maxWidth: 300 },
  /*
  {
      field: 'personal_serenazgo', headerName: 'Personal serenazgo', flex: 1, minWidth: 120, maxWidth: 200,
      renderCell: (params) => params.row.personal_serenazgo.nombre_completo
  },
  */
  // { field: 'detalle_atencion', headerName: 'detalle_atencion', flex: 0.5, minWidth: 100, maxWidth: 120 },
  // { field: 'supervisor_id', headerName: 'supervisor_id', flex: 0.5, minWidth: 100, maxWidth: 120 },
  /*
  {
      field: 'supervisor', headerName: 'Supervisor', flex: 1, minWidth: 120, maxWidth: 200,
      renderCell: (params) => params.row.supervisor.nombre_completo
  },
  */
  // {
  //     field: 'estado', headerName: 'estado', flex: 0.5, minWidth: 120, maxWidth: 130,
  //     renderCell: (params) => params.row.estado ? (<span className="status-success">Habilitado</span>) :
  //         (<span className="status-error">Deshabilitado</span>)
  // },
];

const CommunicationsCenterList = ({ selectedStatus, data, onEdit, onDelete, onCancel, onDespachar, onConfirmar }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenPopup = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    onEdit(selectedRow.id);
    handleClosePopup();
  };

  const handleCancel = () => {
    onCancel(selectedRow.id);
    handleClosePopup();
  };

  const handleDespachar = () => {
    onDespachar(selectedRow.id);
    handleClosePopup();
  };

  const handleConfirmar = () => {
    onConfirmar(selectedRow.id);
    handleClosePopup();
  };

  const handleDelete = () => {
    onDelete(selectedRow);
    handleClosePopup();
  };

  const columnsWithActions = [
    ...columnsWithoutActions,
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.5,
      minWidth: 120,
      maxWidth: 150,
      renderCell: (params) => (
        <IconButton
          aria-label="Opciones"
          onClick={(event) => handleOpenPopup(event, params.row)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const rows = data.map((row) => ({
    ...row,
    id: row.id,
  }));

  const filteredRows = selectedStatus
    ? rows.filter((row) => row.estado === selectedStatus)
    : rows;

  const columnsToDisplay = userLocalStorage ? columnsWithActions : columnsWithoutActions;

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={filteredRows} columns={columnsToDisplay} pageSize={50} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClosePopup}
      >
        {selectedRow && selectedRow.estado !== 'cancelado' && selectedRow.estado !== 'despachado' &&
          selectedRow.estado !== 'atendido' && (
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
          )}
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
        {selectedRow && selectedRow.estado !== 'cancelado' && selectedRow.estado !== 'despachado' &&
          selectedRow.estado !== 'atendido' && (
            <MenuItem onClick={handleCancel}>Cancelar</MenuItem>
          )}
        {selectedRow && selectedRow.estado == 'abierto' && selectedRow.estado !== 'cancelado' &&
          selectedRow.estado !== 'atendido' && (
            <MenuItem onClick={handleDespachar}>Despachar</MenuItem>
          )}
        {selectedRow && selectedRow.estado !== 'abierto' && selectedRow.estado !== 'cancelado' &&
          selectedRow.estado !== 'atendido' && (
            <MenuItem onClick={handleConfirmar}>Confirmar Atenciòn</MenuItem>
          )}

      </Menu>
    </div>
  );
};

export default CommunicationsCenterList;