import React, { useEffect, useState } from 'react';
// material-ui
import {
    Grid, Button, TablePagination, CircularProgress, Typography
} from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import CentralComunicacionesForm from './CentralComunicacionesForm';
import { loadFromLocalStorage } from 'utils/localStorage';
import CommunicationsCenterForm from './CommunicationsCenterForm';
import CommunicationsCenterList from './CommunicationsCenterList';
import { createCommunicationsCenter, deleteCommunicationsCenter, getCommunicationsCenter, getCommunicationsCenterById } from 'api/communications-center/communicationsCenterApi';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

const CommunicationsCenter = () => {
    const userLocalStorage = loadFromLocalStorage('user');
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openForm, setOpenForm] = useState(false);

    // For option delete
    const [isDialogConfirmDeleteOpen, setIsDialogConfirmDeleteOpen] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [itemNameToDelete, setItemNameToDelete] = useState('');

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        setPerPage(10);
        try {
            let params = `?per_page=${perPage}`;
            const resp = await getCommunicationsCenter(params);
            console.log(resp);

            if (!resp.success) {
                console.error(resp);
                toast.error(resp.errorMessage);
                return;
            }

            setData(resp.data);
            setTotalPages(resp.pagination.last_page);
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
        const resp = await createCommunicationsCenter(values);
        if (!resp.success) {
            // setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
            return { success: false, data: resp.responseData };
        }

        fetchData();
        // setSnackbar({ open: true, message: resp.message, severity: 'success' });
        // toast.success(respCreate.message);
        return { success: true, data: resp };
    };

    const handleItemEdit = async (id) => {
        console.log(`handleItemEdit`, id);
        const resp = await getCommunicationsCenterById(id);
        console.log(`resp`, resp);
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

    const handleItemUpdate = async (values) => {
        console.log(`handleItemUpdate`, values);
        // const resp = await updateDistribucionPersonal(values.id, values);

        // if (!resp.success) {
        //     setSnackbar({ open: true, message: resp.errorMessage, severity: 'error' });
        //     return { success: false, data: resp.responseData };
        // }

        // setSnackbar({ open: true, message: resp.message, severity: 'success' });
        // fetchData();
        // return { success: true, data: resp };
    };

    const handleItemDelete = async (item) => {
        setItemIdToDelete(item.id);
        setItemNameToDelete(" con id " + `${item.id}`);
        setIsDialogConfirmDeleteOpen(true);
    };

    const handleDialogConfirmDelete = async () => {
        const resp = await deleteCommunicationsCenter(itemIdToDelete);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(1);
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
                        Central de Comunicaciones
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
                    <CommunicationsCenterList data={data} onEdit={(id) => handleItemEdit(id)} onDelete={handleItemDelete} />
                </Grid>
            </Grid>

            <CommunicationsCenterForm open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdate : handleItemCreated} initialValues={selectedItem || {}} />
            <DeleteConfirmationDialog
                open={isDialogConfirmDeleteOpen}
                onClose={handleCloseDialogConfirmDelete}
                onConfirm={handleDialogConfirmDelete}
                itemName={itemNameToDelete}
            />

            <div>
                <TablePagination
                    component="div"
                    count={perPage * totalPages}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPage={perPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </MainCard>
    )
}

export default CommunicationsCenter;