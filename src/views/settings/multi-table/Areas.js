import React, { useState, useEffect } from 'react';
// material-ui
import { Grid, Button, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadFromLocalStorage } from 'utils/localStorage';
import MultiTableList from './MultiTableList';
import MultiTableForm from './MultiTableForm';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { getMultiTables, createMultiTable, deleteMultiTable, getMultiTableById, updateMultiTable, getInstitucionesForAutocomplete } from 'api/multi-table/multiTableApi';

// ==============================|| Institucion Component ||============================== //
const Institucion = () => {
    const userLocalStorage = loadFromLocalStorage('user');
    const [areas, setAreas] = useState([]);
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

    const [optionsInstituciones, setOptionsInstituciones] = useState([])


    const fetchAreas = async () => {
        setPerPage(10);
        try {
            let params = `?nombre_lista=AREA&per_page=${perPage}`;
            const resp = await getMultiTables(params);
            // console.log(resp);
            console.log(resp.data);

            if (!resp.success) {
                console.error(resp);
                toast.error(resp.responseData.message ?? resp.errorMessage);
                return;
            }

            setAreas(resp.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInstituciones = async () => {
        try {
            const resp = await getInstitucionesForAutocomplete();
            if (!resp.success) {
                console.error(resp);
                toast.error(resp.responseData.message ?? resp.errorMessage);
                return;
            }

            setOptionsInstituciones(resp.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const [selectedInstitucion, setSelectedInstitucion] = useState('');

    const handleInstitucionChange = (event) => {
        const institucionId = event.target.value;
        setSelectedInstitucion(institucionId);
    };

    useEffect(() => {
        fetchInstituciones();
        fetchAreas();
    }, []);

    const filteredAreas = selectedInstitucion ? areas.filter(area => area.institucion_id === selectedInstitucion) : areas;

    const handleItemCreated = async (values) => {
        const resp = await createMultiTable(values);
        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        fetchAreas();
        toast.success(resp.message);
        return { success: true, data: resp };
    };

    const handleItemEdit = async (id) => {
        const resp = await getMultiTableById(id);
        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return;
        }

        if (Object.entries(resp.data).length > 0) {
            setSelectedItem(resp.data);
            setOpenForm(true);
            return;
        }

        toast.warning(`No se encontró el registro`);
    }

    const handleFormClose = () => {
        setSelectedItem(null);
        setOpenForm(false);
    };

    const handleItemUpdate = async (values) => {
        const resp = await updateMultiTable(values.id, values);

        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        toast.success(resp.message);
        fetchAreas();
        return { success: true, data: resp };
    };

    const handleItemDelete = async (item) => {
        setItemIdToDelete(item.id);
        setItemNameToDelete(`${item.nombre}`);
        setIsDialogConfirmDeleteOpen(true);
    };

    const handleDialogConfirmDelete = async () => {
        const resp = await deleteMultiTable(itemIdToDelete);
        if (!(resp === '')) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return;
        }

        fetchAreas();
        toast.success(`Registro eliminado con éxito`);
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
                        AREAS
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="institucion-select-label">Institución</InputLabel>
                        <Select
                            labelId="institucion-select-label"
                            id="institucion-select"
                            value={selectedInstitucion}
                            onChange={handleInstitucionChange}
                        >
                            <MenuItem value="">
                                <em>Todas</em>
                            </MenuItem>
                            {optionsInstituciones.map((institucion) => (
                                <MenuItem key={institucion.id} value={institucion.id}>
                                    {institucion.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={2}>
                    {userLocalStorage && (
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', marginBottom: '12px' }}>
                            <Button variant="contained" onClick={() => setOpenForm(true)}>
                                Nuevo registro
                            </Button>
                        </div>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <MultiTableList data={filteredAreas} onEdit={(id) => handleItemEdit(id)} onDelete={handleItemDelete} />
                </Grid>
            </Grid>

            {userLocalStorage && (
                <MultiTableForm tablaActual={'AREA'} open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdate : handleItemCreated} initialValues={selectedItem || {}} />
            )}

            <DeleteConfirmationDialog
                open={isDialogConfirmDeleteOpen}
                onClose={handleCloseDialogConfirmDelete}
                onConfirm={handleDialogConfirmDelete}
                itemName={itemNameToDelete}
            />
        </MainCard>
    );
};

export default Institucion;
