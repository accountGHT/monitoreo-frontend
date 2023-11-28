import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import VehicleForm from './VehicleForm';
import VehicleList from './ VehicleList';
import { getVehiculos, createVehiculo, deleteVehiculo } from 'api/vehiculos/vehiculosApi';
import { loadFromLocalStorage } from 'utils/localStorage';

const Vehicles = () => {
  const userLocalStorage = loadFromLocalStorage('user');

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchVehicles = async () => {
    try {
      const response = await getVehiculos();
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehicleCreated = async (values) => {
    console.log(`handleVehicleCreated`, values);
    const resp = await createVehiculo(values);

    if (resp.error) {
      setSnackbar({ open: true, message: resp.responseData.message, severity: 'error' });
      return { success: false, response: resp.responseData };
    } else {
      console.log(resp);
      fetchVehicles();
      setSnackbar({ open: true, message: 'Vehículo creado con éxito', severity: 'success' });
      return { success: true, response: resp };
    }

  };

  const handleVehicleUpdated = (values) => {
    fetchVehicles();
    console.log(`handleVehicleCreated`, values);
    setSnackbar({ open: true, message: 'Vehículo actualizado con éxito', severity: 'success' });
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteVehiculo(vehicleId);
      fetchVehicles();
      setSnackbar({ open: true, message: 'Vehículo eliminado con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el vehículo', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedVehicle(null);
  };

  return (
    <MainCard style={{ marginTop: '20px' }}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={6}>
          <Typography variant="h2" gutterBottom>
            Vehículos
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {userLocalStorage && (
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', marginBottom: '12px' }}>
              <Button variant="contained" onClick={() => setOpenForm(true)}>
                Nuevo registro
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <VehicleList vehicles={vehicles} onEdit={(vehicle) => setSelectedVehicle(vehicle)} onDelete={handleDeleteVehicle} />
        </Grid>
      </Grid>
      <VehicleForm open={openForm} handleClose={handleFormClose} onSubmit={selectedVehicle ? handleVehicleUpdated : handleVehicleCreated} initialValues={selectedVehicle || {}} />
      <Snackbar
        open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default Vehicles;
