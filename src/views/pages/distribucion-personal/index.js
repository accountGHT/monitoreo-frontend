import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Button } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DistribucionPersonalForm from './DistribucionPersonalForm';
// import { list } from 'api/monitoreo-camaras/monitoreoCamarasApi';


const DistribucionPersonal = () => {
    const [openModalAdd, setOpenModalAdd] = useState(false);

    // Functions
    const handleOpenModalAdd = () => setOpenModalAdd(true);
    const closeModalAdd = () => setOpenModalAdd(false);

    const refreshTable = () => {
        console.log(`refreshTable`);
        // getList();
    };

    useEffect(() => {
        // getList();
        return () => {
            setOpenModalAdd(false);
        }
    }, []);

    return (
        <MainCard title="Distribución del personal" secondary={<SecondaryAction link="/" />}>
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', marginBottom: '12px' }}>
                <Button variant="contained" color="primary" onClick={handleOpenModalAdd}>
                    Agregar Nuevo Registro
                </Button>
            </div>
            <Grid container justifyContent="flex-end">
                {openModalAdd && (
                    <DistribucionPersonalForm open={openModalAdd} handleClose={closeModalAdd} refreshTable={refreshTable}></DistribucionPersonalForm>
                )}
            </Grid>
            <ToastContainer />
        </MainCard>
    )
}

export default DistribucionPersonal