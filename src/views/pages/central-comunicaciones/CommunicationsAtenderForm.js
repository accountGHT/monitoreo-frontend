import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, Divider, Grid, TextField, Toolbar, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { atenderCommunicationsCenter } from 'api/communications-center/communicationsCenterApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const CommunicationsCenterAttendForm = ({ open, handleClose, id, llenarDatos }) => {
    const [supervisores, setSupervisores] = useState([]);

    const formik = useFormik({
        initialValues: {
            supervisor_id: null,
            comentario_atendido: '',
            conflicto_mitigado: false,
            fecha_hora_manual_atendido: dayjs(),
        },

        validationSchema: yup.object({
            supervisor_id: yup.number().required('El supervisor es requerido'),
            conflicto_mitigado: yup.boolean().required('El campo conflicto mitigado es requerido'),
            fecha_hora_manual_atendido: yup.date().required('La fecha y hora de atención es requerida'),
        }),

        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    id: id,
                    fecha_hora_manual_atendido: values.fecha_hora_manual_atendido.format('YYYY-MM-DD HH:mm:ss'),
                };
                console.log('payload: ', payload);
                const response = await atenderCommunicationsCenter(id, payload);
                if (response.success) {
                    handleClose();
                    llenarDatos();
                    // Realiza cualquier otra acción necesaria después de la atención exitosa
                } else {
                    console.log(response.message);
                    // Maneja el caso de error en la atención
                }
            } catch (error) {
                console.log(error);
                // Maneja el caso de error en la solicitud
            }
        },
    });

    useEffect(() => {
        console.log('id atender: ', id);

        const fetchData = async () => {
            try {
                const supervisoresResponse = await getPersonasForAutocomplete();
                setSupervisores(supervisoresResponse.data);
            } catch (error) {
                console.log(error);
                // Maneja el caso de error al obtener los datos de supervisores
            }
        };

        fetchData();
    }, []);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <AppBar position="static">
                <Toolbar>
                    <Typography sx={{ ml: 0, flexGrow: 1, color: '#ffffff' }} variant="h4" component="div">
                        ATENDER INCIDENCIA N° {id}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                disablePortal
                                id="supervisor"
                                name="supervisor"
                                options={supervisores}
                                getOptionLabel={(option) => (option.nombres !== undefined ? `${option.nombre_completo}` : '')}
                                value={supervisores.find((p) => p.id === formik.values.supervisor_id) || null}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue('supervisor', newValue || {});
                                    formik.setFieldValue('supervisor_id', newValue ? newValue.id : null);
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Supervisor"
                                        error={formik.touched.supervisor_id && Boolean(formik.errors.supervisor_id)}
                                        helperText={formik.touched.supervisor_id && formik.errors.supervisor_id}
                                        variant="standard"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="conflicto-mitigado-label">Conflicto Mitigado</InputLabel>
                                <Select
                                    labelId="conflicto-mitigado-label"
                                    id="conflicto-mitigado"
                                    name="conflicto_mitigado"
                                    value={formik.values.conflicto_mitigado}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.conflicto_mitigado && Boolean(formik.errors.conflicto_mitigado)}
                                >
                                    <MenuItem value={true}>Sí</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Fecha y Hora de Atención"
                                    value={formik.values.fecha_hora_manual_atendido}
                                    onChange={(value) => formik.setFieldValue('fecha_hora_manual_atendido', value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="standard"
                                            error={formik.touched.fecha_hora_manual_atendido && Boolean(formik.errors.fecha_hora_manual_atendido)}
                                            helperText={formik.touched.fecha_hora_manual_atendido && formik.errors.fecha_hora_manual_atendido}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="comentario_atendido"
                                label="Comentario de Atención"
                                multiline
                                maxRows={4}
                                fullWidth
                                variant="standard"
                                value={formik.values.comentario_atendido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.comentario_atendido && Boolean(formik.errors.comentario_atendido)}
                                helperText={formik.touched.comentario_atendido && formik.errors.comentario_atendido}
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
                    Atender
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationsCenterAttendForm;