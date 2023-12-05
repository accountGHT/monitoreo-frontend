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
import { getVehiculos, createVehiculo, getVehicleById, updateVehicle, deleteVehicle } from 'api/vehiculos/vehiculosApi';
import { loadFromLocalStorage } from 'utils/localStorage';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

const Vehicles = () => {
  const userLocalStorage = loadFromLocalStorage('user');

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // For option delete
  const [isDialogConfirmDeleteOpen, setIsDialogConfirmDeleteOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [itemNameToDelete, setItemNameToDelete] = useState('');

  // const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const [totalPages, setTotalPages] = useState(1);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = async () => {
    setPerPage(10);
    try {
      let params = `?per_page=${perPage}`;
      const response = await getVehiculos(params);
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVehicleCreated = async (values) => {
    const resp = await createVehiculo(values);

    if (!resp.success) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return { success: false, response: resp.responseData };
    }

    fetchData();
    setSnackbar({ open: true, message: 'Vehículo creado con éxito', severity: 'success' });
    return { success: true, response: resp };
  };

  const handleEditVehicle = async (id) => {
    const resp = await getVehicleById(id);
    if (!resp.success) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return;
    }

    setSelectedVehicle(resp.data);
    setOpenForm(true);
  }

  const handleVehicleUpdated = async (values) => {
    const resp = await updateVehicle(values.id, values);

    if (!resp.success) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return { success: false, data: resp.responseData };
    }

    setSnackbar({ open: true, message: resp.message, severity: 'success' });
    // setSnackbar({ open: true, message: 'Vehículo actualizado con éxito', severity: 'success' });
    fetchData();
    return { success: true, data: resp };

  };

  const handleDeleteVehicle = async (vehicle) => {
    setItemIdToDelete(vehicle.id);
    setItemNameToDelete(`${vehicle.marca} ${vehicle.modelo}`);
    setIsDialogConfirmDeleteOpen(true);
  };

  const handleCloseDialogConfirmDelete = () => {
    setIsDialogConfirmDeleteOpen(false);
    setItemIdToDelete(null);
    setItemNameToDelete('');
  };

  const handleDialogConfirmDelete = async () => {
    const resp = await deleteVehicle(itemIdToDelete);
    if (!(resp === '')) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return;
    }

    fetchData();
    setSnackbar({ open: true, message: `Vehículo eliminado con éxito`, severity: 'success' });
    handleCloseDialogConfirmDelete();
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
          <VehicleList vehicles={vehicles} onEdit={(id) => handleEditVehicle(id)} onDelete={handleDeleteVehicle} />
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
      <DeleteConfirmationDialog
        open={isDialogConfirmDeleteOpen}
        onClose={handleCloseDialogConfirmDelete}
        onConfirm={handleDialogConfirmDelete}
        itemName={itemNameToDelete}
      />
    </MainCard>
  );
};

export default Vehicles;
