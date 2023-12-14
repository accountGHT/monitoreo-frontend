import React, { useState, useEffect } from 'react';

// material-ui
import { Grid, Button, Snackbar, Alert, Typography, CircularProgress } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadFromLocalStorage } from 'utils/localStorage';
import PersonList from './PersonList';
import PersonForm from './PersonForm';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { getPersonas, getPersonById, createPerson, updatePerson, deletePerson } from 'api/personas/personasApi';


const Persons = () => {
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

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const fetchData = async () => {
        setPerPage(10);
        try {
            let params = `?per_page=${perPage}`;
            const resp = await getPersonas(params);
            // console.log(resp);
            console.log(resp.data);

            if (!resp.success) {
                console.error(resp);
                toast.error(resp.responseData.message ?? resp.errorMessage);
                return;
            }

            setData(resp.data);
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
        const resp = await createPerson(values);
        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        fetchData();
        toast.success(resp.message);
        return { success: true, data: resp };
    };


    const handlePersonEdit = async (id) => {
        const resp = await getPersonById(id);
        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return;
        }

        setSelectedItem(resp.data);
        setOpenForm(true);
    }

    const handlePersonUpdate = async (values) => {
        const resp = await updatePerson(values.id, values);

        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return { success: false, data: resp.responseData };
        }

        setSnackbar({ open: true, message: resp.message, severity: 'success' });
        fetchData();
        return { success: true, data: resp };
    };

    const handleDeletePerson = async (person) => {
        console.log(`handleDeletePerson`, person);
        setItemIdToDelete(person.id);
        setItemNameToDelete(`${person.nombres} ${person.p_apellido} ${person.s_apellido}`);
        setIsDialogConfirmDeleteOpen(true);
    };

    const handleDialogConfirmDelete = async () => {
        const resp = await deletePerson(itemIdToDelete);
        if (!(resp === '')) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return;
        }

        fetchData();
        setSnackbar({ open: true, message: `Persona eliminada con éxito`, severity: 'success' });
        handleCloseDialogConfirmDelete();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedItem(null);
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
                        Personas
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
                    <PersonList persons={data} onEdit={(id) => handlePersonEdit(id)} onDelete={handleDeletePerson} />
                </Grid>
            </Grid>
            <PersonForm open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handlePersonUpdate : handleItemCreated} initialValues={selectedItem || {}} />

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

export default Persons;
