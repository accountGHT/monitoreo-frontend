import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import MultiTableForm from './MultiTableForm';
import MultiTableList from './MultiTableList';
import { getMultiTables, createMultiTable, deleteMultiTable } from 'api/multi-table/multiTableApi';

const Camaras = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openForm, setOpenForm] = useState(false);

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
      let params = `?nombre_lista=CÁMARA&per_page=${perPage}`;
      const response = await getMultiTables(params);
      setData(response.data.data);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemCreated = async (values) => {
    console.log(`handleItemCreated`, values);
    const resp = await createMultiTable(values);

    if (resp.error) {
      setSnackbar({ open: true, message: resp.responseData.message, severity: 'error' });
      return { success: false, response: resp.responseData };
    } else {
      console.log(resp);
      fetchData();
      setSnackbar({ open: true, message: 'Dato creado con éxito', severity: 'success' });
      return { success: true, response: resp };
    }

  };

  const handleItemUpdated = (values) => {
    fetchData();
    console.log(`handleItemUpdated`, values);
    setSnackbar({ open: true, message: 'Dato actualizado con éxito', severity: 'success' });
  };

  const handleDeleteItem = async (vehicleId) => {
    try {
      await deleteMultiTable(vehicleId);
      fetchData();
      setSnackbar({ open: true, message: 'Dato eliminado con éxito', severity: 'success' });
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
    setSelectedItem(null);
  };

  return (
    <MainCard style={{ marginTop: '20px' }}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={6}>
          <Typography variant="h2" gutterBottom>
            CÁMARAS
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', marginBottom: '12px' }}>
            <Button variant="contained" onClick={() => setOpenForm(true)}>
              NUEVA CÁMARA
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <MultiTableList data={data} onEdit={(vehicle) => setSelectedItem(vehicle)} onDelete={handleDeleteItem} />
        </Grid>
      </Grid>
      <MultiTableForm open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdated : handleItemCreated} initialValues={selectedItem || {}} />
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

export default Camaras;