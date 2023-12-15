import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, CircularProgress, } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadFromLocalStorage } from 'utils/localStorage';
import VehicleList from './ VehicleList';
import VehicleForm from './VehicleForm';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { getVehiculos, createVehiculo, getVehicleById, updateVehicle, deleteVehicle } from 'api/vehiculos/vehiculosApi';


const Vehicles = () => {
  const userLocalStorage = loadFromLocalStorage('user');

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // For option delete
  const [isDialogConfirmDeleteOpen, setIsDialogConfirmDeleteOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [itemNameToDelete, setItemNameToDelete] = useState('');

  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setPerPage(10);
    try {
      let params = `?per_page=${perPage}`;
      const resp = await getVehiculos(params);
      // console.log(resp);
      console.log(resp.data);

      if (!resp.success) {
        console.error(resp);
        toast.error(resp.responseData.message ?? resp.errorMessage);
        return;
      }

      setData(resp.data);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemCreated = async (values) => {
    const resp = await createVehiculo(values);

    if (!resp.success) {
      toast.error(resp.responseData.message ?? resp.errorMessage);
      return { success: false, response: resp.responseData };
    }

    fetchData();
    toast.success(resp.message);
    return { success: true, response: resp };
  };

  const handleItemEdit = async (id) => {
    const resp = await getVehicleById(id);
    if (!resp.success) {
      toast.error(resp.responseData.message ?? resp.errorMessage);
      return;
    }

    setSelectedItem(resp.data);
    setOpenForm(true);
  }

  const handleFormClose = () => {
    setSelectedItem(null);
    setOpenForm(false);
  };

  const handleItemUpdate = async (values) => {
    const resp = await updateVehicle(values.id, values);

    if (!resp.success) {
      toast.error(resp.responseData.message ?? resp.errorMessage);
      return { success: false, data: resp.responseData };
    }

    fetchData();
    toast.success(resp.message);
    return { success: true, data: resp };

  };

  const handleItemDelete = async (item) => {
    setItemIdToDelete(item.id);
    setItemNameToDelete(`${item.marca} ${item.modelo}`);
    setIsDialogConfirmDeleteOpen(true);
  };

  const handleDialogConfirmDelete = async () => {
    const resp = await deleteVehicle(itemIdToDelete);
    if (!(resp === '')) {
      toast.error(resp.responseData.message ?? resp.errorMessage);
      return;
    }

    fetchData();
    toast.success(`Vehículo eliminado con éxito`);
    handleCloseDialogConfirmDelete();
  };

  const handleCloseDialogConfirmDelete = () => {
    setIsDialogConfirmDeleteOpen(false);
    setItemIdToDelete(null);
    setItemNameToDelete('');
};

  if (loading) {
    return <CircularProgress />;
  }

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
          <VehicleList vehicles={data} onEdit={(id) => handleItemEdit(id)} onDelete={handleItemDelete} />
        </Grid>
      </Grid>

      <VehicleForm open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdate : handleItemCreated} initialValues={selectedItem || {}} />

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
