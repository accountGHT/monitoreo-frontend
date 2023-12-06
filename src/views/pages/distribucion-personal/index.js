import React, { useState, useEffect } from 'react';
// import { Grid, Button, Snackbar, Alert, Typography } from '@mui/material';
import { Grid, Button, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import DistribucionPersonalForm from './DistribucionPersonalForm';
import DistribucionPersonalList from './DistribucionPersonalList';
import { createDistribucionPersonal, getDistribucionPersonal, getDistribucionPersonalById, updateDistribucionPersonal } from 'api/distribucion-personal/distribucionPersonalApi';

import MainCard from 'ui-component/cards/MainCard';
import { loadFromLocalStorage } from 'utils/localStorage';
// import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

const DistribucionPersonal = () => {
    const userLocalStorage = loadFromLocalStorage('user');
    const [data, setData] = useState([]);
    const [selectedPerson, setSelectedItem] = useState(null);
    const [openForm, setOpenForm] = useState(false);

    const [loading, setLoading] = useState(true);
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
            const resp = await getDistribucionPersonal(params);
            // console.log(resp);
            console.log(resp.data);

            if (!resp.success) {
                console.error(resp);
                setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
                // setSnackbar({ open: true, message: 'Error al obtener los vehículos', severity: 'error' });
                return;
            }

            setData(resp.data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleItemCreated = async (values) => {
        const resp = await createDistribucionPersonal(values);
        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return { success: false, data: resp.responseData };
        }

        fetchData();
        setSnackbar({ open: true, message: resp.message, severity: 'success' });
        // toast.success(respCreate.message);
        return { success: true, data: resp };
    };

    const handleItemEdit = async (id) => {
        const resp = await getDistribucionPersonalById(id);
        console.log(`resp`, resp);
        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return;
        }

        setSelectedItem(resp.data);
        setOpenForm(true);
    }

    const handleItemUpdate = async (values) => {
        console.log(`handleItemUpdate`, values);
        const resp = await updateDistribucionPersonal(values.id, values);

        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return { success: false, data: resp.responseData };
        }

        setSnackbar({ open: true, message: resp.message, severity: 'success' });
        fetchData();
        return { success: true, data: resp };
    };

    const handleItemDelete = async (item) => {
        console.log(`handleItemDelete`, item);
        // setItemIdToDelete(item.id);
        // setItemNameToDelete(`${item.nombres} ${item.p_apellido} ${item.s_apellido}`);
        // setIsDialogConfirmDeleteOpen(true);
    };

    // const handleDialogConfirmDelete = async () => {
    //     const resp = await deletePerson(itemIdToDelete);
    //     if (!(resp === '')) {
    //         setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
    //         return;
    //     }

    //     fetchData();
    //     setSnackbar({ open: true, message: `Persona eliminada con éxito`, severity: 'success' });
    //     handleCloseDialogConfirmDelete();
    // };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedItem(null);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <MainCard style={{ marginTop: '20px' }}>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6}>
                    <Typography variant="h2" gutterBottom>
                        Distribución del personal
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
                    <DistribucionPersonalList data={data} onEdit={(id) => handleItemEdit(id)} onDelete={handleItemDelete} />
                </Grid>
            </Grid>
            <DistribucionPersonalForm open={openForm} handleClose={handleFormClose} onSubmit={selectedPerson ? handleItemUpdate : handleItemCreated} initialValues={selectedPerson || {}} />
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

export default DistribucionPersonal;