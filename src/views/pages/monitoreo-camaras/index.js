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
        console.log(response);
        setData(response.data.data);
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
        {
            field: 'zona',
            headerName: 'Zona',
            width: 100,
            renderCell: (params) => {
                return params.row.zona.nombre; // Accede a la propiedad 'nombre' de la propiedad 'zona' del objeto
            }
        },
        { field: 'camara_nombre', headerName: 'Cámara', width: 100 },
        {
            field: 'operador_camaras',
            headerName: 'Operador de cámaras',
            width: 200,
            renderCell: (params) => {
                return params.row.operador_camaras.nombres + ' ' + params.row.personal_serenazgo.p_apellido;
            }
        },
        {
            field: 'tipo_incidencia',
            headerName: 'Tipo de Incidencia',
            width: 150,
            renderCell: (params) => {
                return params.row.tipo_incidencia.nombre; // Accede a la propiedad 'nombre' de la propiedad 'tipo_incidencia' del objeto
            }
        },
        {
            field: 'personal_serenazgo',
            headerName: 'Personal de Serenazgo',
            width: 200,
            renderCell: (params) => {
                return params.row.personal_serenazgo.nombres + ' ' + params.row.personal_serenazgo.p_apellido;
            }
        },
        {
            field: 'vehiculo_serenazgo',
            headerName: 'Vehiculo de Serenazgo',
            width: 200,
            renderCell: (params) => {
                return params.row.vehiculo_serenazgo.placa;
            }
        },

        {
            field: 'encargado',
            headerName: 'Encargado',
            width: 200,
            renderCell: (params) => {
                return params.row.encargado.nombres + ' ' + params.row.encargado.p_apellido;
            }
        },
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
            <div style={{ height: 500, width: '100%' }}>
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
