import React, { useState, useEffect } from 'react';
import { Grid, Button, Snackbar, Alert, Typography } from '@mui/material';
import PersonForm from './PersonForm';
import PersonList from './PersonList';
import { getPersonas, getPersonById, createPerson, updatePerson, deletePerson } from 'api/personas/personasApi';
import MainCard from 'ui-component/cards/MainCard';
import { loadFromLocalStorage } from 'utils/localStorage';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

const Persons = () => {
    const userLocalStorage = loadFromLocalStorage('user');

    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
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

    const handleCloseDialogConfirmDelete = () => {
        setIsDialogConfirmDeleteOpen(false);
        setItemIdToDelete(null);
        setItemNameToDelete('');
    };

    const fetchData = async () => {
        setPerPage(10);
        try {
            let params = `?per_page=${perPage}`;
            const response = await getPersonas(params);
            console.log(response.data.data);
            setPersons(response.data.data);
        } catch (error) {
            console.error('Error al obtener los vehículos:', error);
            setSnackbar({ open: true, message: 'Error al obtener los vehículos', severity: 'error' });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePersonCreated = async (values) => {
        const resp = await createPerson(values);
        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return { success: false, data: resp.responseData };
        }

        fetchData();
        setSnackbar({ open: true, message: 'Persona creada con éxito', severity: 'success' });
        return { success: true, data: resp };
    };

    const handlePersonEdit = async (id) => {
        const resp = await getPersonById(id);
        if (!resp.success) {
            setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return;
        }

        setSelectedPerson(resp.data);
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
        setSelectedPerson(null);
    };

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
                    <PersonList persons={persons} onEdit={(id) => handlePersonEdit(id)} onDelete={handleDeletePerson} />
                </Grid>
            </Grid>
            <PersonForm open={openForm} handleClose={handleFormClose} onSubmit={selectedPerson ? handlePersonUpdate : handlePersonCreated} initialValues={selectedPerson || {}} />

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
