import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, CircularProgress, Paper } from '@mui/material';

// ui-component
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DistribucionPersonalForm from './DistribucionPersonalForm';
import axios from 'axios';


const DistribucionPersonal = () => {
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
                `https://apimonitoreotalara.pagaltoque.com/api/distribucion-personal?page=${page}`
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
        <MainCard title="Distribución del personal" secondary={<SecondaryAction link="/" />}>
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
                                <TableCell>Hora</TableCell>
                                <TableCell>Turno</TableCell>
                                <TableCell>Patrullero</TableCell>
                                <TableCell>Vehículo</TableCell>
                                <TableCell>Zona</TableCell>
                                <TableCell>PATRULLAJE MUNICIPAL O INTEGRADO</TableCell>
                                <TableCell style={{ width: "200px" }}>Ubicacion persona</TableCell>
                                <TableCell>Tipo patrullaje</TableCell>
                                <TableCell>Num. Ocurrencia</TableCell>
                                <TableCell>Entregó hoja ruta?</TableCell>
                                <TableCell>Cód. radio</TableCell>
                                <TableCell>Supervisor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{formatearFecha(item.fecha)}</TableCell>
                                    <TableCell>{formatearHora(item.hora)}</TableCell>
                                    <TableCell>{item.turno}</TableCell>
                                    <TableCell>{`${item.patrullero.nombres} ${item.patrullero.p_apellido}`}</TableCell>
                                    <TableCell>{item.vehiculo.placa}</TableCell>
                                    <TableCell>{item.zona.nombre}</TableCell>
                                    <TableCell>
                                        {item.patrullaje_integrado ? `PATRULLAJE INTEGRADO` : `PATRULLAJE MUNICIPAL`}
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>{item.ubicacion_persona}</TableCell>
                                    <TableCell>{item.tipo_patrullaje.nombre}</TableCell>
                                    <TableCell>{item.num_partes_ocurrencia}</TableCell>
                                    <TableCell>{item.entrega_hoja_ruta ? `SI` : `NO`}</TableCell>
                                    <TableCell>{item.codigo_radio}</TableCell>
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
                    <DistribucionPersonalForm open={openModalAdd} handleClose={closeModalAdd} refreshTable={refreshTable}></DistribucionPersonalForm>
                )}
            </Grid>
            <ToastContainer />
        </MainCard>
    )
}

export default DistribucionPersonal