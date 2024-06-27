/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Paper,
    AppBar,
    Divider,
    Grid,
    IconButton,
    Slide,
    Stack,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Toolbar,
    Box
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import FileCopy from '@mui/icons-material/FileCopy';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { jsPDF } from 'jspdf';
import { loadFromLocalStorage } from 'utils/localStorage';

const maxWidth = 'md';
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const CommunicationsVerForm = ({ open, handleClose, initialValues }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(true); // Comenzamos con loading en true

    useEffect(() => {
        if (initialValues) {
            // Si initialValues ya están presentes, setLoading a false
            setLoading(false);
        }
    }, [initialValues]);
    // regresar a false 

    const renderSectionTitle = (title) => (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {title}
            </Typography>
            <Divider />
        </Grid>
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("VER DETALLE DE COMUNICACIÓN", 10, 10);

        let y = 20;

        const addText = (title, value) => {
            doc.setFontSize(12);
            doc.text(`${title}:`, 10, y);
            doc.setFontSize(10);
            doc.text(`${value}`, 110, y);
            y += 10;
        };

        addText('Fecha de la llamada', dayjs(initialValues.fecha).format('DD/MM/YYYY'));
        addText('Hora de la llamada', initialValues.hora_llamada);
        addText('Tipo comunicación', initialValues.tipo_comunicacion?.nombre || '');
        addText('Turno', initialValues.turno || 'TARDE');
        addText('Zona incidencia', initialValues.zona_incidencia?.nombre || '');
        addText('Descripción de la llamada', initialValues.descripcion_llamada);
        addText('Dirección', initialValues.direccion_cc);
        addText('Tipo Incidencia', initialValues.tipo_apoyo_incidencia?.nombre || '');
        if (initialValues.tipo_delito) {
            addText('Tipo de delito', initialValues.tipo_delito);
        }
        addText('Duplicado', initialValues.es_duplicado ? 'Sí' : 'No');
        addText('Es victima mujer', initialValues.es_victima_mujer ? 'Sí' : 'No');
        addText('Estado', initialValues.estado);

        if (initialValues.fecha_hora_despachado) {
            addText('Fecha y hora de despacho', dayjs(initialValues.fecha_hora_despachado).format('DD/MM/YYYY HH:mm'));
        }
        if (initialValues.comentario_despachado) {
            addText('Comentario de despacho', initialValues.comentario_despachado);
        }
        if (Array.isArray(initialValues.central_distribucion_patrullajes)) {
            initialValues.central_distribucion_patrullajes.forEach((patrullaje, index) => {
                const distribucion = patrullaje.patrullaje_distribucion;

                if (distribucion.vehiculo) {
                    addText('Placa del Vehículo', distribucion.vehiculo.placa);
                }
                if (distribucion.conductor) {
                    addText('Conductor', `${distribucion.conductor.nombres} ${distribucion.conductor.p_apellido} ${distribucion.conductor.s_apellido}`);
                }
                if (distribucion.acompañante) {
                    addText('Acompañante 1', `${distribucion.acompañante.nombres} ${distribucion.acompañante.p_apellido} ${distribucion.acompañante.s_apellido}`);
                }
                if (distribucion.acompañante2) {
                    addText('Acompañante 2', `${distribucion.acompañante2.nombres} ${distribucion.acompañante2.p_apellido} ${distribucion.acompañante2.s_apellido}`);
                }
                if (distribucion.acompañante3) {
                    addText('Acompañante 3', `${distribucion.acompañante3.nombres} ${distribucion.acompañante3.p_apellido} ${distribucion.acompañante3.s_apellido}`);
                }
                if (distribucion.acompañante4) {
                    addText('Acompañante 4', `${distribucion.acompañante4.nombres} ${distribucion.acompañante4.p_apellido} ${distribucion.acompañante4.s_apellido}`);
                }
            });
        }

        if (initialValues.fecha_hora_manual_atendido) {
            addText('Fecha y hora de atención', initialValues.fecha_hora_manual_atendido);
        }
        if (initialValues.comentario_atendido) {
            addText('Comentario de atención', initialValues.comentario_atendido);
        }
        if (initialValues.conflicto_mitigado) {
            addText('Conflicto mitigado', initialValues.conflicto_mitigado ? 'Sí' : 'No');
        }
        if (Array.isArray(initialValues.central_distribucion_patrullajes) && initialValues.central_distribucion_patrullajes.length > 0) {
            const supervisor = initialValues.central_distribucion_patrullajes[0]?.patrullaje_distribucion?.distribucion_personal?.supervisor;

            if (supervisor) {
                addText('Supervisor', `${supervisor.nombres || ''} ${supervisor.p_apellido || ''} ${supervisor.s_apellido || ''}`.trim());
            }
        }


        doc.save('detalle_comunicacion.pdf');
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            aria-labelledby="responsive-dialog-depreciation"
            className="lal-dialog"
        >
            <AppBar position="static">
                <Toolbar>
                    <Typography sx={{ ml: 0, flexGrow: 1, color: '#ffffff' }} variant="h4" component="div">
                        VER DETALLE DE COMUNICACIÓN
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={gridSpacing}>
                            {renderSectionTitle('Etapa de Recepción')}
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Fecha de la llamada:</Typography>
                                <Typography variant="body1">{dayjs(initialValues.fecha).format('DD/MM/YYYY')}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Hora de la llamada:</Typography>
                                <Typography variant="body1">{initialValues.hora_llamada}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Tipo comunicación:</Typography>
                                <Typography variant="body1">{initialValues.tipo_comunicacion?.nombre || ''}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Turno:</Typography>
                                <Typography variant="body1">{initialValues.turno || 'TARDE'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Zona incidencia:</Typography>
                                <Typography variant="body1">{initialValues.zona_incidencia?.nombre || ''}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Typography variant="body2">Descripción de la llamada:</Typography>
                                <Typography variant="body1">{initialValues.descripcion_llamada}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Dirección:</Typography>
                                <Typography variant="body1">{initialValues.direccion_cc}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Tipo Incidencia:</Typography>
                                <Typography variant="body1">{initialValues.tipo_apoyo_incidencia?.nombre || ''}</Typography>
                            </Grid>
                            {initialValues.tipo_delito && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Tipo de delito:</Typography>
                                    <Typography variant="body1">{initialValues.tipo_delito}</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Duplicado:</Typography>
                                <Typography variant="body1">{initialValues.es_duplicado ? 'Sí' : 'No'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Es victima mujer:</Typography>
                                <Typography variant="body1">{initialValues.es_victima_mujer ? 'Sí' : 'No'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2">Estado:</Typography>
                                <Typography variant="body1">{initialValues.estado}</Typography>
                            </Grid>

                            {renderSectionTitle('Etapa de Despacho')}
                            {initialValues.fecha_hora_despachado && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Fecha y hora de despacho:</Typography>
                                    <Typography variant="body1">{dayjs(initialValues.fecha_hora_despachado).format('DD/MM/YYYY HH:mm')}</Typography>
                                </Grid>
                            )}
                            {initialValues.comentario_despachado && (
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="body2">Comentario de despacho:</Typography>
                                    <Typography variant="body1">{initialValues.comentario_despachado}</Typography>
                                </Grid>
                            )}

                            {Array.isArray(initialValues.central_distribucion_patrullajes) && initialValues.central_distribucion_patrullajes.map((patrullaje, index) => (
                                <React.Fragment key={index}>
                                    {patrullaje.patrullaje_distribucion.vehiculo && (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="body2">Placa del Vehículo:</Typography>
                                            <Typography variant="body1">{patrullaje.patrullaje_distribucion.vehiculo.placa}</Typography>
                                        </Grid>
                                    )}

                                    {patrullaje.patrullaje_distribucion.conductor && (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="body2">Conductor:</Typography>
                                            <Typography variant="body1">
                                                {patrullaje.patrullaje_distribucion.conductor.nombres} {patrullaje.patrullaje_distribucion.conductor.p_apellido} {patrullaje.patrullaje_distribucion.conductor.s_apellido}
                                            </Typography>
                                        </Grid>
                                    )}

                                    {patrullaje.patrullaje_distribucion.acompañante && (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="body2">Acompañante 1:</Typography>
                                            <Typography variant="body1">
                                                {patrullaje.patrullaje_distribucion.acompañante.nombres} {patrullaje.patrullaje_distribucion.acompañante.p_apellido} {patrullaje.patrullaje_distribucion.acompañante.s_apellido}
                                            </Typography>
                                        </Grid>
                                    )}

                                    {patrullaje.patrullaje_distribucion.acompañante2 && (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="body2">Acompañante 2:</Typography>
                                            <Typography variant="body1">
                                                {patrullaje.patrullaje_distribucion.acompañante2.nombres} {patrullaje.patrullaje_distribucion.acompañante2.p_apellido} {patrullaje.patrullaje_distribucion.acompañante2.s_apellido}
                                            </Typography>
                                        </Grid>
                                    )}

                                    {patrullaje.patrullaje_distribucion.acompañante3 && (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="body2">Acompañante 3:</Typography>
                                            <Typography variant="body1">
                                                {patrullaje.patrullaje_distribucion.acompañante3.nombres} {patrullaje.patrullaje_distribucion.acompañante3.p_apellido} {patrullaje.patrullaje_distribucion.acompañante3.s_apellido}
                                            </Typography>
                                        </Grid>
                                    )}

                                    {patrullaje.patrullaje_distribucion.acompañante4 && (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="body2">Acompañante 4:</Typography>
                                            <Typography variant="body1">
                                                {patrullaje.patrullaje_distribucion.acompañante4.nombres} {patrullaje.patrullaje_distribucion.acompañante4.p_apellido} {patrullaje.patrullaje_distribucion.acompañante4.s_apellido}
                                            </Typography>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            ))}

                            {renderSectionTitle('Etapa de Atención')}
                            {initialValues.fecha_hora_manual_atendido && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Fecha y hora de atención:</Typography>
                                    <Typography variant="body1">{initialValues.fecha_hora_manual_atendido}</Typography>
                                </Grid>
                            )}
                            {initialValues.comentario_atendido && (
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography variant="body2">Comentario de atención:</Typography>
                                    <Typography variant="body1">{initialValues.comentario_atendido}</Typography>
                                </Grid>
                            )}
                            {initialValues.conflicto_mitigado !== undefined && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Conflicto mitigado:</Typography>
                                    <Typography variant="body1">{initialValues.conflicto_mitigado === 0 ? 'No' : 'Si'}</Typography>
                                </Grid>
                            )}
                            {Array.isArray(initialValues.central_distribucion_patrullajes) && initialValues.central_distribucion_patrullajes.length > 0 && initialValues.central_distribucion_patrullajes[0].patrullaje_distribucion.distribucion_personal.supervisor && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Supervisor:</Typography>
                                    <Typography variant="body1">
                                        {`${initialValues.central_distribucion_patrullajes[0].patrullaje_distribucion.distribucion_personal.supervisor.nombres || ''} ${initialValues.central_distribucion_patrullajes[0].patrullaje_distribucion.distribucion_personal.supervisor.p_apellido || ''} ${initialValues.central_distribucion_patrullajes[0].patrullaje_distribucion.distribucion_personal.supervisor.s_apellido || ''}`.trim()}
                                    </Typography>
                                </Grid>
                            )}


                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={generatePDF} endIcon={<FileCopy />} variant="contained" color="primary">
                    Descargar PDF
                </Button>
                <Button onClick={handleClose} endIcon={<CancelIcon />} variant="contained">
                    Cerrar
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default CommunicationsVerForm;
