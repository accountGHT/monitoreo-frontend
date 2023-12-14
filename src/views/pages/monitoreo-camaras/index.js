import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, Typography, CircularProgress } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadFromLocalStorage } from 'utils/localStorage';
import MonitoreoCamarasList from './MonitoreoCamarasList';
import MonitoreoCamaraForm from './MonitoreoCamaraForm';
import { createMonitoreoCamaras, deleteMonitoreoCamaras, getMonitoreoCamaras, getMonitoreoCamarasById, updateMonitoreoCamaras } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

const MonitoreoCamaras = () => {
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
            const resp = await getMonitoreoCamaras(params);
            console.log(resp);

            if (!resp.success) {
                console.error(resp);
                toast.error(resp.errorMessage);
                return;
            }

            setData(resp.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleItemCreated = async (values) => {
        console.log(`handleItemCreated`, values);
        const resp = await createMonitoreoCamaras(values);
        console.log(`resp`, resp);
        if (!resp.success) {
            toast.error(resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        fetchData();
        toast.success(resp.message);
        return { success: true, data: resp };
    };

    const handleItemEdit = async (id) => {
        const resp = await getMonitoreoCamarasById(id);
        if (!resp.success) {
            toast.error(resp.errorMessage);
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
        setOpenForm(false);
        setSelectedItem(null);
    };

    const handleItemUpdate = async (values) => {
        const resp = await updateMonitoreoCamaras(values.id, values);
        if (!resp.success) {
            toast.error(resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        toast.success(resp.message);
        fetchData();
        return { success: true, data: resp };
    };

    const handleItemDelete = async (item) => {
        console.log(`handleItemDelete`, item);
        setItemIdToDelete(item.id);
        setItemNameToDelete(" con id " + `${item.id}`);
        setIsDialogConfirmDeleteOpen(true);
    };

    const handleDialogConfirmDelete = async () => {
        const resp = await deleteMonitoreoCamaras(itemIdToDelete);
        if (!(resp === '')) {
            toast.error(resp.errorMessage);
            return;
        }

        fetchData();
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
            <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={6}>
                    <Typography variant="h2" gutterBottom>
                        Monitoreo Cámaras
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
                    <MonitoreoCamarasList data={data} onEdit={(id) => handleItemEdit(id)} onDelete={handleItemDelete} />
                </Grid>
            </Grid>

            <MonitoreoCamaraForm open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdate : handleItemCreated} initialValues={selectedItem || {}} />
            <DeleteConfirmationDialog
                open={isDialogConfirmDeleteOpen}
                onClose={handleCloseDialogConfirmDelete}
                onConfirm={handleDialogConfirmDelete}
                itemName={itemNameToDelete}
            />
        </MainCard>
    )
}

export default MonitoreoCamaras;
