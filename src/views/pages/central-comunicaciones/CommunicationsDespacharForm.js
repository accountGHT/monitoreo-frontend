/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogActions, DialogContent, Divider, Grid, TextField, Toolbar, Typography, List, ListItem, ListItemText, Checkbox, ListItemSecondaryAction } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { despacharCommunicationsCenter } from 'api/communications-center/communicationsCenterApi';
import { getPatrullajes } from 'api/patrullajes-modal/patrullajesApi';

const CommunicationsCenterDispatchForm = ({ open, handleClose, id, turno, llenarDatos }) => {
    const [patrullajes, setPatrullajes] = useState([]);
    const [selectedPatrullajes, setSelectedPatrullajes] = useState([]);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            comentario_despachado: '',
        },
        onSubmit: async (values) => {
            try {
                const payload = {
                    comentario_despachado: values.comentario_despachado,
                    patrullaje_distribucion_id: selectedPatrullajes,
                };
                console.log('payload: ', payload);
                const response = await despacharCommunicationsCenter(id, payload);
                if (response.success) {
                    handleClose();
                    llenarDatos();
                    toast.success('Incidencia despachada exitosamente');
                } else {
                    console.log(response.message);
                    toast.error('Ocurrió un error al despachar la incidencia: ' + response.message);
                }
            } catch (error) {
                console.log(error);
                toast.error('Ocurrió un error al despachar la incidencia: ' + error.message);
            }
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const patrullajesData = await getPatrullajes();
                console.log('patrullajesData: ', patrullajesData);
                console.log('turno en despachar', turno);
                setPatrullajes(patrullajesData);
            } catch (error) {
                console.log(error);
                toast.error('Error al obtener los patrullajes');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patrullajesData = await getPatrullajes();
                console.log('patrullajesData: ', patrullajesData);
                console.log('turno en despachar', turno);

                const filteredTurnos = patrullajesData.filter(patrullaje => patrullaje.distribucion_personal.turno === turno);
                setPatrullajes(filteredTurnos);
                console.log('turnos filtrados en mdl', filteredTurnos);
            } catch (error) {
                console.log(error);
                toast.error('Error al obtener los patrullajes');
            }
        };

        fetchData();
    }, [turno]);

    const handleTogglePatrullaje = (patrullajeId) => {
        setSelectedPatrullajes(prev =>
            prev.includes(patrullajeId)
                ? prev.filter(id => id !== patrullajeId)
                : [...prev, patrullajeId]
        );
    };

    const resetForm = () => {
        formik.resetForm();
        setSelectedPatrullajes([]);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <AppBar position="static">
                <Toolbar>
                    <Typography sx={{ ml: 0, flexGrow: 1, color: '#ffffff' }} variant="h4" component="div">
                        DESPACHAR INCIDENCIA N° {id}
                    </Typography>
                </Toolbar>
            </AppBar>

            {
                loading ? (
                    <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </DialogContent>
                ) : (
                    < DialogContent >
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="comentario_despachado"
                                        label="Comentario Despacho (Opcional)"
                                        multiline
                                        maxRows={4}
                                        fullWidth
                                        variant="standard"
                                        value={formik.values.comentario_despachado}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.comentario_despachado && Boolean(formik.errors.comentario_despachado)}
                                        helperText={formik.touched.comentario_despachado && formik.errors.comentario_despachado}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Seleccionar Patrullajes</Typography>
                                    <List>
                                        {patrullajes.map((patrullaje) => (
                                            <ListItem key={patrullaje.id} dense button onClick={() => handleTogglePatrullaje(patrullaje.id)}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedPatrullajes.includes(patrullaje.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                                <ListItemText
                                                    primary={`${patrullaje.tipo_patrullaje.nombre} - ${patrullaje.distribucion_personal.nombre_equipo}`}
                                                    secondary={`Acompañante: ${patrullaje.acompañante?.nombres} ${patrullaje.acompañante?.p_apellido}`}
                                                />
                                                <ListItemSecondaryAction>
                                                    <Typography variant="caption">
                                                        {patrullaje.distribucion_personal.turno}
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                )
            }
            <Divider />
            <DialogActions>
                <Button onClick={handleClose} endIcon={<CancelIcon />} variant="contained">
                    Cerrar
                </Button>
                <Button color="primary" startIcon={<SaveIcon />} variant="contained" onClick={formik.submitForm}>
                    Despachar
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default CommunicationsCenterDispatchForm;