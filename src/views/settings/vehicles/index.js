import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CreateVehicleForm from './CreateVehicleForm';
import EditVehicleForm from './EditVehicleForm';
import VehicleList from './ VehicleList';
import { getVehiculos, deleteVehiculo } from 'api/vehiculos/vehiculosApi';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchVehicles = async () => {
    try {
      const response = await getVehiculos();
      console.log(response.data.data);
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehicleCreated = (newVehicle) => {
    setVehicles([...vehicles, newVehicle]);
    setSnackbar({ open: true, message: 'Vehículo creado con éxito', severity: 'success' });
  };

  const handleVehicleUpdated = (updatedVehicle) => {
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    );
    setVehicles(updatedVehicles);
    setSelectedVehicle(null);
    setSnackbar({ open: true, message: 'Vehículo actualizado con éxito', severity: 'success' });
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteVehiculo(vehicleId);
      const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== vehicleId);
      setVehicles(updatedVehicles);
      setSnackbar({ open: true, message: 'Vehículo eliminado con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el vehículo', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <MainCard title="Vehículos" style={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CreateVehicleForm onVehicleCreated={handleVehicleCreated} />
        </Grid>
        <Grid item xs={6}>
          <VehicleList vehicles={vehicles} onEdit={setSelectedVehicle} onDelete={handleDeleteVehicle} />
        </Grid>
      </Grid>
      {selectedVehicle && (
        <EditVehicleForm vehicleId={selectedVehicle.id} onVehicleUpdated={handleVehicleUpdated} />
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </MainCard>
  );
};

export default Vehicles;
