import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import VehiclesAdd from './VehiclesAdd';
import { getVehiculos } from 'api/vehiculos/vehiculosApi';

const Vehicles = () => {
    const [openModalAdd, setOpenModalAdd] = useState(false);

    // Functions
    const handleOpenModalAdd = () => setOpenModalAdd(true);
    const closeModalAdd = () => setOpenModalAdd(false);

    const [data, setData] = useState([]);

    const fillVehiculos = async () => {
        const resp = await getVehiculos();
        console.log(resp);
        setData(resp.data.data);
    }


    const refreshTable = () => {
        console.log(`refreshTable`);
        fillVehiculos();
    };

    const columns = [
        { field: 'id', headerName: 'Id', width: 30 },
        { field: 'codigo', headerName: 'Código', width: 75 },
        { field: 'marca', headerName: 'Marca', width: 75 },
        { field: 'modelo', headerName: 'Modelo', width: 75 },
        { field: 'anio', headerName: 'Año', width: 70 },
        { field: 'placa', headerName: 'Placa', width: 70 },
        { field: 'color', headerName: 'Color', width: 70 },
        { field: 'kilometraje', headerName: 'Kilometraje', width: 130 },
        {
            field: 'esta_operativo',
            headerName: 'Operativo',
            width: 100,
            renderCell: (params) => {
                return params.row.esta_operativo ? 'SI' : 'NO';
            }
        },
        { field: 'descripcion', headerName: 'Descripción', width: 200 },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 200,
            renderCell: (params) => {
                return params.row.estado ? 'SI' : 'NO';
            }
        },
    ];

    useEffect(() => {
        fillVehiculos();
        return () => {
            setOpenModalAdd(false);
        }
    }, []);
    return (
        <MainCard title="Vehículos" style={{ marginTop: '20px' }} secondary={<SecondaryAction link="#" />}>
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
                    <VehiclesAdd open={openModalAdd} handleClose={closeModalAdd} refreshTable={refreshTable} />
                )}
            </Grid>
            <ToastContainer />
        </MainCard>
    )
}

export default Vehicles;