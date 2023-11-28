import React, { useState, useEffect } from 'react';
import { Grid, Button, Snackbar, Alert, Typography } from '@mui/material';
import PersonForm from './PersonForm';
import PersonList from './PersonList';
import { getPersonas, deletePersona } from 'api/personas/personasApi';
import MainCard from 'ui-component/cards/MainCard';
import { loadFromLocalStorage } from 'utils/localStorage';

const Persons = () => {
    const userLocalStorage = loadFromLocalStorage('user');

    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const fetchPersons = async () => {
        try {
            const response = await getPersonas();
            console.log(response.data.data);
            setPersons(response.data.data);
        } catch (error) {
            console.error('Error al obtener los vehículos:', error);
            setSnackbar({ open: true, message: 'Error al obtener los vehículos', severity: 'error' });
        }
    };

    useEffect(() => {
        fetchPersons();
    }, []);

    const handlePersonCreated = () => {
        console.log(`handlePersonCreated`);
        fetchPersons();
        setSnackbar({ open: true, message: 'Vehículo creado con éxito', severity: 'success' });
    };

    const handlePersonUpdated = () => {
        console.log(`handlePersonUpdated`);
        fetchPersons();
        setSnackbar({ open: true, message: 'Vehículo actualizado con éxito', severity: 'success' });
    };

    const handleDeletePerson = async (PersonId) => {
        console.log(`handleDeletePerson`);
        try {
            await deletePersona(PersonId);
            fetchPersons();
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
                    <PersonList persons={persons} onEdit={(Person) => setSelectedPerson(Person)} onDelete={handleDeletePerson} />
                </Grid>
            </Grid>
            <PersonForm open={openForm} handleClose={handleFormClose} onSubmit={selectedPerson ? handlePersonUpdated : handlePersonCreated} initialValues={selectedPerson || {}} />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default Persons;
