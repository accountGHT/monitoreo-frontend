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
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { loadFromLocalStorage } from 'utils/localStorage';

const maxWidth = 'md';
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const CommunicationsVerForm = ({ open, handleClose, initialValues }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            setLoading(false);
        }
        return () => {
            setLoading(true);
        };
    }, [open]);

    const renderSectionTitle = (title) => (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {title}
            </Typography>
            <Divider />
        </Grid>
    );

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
                    <p>Cargando...</p>
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
                            {initialValues.vehiculo && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Placa:</Typography>
                                    <Typography variant="body1">{initialValues.vehiculo.placa}</Typography>
                                </Grid>
                            )}
                            {initialValues.personal_serenazgo && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Serenazgo:</Typography>
                                    <Typography variant="body1">
                                        {`${initialValues.personal_serenazgo.nombres || ''} ${initialValues.personal_serenazgo.p_apellido || ''} ${initialValues.personal_serenazgo.s_apellido || ''}`.trim()}
                                    </Typography>
                                </Grid>
                            )}

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
                            {initialValues.conflicto_mitigado && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Conflicto mitigado:</Typography>
                                    <Typography variant="body1">{initialValues.conflicto_mitigado ? 'Sí' : 'No'}</Typography>
                                </Grid>
                            )}
                            {initialValues.supervisor && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="body2">Supervisor:</Typography>
                                    <Typography variant="body1">
                                        {`${initialValues.supervisor.nombres || ''} ${initialValues.supervisor.p_apellido || ''} ${initialValues.supervisor.s_apellido || ''}`.trim()}
                                    </Typography>                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={handleClose} endIcon={<CancelIcon />} variant="contained">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationsVerForm;
