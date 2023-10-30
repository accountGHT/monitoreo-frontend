import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, CircularProgress, Paper } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CentralComunicacionesForm from './CentralComunicacionesForm';
// import { list } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import axios from 'axios';

const CentralComunicaciones = () => {
    const [openModalAdd, setOpenModalAdd] = useState(false);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Functions
    const handleOpenModalAdd = () => setOpenModalAdd(true);
    const closeModalAdd = () => setOpenModalAdd(false);

    const formatearFecha = (fecha) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fecha).toLocaleDateString(undefined, options);
    }

    const formatearHora = (hora) => {
        // const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(hora).toLocaleTimeString(undefined, options);
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/central-comunicaciones?page=${page}`
            );
            const responseData = response.data.data.data;
            setData(responseData);
            setTotalPages(response.data.data.last_page);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshTable = () => {
        console.log(`refreshTable`);
        fetchData();
    };

    useEffect(() => {
        fetchData();
        return () => {
            setOpenModalAdd(false);
        }
    }, []);

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
        <MainCard title="Central de comunicaciones" secondary={<SecondaryAction link="/" />}>
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', marginBottom: '12px' }}>
                <Button variant="contained" color="primary" onClick={handleOpenModalAdd}>
                    Agregar Nuevo Registro
                </Button>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Hora llamada</TableCell>
                                <TableCell>Tipo comunicacion</TableCell>
                                <TableCell>Turno</TableCell>
                                <TableCell>descripcion_llamada</TableCell>
                                <TableCell>Zona Incidencia</TableCell>
                                <TableCell>Operador</TableCell>
                                <TableCell>Tipo Incidencia</TableCell>
                                <TableCell>Vehículo</TableCell>
                                <TableCell>Personal serenazgo</TableCell>
                                <TableCell>detalle_atencion</TableCell>
                                <TableCell>Supervisor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{formatearFecha(item.fecha)}</TableCell>
                                    <TableCell>{formatearHora(item.hora_llamada)}</TableCell>
                                    <TableCell>{item.tipo_comunicacion.nombre}</TableCell>
                                    <TableCell>{item.turno}</TableCell>
                                    <TableCell>{item.descripcion_llamada}</TableCell>
                                    <TableCell>{item.zona_incidencia.nombre}</TableCell>
                                    <TableCell>{`${item.operador.nombres} ${item.operador.p_apellido}`}</TableCell>
                                    <TableCell>{item.tipo_apoyo_incidencia.nombre}</TableCell>
                                    <TableCell>{item.vehiculo.placa}</TableCell>
                                    <TableCell>{`${item.personal_serenazgo.nombres} ${item.personal_serenazgo.p_apellido}`}</TableCell>
                                    <TableCell>{item.detalle_atencion}</TableCell>
                                    <TableCell>{`${item.supervisor.nombres} ${item.supervisor.p_apellido}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={perPage * totalPages}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPage={perPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            <Grid container justifyContent="flex-end">
                {openModalAdd && (
                    <CentralComunicacionesForm open={openModalAdd} handleClose={closeModalAdd} refreshTable={refreshTable}></CentralComunicacionesForm>
                )}
            </Grid>
            <ToastContainer />
        </MainCard>
    )
}

export default CentralComunicaciones