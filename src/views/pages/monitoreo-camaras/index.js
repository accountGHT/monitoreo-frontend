import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';

// material-ui
import { Grid, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MonitoreoCamaraForm from './MonitoreoCamaraForm';
import { list } from 'api/monitoreo-camaras/monitoreoCamarasApi';

const MonitoreoCamaras = () => {

    const [openModalAdd, setOpenModalAdd] = useState(false);

    // Functions
    const handleOpenModalAdd = () => setOpenModalAdd(true);
    const closeModalAdd = () => setOpenModalAdd(false);

    const [data, setData] = useState([]);


    const getList = async () => {
        const response = await list();
        setData(response.data);
    }

    const refreshTable = () => {
        // dispatch(getFixedAssetMovement(limit, page));
        console.log(`refreshTable`);
        getList();
    };

    const columns = [
        { field: 'id', headerName: 'Id', width: 30 },
        { field: 'fecha', headerName: 'Fecha', width: 95 },
        { field: 'hora_inicio', headerName: 'Hora inicio', width: 75 },
        { field: 'hora_fin', headerName: 'Hora fin', width: 75 },
        { field: 'turno', headerName: 'Turno', width: 70 },
        { field: 'descripcion_incidencia', headerName: 'Descripción Incidencia', width: 200 },
        { field: 'zona_id', headerName: 'Zona', width: 100 },
        { field: 'camara_nombre', headerName: 'Cámara', width: 100 },
        { field: 'operador_camaras_id', headerName: 'operador_camaras_id', width: 100 },
        { field: 'tipo_incidencia_id', headerName: 'tipo_incidencia_id', width: 100 },
        { field: 'personal_serenazgo_id', headerName: 'personal_serenazgo_id', width: 100 },
        { field: 'vehiculo_serenazgo_id', headerName: 'vehiculo_serenazgo_id', width: 100 },
        { field: 'encargado_id', headerName: 'Encargado', width: 100 },
    ];

    useEffect(() => {
        getList();
        return () => {
            setOpenModalAdd(false);
        }
    }, []);

    return (
        <MainCard title="Monitoreo Cámaras" secondary={<SecondaryAction link="https://next.material-ui.com/system/palette/" />}>
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', marginBottom: '12px' }}>
                <Button variant="contained" color="primary" onClick={handleOpenModalAdd}>
                    Agregar Nuevo Registro
                </Button>
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={data} columns={columns} pageSize={10} />
            </div>
            <Grid container justifyContent="flex-end">
                {openModalAdd && (
                    <MonitoreoCamaraForm open={openModalAdd} handleClose={closeModalAdd} refreshTable={refreshTable} />
                )}
            </Grid>
            <ToastContainer />
        </MainCard>
    )
}

export default MonitoreoCamaras;
