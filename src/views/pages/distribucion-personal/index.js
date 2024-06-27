import React, { useState, useEffect } from 'react';

// material-ui
import { Grid, Button, Typography, CircularProgress, Tabs, Tab } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadFromLocalStorage } from 'utils/localStorage';
import DistribucionPersonalList from './DistribucionPersonalList';
import DistribucionPersonalForm from './DistribucionPersonalForm';
import ManageTeamModal from './ManageTeamModal';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import { createDistribucionPersonal, deleteDistribucionPersonal, getDistribucionPersonal, getDistribucionPersonalById, updateDistribucionPersonal } from 'api/distribucion-personal/distribucionPersonalApi';

const DistribucionPersonal = () => {
    const userLocalStorage = loadFromLocalStorage('user');
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState('DÍA'); // Default turno
    const [loading, setLoading] = useState(true);

    // For option delete
    const [isDialogConfirmDeleteOpen, setIsDialogConfirmDeleteOpen] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [itemNameToDelete, setItemNameToDelete] = useState('');

    const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
    const [teamData, setTeamData] = useState(null);

    const handleManageTeam = (item) => {
        setTeamData(item);
        console.log('item en index', item);
        setIsManageTeamModalOpen(true);
    };

    const handleCloseManageTeamModal = () => {
        setIsManageTeamModalOpen(false);
        setTeamData(null);
        setSelectedItem(null);
    };

    const fetchData = async () => {
        try {
            const resp = await getDistribucionPersonal();
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

    useEffect(() => {
        // Reset team data when selectedTurno changes
        setTeamData(null);
    }, [selectedTurno]);

    const handleItemCreated = async (values) => {
        values.turno = selectedTurno; // Set turno before creating
        const resp = await createDistribucionPersonal(values);
        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        fetchData();
        toast.success(resp.message);
        return { success: true, data: resp };
    };

    const handleItemEdit = async (id) => {
        const resp = await getDistribucionPersonalById(id);
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
    };

    const handleFormClose = () => {
        setSelectedItem(null);
        setOpenForm(false);
    };

    const handleItemUpdate = async (values) => {
        const resp = await updateDistribucionPersonal(values.id, values);
        if (!resp.success) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
            return { success: false, data: resp.responseData };
        }

        toast.success(resp.message);
        fetchData();
        return { success: true, data: resp };
    };

    const handleItemDelete = async (item) => {
        setItemIdToDelete(item.id);
        setItemNameToDelete(" con id " + `${item.id}`);
        setIsDialogConfirmDeleteOpen(true);
    };

    const handleDialogConfirmDelete = async () => {
        const resp = await deleteDistribucionPersonal(itemIdToDelete);
        if (!(resp === '')) {
            toast.error(resp.responseData.message ?? resp.errorMessage);
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

    const handleTabChange = (event, newValue) => {
        console.log('teamdata en index', teamData);
        console.log('newValue en index', newValue);
        setSelectedTurno(newValue);
    };

    const filteredData = data.filter(item => item.turno === selectedTurno);

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
                    <Tabs value={selectedTurno} onChange={handleTabChange} aria-label="Turno Tabs">
                        <Tab label="DÍA" value="DÍA" />
                        <Tab label="TARDE" value="TARDE" />
                        <Tab label="NOCHE" value="NOCHE" />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    <DistribucionPersonalList data={filteredData} onEdit={(id) => handleItemEdit(id)} onDelete={handleItemDelete} onManageTeam={handleManageTeam} />
                </Grid>
            </Grid>
            <DistribucionPersonalForm selectedTurno={selectedTurno} open={openForm} handleClose={handleFormClose} onSubmit={selectedItem ? handleItemUpdate : handleItemCreated} initialValues={selectedItem || {}} />
            <DeleteConfirmationDialog
                open={isDialogConfirmDeleteOpen}
                onClose={handleCloseDialogConfirmDelete}
                onConfirm={handleDialogConfirmDelete}
                itemName={itemNameToDelete}
            />
            <ManageTeamModal
                open={isManageTeamModalOpen}
                onClose={handleCloseManageTeamModal}
                teamData={teamData}
            />
        </MainCard>
    );
};

export default DistribucionPersonal;