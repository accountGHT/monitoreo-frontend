import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, Divider, Grid, TextField, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { despacharCommunicationsCenter } from 'api/communications-center/communicationsCenterApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';

const CommunicationsCenterDispatchForm = ({ open, handleClose, id, llenarDatos }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const [personasSerenazgo, setPersonasSerenazgo] = useState([]);

    const formik = useFormik({
        initialValues: {
            vehiculo_id: null,
            personal_serenazgo_id: null,
            comentario_despachado: '',
        },

        validationSchema: yup.object({
            vehiculo_id: yup.number().required('El vehículo es requerido'),
            personal_serenazgo_id: yup.number().required('El serenazgo es requerido'),
        }),

        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    id: id,
                };
                console.log('payload: ', payload);
                const response = await despacharCommunicationsCenter(id, payload);
                if (response.success) {
                    handleClose();
                    llenarDatos();
                    // Realiza cualquier otra acción necesaria después del despacho exitoso
                } else {
                    console.log(response.message);
                    // Maneja el caso de error en el despacho
                }
            } catch (error) {
                console.log(error);
                // Maneja el caso de error en la solicitud
            }
        },
    });

    useEffect(() => {
        console.log('id despacho: ', id);

        const fetchData = async () => {
            try {
                const vehiculosResponse = await getVehiculosForAutocomplete();
                const personasSerenazgoResponse = await getPersonasForAutocomplete();
                setVehiculos(vehiculosResponse.data);
                setPersonasSerenazgo(personasSerenazgoResponse.data);
            } catch (error) {
                console.log(error);
                // Maneja el caso de error al obtener los datos de vehículos y personas de serenazgo
            }
        };

        fetchData();
    }, []);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <AppBar position="static">
                <Toolbar>
                    <Typography sx={{ ml: 0, flexGrow: 1, color: '#ffffff' }} variant="h4" component="div">
                        DESPACHAR INCIDENCIA N° {id}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                disablePortal
                                id="vehiculo"
                                name="vehiculo"
                                options={vehiculos}
                                getOptionLabel={(option) => (option.placa !== undefined ? `${option.placa}` : '')}
                                value={vehiculos.find((v) => v.id === formik.values.vehiculo_id) || null}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue('vehiculo', newValue || {});
                                    formik.setFieldValue('vehiculo_id', newValue ? newValue.id : null);
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Vehículo"
                                        error={formik.touched.vehiculo_id && Boolean(formik.errors.vehiculo_id)}
                                        helperText={formik.touched.vehiculo_id && formik.errors.vehiculo_id}
                                        variant="standard"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                disablePortal
                                id="personal_serenazgo"
                                name="personal_serenazgo"
                                options={personasSerenazgo}
                                getOptionLabel={(option) => (option.nombres !== undefined ? `${option.nombre_completo}` : '')}
                                value={personasSerenazgo.find((p) => p.id === formik.values.personal_serenazgo_id) || null}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue('personal_serenazgo', newValue || {});
                                    formik.setFieldValue('personal_serenazgo_id', newValue ? newValue.id : null);
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Serenazgo"
                                        error={formik.touched.personal_serenazgo_id && Boolean(formik.errors.personal_serenazgo_id)}
                                        helperText={formik.touched.personal_serenazgo_id && formik.errors.personal_serenazgo_id}
                                        variant="standard"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="comentario_despachado"
                                label="Comentario Despacho"
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
                    </Grid>
                </form>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={handleClose} endIcon={<CancelIcon />} variant="contained">
                    Cerrar
                </Button>
                <Button color="primary" startIcon={<SaveIcon />} variant="contained" onClick={formik.submitForm}>
                    Despachar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationsCenterDispatchForm;