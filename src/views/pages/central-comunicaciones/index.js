/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, TablePagination, CircularProgress, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadFromLocalStorage } from 'utils/localStorage';
import CommunicationsCenterList from './CommunicationsCenterList';
import CommunicationsCenterForm from './CommunicationsCenterForm';
import CommunicationsCancelForm from './CommunicationsCancelForm';
import CommunicationsDespacharForm from './CommunicationsDespacharForm';
import CommunicationsCenterAttendForm from './CommunicationsAtenderForm';
import CommunicationsVerForm from './CommunicationsVerDetalleForm';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { createCommunicationsCenter, deleteCommunicationsCenter, getCommunicationsCenter, getCommunicationsCenterById, updateCommunicationsCenter, getCommunicationsCenterView } from 'api/communications-center/communicationsCenterApi';
import { get, set } from 'immutable';

const CommunicationsCenter = () => {
    const userLocalStorage = loadFromLocalStorage('user');
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedTurno, setSelectedTurno] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [openVerForm, setOpenVerForm] = useState(false);
    const [openCancelForm, setOpenCancelForm] = useState(false);
    const [openDespacharForm, setOpenDespacharForm] = useState(false);
    const [openConfirmarForm, setOpenConfirmarForm] = useState(false);

    // For option delete
    const [isDialogConfirmDeleteOpen, setIsDialogConfirmDeleteOpen] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [itemNameToDelete, setItemNameToDelete] = useState('');

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedStatus, setSelectedStatus] = useState('');

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

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
        const resp = await createCommunicationsCenter(values);
        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        fetchData();
        toast.success(resp.message);
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

    const handleItemVer = async (id) => {
        console.log(`handleItemVer`, id);
        setOpenVerForm(true);
        const resp = await getCommunicationsCenterView(id);
        console.log(`resp`, resp);
        if (!resp.success) {
            toast.error(resp.errorMessage);
            return;
        }

        if (Object.entries(resp.data).length > 0) {
            setSelectedItem(resp.data);
            return;
        }

        toast.warning(`No se encontró el registro`);
    }
    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedItem(null);
    };
    const handleFormVerClose = () => {
        setSelectedItem(null);
        setOpenVerForm(false);
    };

    const handleCancelFormClose = () => {
        setOpenCancelForm(false);
        setSelectedItem(null);
    };

    const handleDespacharFormClose = () => {
        setOpenDespacharForm(false);
        setSelectedItem(null);
    };

    const handleConfirmarFormClose = () => {
        setOpenConfirmarForm(false);
        setSelectedItem(null);
    };

    const handleItemUpdate = async (values) => {
        console.log(`handleItemUpdate`, values);
        const resp = await updateCommunicationsCenter(values.id, values);
        console.log(`resp`, resp);
        if (!resp.success) {
            toast.error(resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        toast.success(resp.message);
        fetchData();
        return { success: true, data: resp };
    };

    const handleCancel = async (id) => {
        console.log(`handleCancel`, id);
        setSelectedItem({ id });
        setOpenCancelForm(true);
    };

    const handleDespachar = async (item) => {
        console.log(`handleDespachar`, item.id);
        console.log(`item turno`, item.turno)
        setSelectedItem(item);
        setOpenDespacharForm(true);
    };

    const handleConfirmar = async (id) => {
        console.log(`handleConfirmar`, id);
        setSelectedItem({ id });
        setOpenConfirmarForm(true);
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
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="status-select-label">Filtros</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            label="Filtros"
                        >
                            <MenuItem value="">Todos los estados</MenuItem>
                            <MenuItem value="cancelado">Cancelado</MenuItem>
                            <MenuItem value="abierto">Abierto</MenuItem>
                            <MenuItem value="despachado">Despachado</MenuItem>
                            <MenuItem value="atendido">Atendido</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <CommunicationsCenterList
                        selectedStatus={selectedStatus}
                        data={data}
                        onEdit={(id) => handleItemEdit(id)}
                        onDelete={handleItemDelete}
                        onCancel={(id) => handleCancel(id)}
                        onDespachar={(id, selectedTurno) => handleDespachar(id, selectedTurno)}
                        onConfirmar={(id) => handleConfirmar(id)}
                        onVer={(id) => handleItemVer(id)}
                    />
                </Grid>
            </Grid>

            <CommunicationsCenterForm open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdate : handleItemCreated} initialValues={selectedItem || {}} />
            <CommunicationsCancelForm open={openCancelForm} handleClose={handleCancelFormClose} communicationId={selectedItem?.id} fetchData={fetchData} />
            <CommunicationsDespacharForm open={openDespacharForm} handleClose={handleDespacharFormClose} id={selectedItem?.id} turno={selectedItem?.turno} llenarDatos={fetchData} />
            <CommunicationsCenterAttendForm open={openConfirmarForm} handleClose={handleConfirmarFormClose} id={selectedItem?.id} llenarDatos={fetchData} />
            <DeleteConfirmationDialog
                open={isDialogConfirmDeleteOpen}
                onClose={handleCloseDialogConfirmDelete}
                onConfirm={handleDialogConfirmDelete}
                itemName={itemNameToDelete}
            />
            <CommunicationsVerForm open={openVerForm} handleClose={handleFormVerClose} onSubmit={handleItemVer} initialValues={selectedItem || {}} />
            {
                /* <div>
                <TablePagination
                    component="div"
                    count={perPage * totalPages}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPage={perPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            */
            }

        </MainCard>
    )
}

export default CommunicationsCenter;