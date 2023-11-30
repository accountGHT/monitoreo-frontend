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
import { getMultiTables, createMultiTable, deleteMultiTable, getMultiTableById, updateMultiTable } from 'api/multi-table/multiTableApi';
import { loadFromLocalStorage } from 'utils/localStorage';

const TiposIncidencia = () => {
  const userLocalStorage = loadFromLocalStorage('user');

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
      let params = `?nombre_lista=TIPO DE INCIDENCIA&per_page=${perPage}`;
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
    const resp = await createMultiTable(values);

    if (!resp.success) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return { success: false, response: resp.responseData };
    }

    fetchData();
    setSnackbar({ open: true, message: 'Registro creado con éxito', severity: 'success' });
    return { success: true, response: resp };
  };

  const handleEditItem = async (id) => {
    const resp = await getMultiTableById(id);
    if (!resp.success) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return;
    }

    setSelectedItem(resp.data);
    setOpenForm(true);
  }

  const handleItemUpdated = async (values) => {
    const resp = await updateMultiTable(values.id, values);

    if (!resp.success) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return { success: false, response: resp.responseData };
    }

    setSnackbar({ open: true, message: resp.message, severity: 'success' });
    fetchData();
    return { success: true, response: resp };
  };

  const handleDeleteItem = async (id) => {
    const resp = await deleteMultiTable(id);
    if (!(resp === '')) {
      setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
      return;
    }

    fetchData();
    setSnackbar({ open: true, message: `Registro eliminado correctamente`, severity: 'success' });
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
            TIPOS DE INCIDENCIA
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
          <MultiTableList data={data} onEdit={(id) => handleEditItem(id)} onDelete={handleDeleteItem} />
        </Grid>
      </Grid>

      {userLocalStorage && (
        <MultiTableForm
          open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdated : handleItemCreated}
          initialValues={selectedItem || {}} setSnackbar={setSnackbar}
        />
      )}

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

export default TiposIncidencia;
