import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Snackbar,
  Alert,
  Typography,
  Toolbar,
  AppBar,
} from '@mui/material';
import VehicleForm from './VehicleForm';
import VehicleList from './VehicleList';
import { getVehiculos, deleteVehiculo } from 'api/vehiculos/vehiculosApi';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Resto del código...

  return (
    <>
      {/* Código existente */}
    </>
  );
};

export default Vehicles;
