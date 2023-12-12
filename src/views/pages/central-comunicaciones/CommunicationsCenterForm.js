import React, { useEffect, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    AppBar,
    Autocomplete,
    Divider,
    Grid,
    IconButton,
    Slide,
    Stack,
    TextField,
    Toolbar,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent
    // InputLabel,
    // MenuItem,
    // FormControl,
    // Select,
    // FormControlLabel,
    // Switch,
    // InputAdornment
} from '@mui/material';

// assets
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Fechas
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { getTiposComunicacionForAutocomplete, getTiposIncidenciaForAutocomplete, getZonasForAutocomplete } from 'api/multi-table/multiTableApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';

// APIs
// import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';
// import { getPersonasForAutocomplete } from 'api/personas/personasApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const validationSchema = Yup.object({
    fecha: Yup.date().required('La fecha es obligatoria'),
    // hora_llamada: Yup.string().required('La hora de llamada es obligatoria'),
});

// ==============================|| FixedAssetMovementAdd Component ||============================== //
const CommunicationsCenterForm = ({ open, handleClose, onSubmit, initialValues }) => {
    console.log(`initialValues`, initialValues);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Agrega un estado para controlar la carga de datos
    const [loading, setLoading] = useState(true);

    // Fechas
    const locale = dayjs.locale('es');

    // Combos
    const [tiposComunicacion, setTiposComunicacion] = useState([]);
    const [zonasIncidencia, setZonasIncidencia] = useState([]);
    const [tiposIncidencia, setTiposIncidencia] = useState([]);
    const [operadores, setOperadores] = useState([]);
    const [personasSerenazgo, setPersonasSerenazgo] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [supervisores, setSupervisores] = useState([]);

    const loadAutocompletes = async () => {
        const resTiposComunicacion = await getTiposComunicacionForAutocomplete();
        const respZonas = await getZonasForAutocomplete();
        const resTiposIncidencia = await getTiposIncidenciaForAutocomplete();
        const resPersonas = await getPersonasForAutocomplete();
        const resVehiculos = await getVehiculosForAutocomplete();
        setTiposComunicacion(resTiposComunicacion.data);
        setZonasIncidencia(respZonas.data);
        setTiposIncidencia(resTiposIncidencia.data);
        setOperadores(resPersonas.data);
        setPersonasSerenazgo(resPersonas.data);
        setVehiculos(resVehiculos.data);
        setSupervisores(resPersonas.data);
    }

    const formik = useFormik({
        initialValues: {},
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log(`onSubmit`);
            console.log(values);
            const payload = {
                id: values.id || null,
                fecha: dayjs(values.fecha).format('YYYY-MM-DD'),
                hora_llamada: dayjs(values.hora_llamada).format('HH:mm:ss'),
                tipo_comunicacion_id: values.tipo_comunicacion_id,
                // turno: values.turno,
                turno: 'TARDE',
                descripcion_llamada: values.descripcion_llamada,
                zona_incidencia_id: values.zona_incidencia_id,
                operador_id: values.operador_id,
                tipo_apoyo_incidencia_id: values.tipo_apoyo_incidencia_id,
                personal_serenazgo_id: values.personal_serenazgo_id,
                vehiculo_id: values.vehiculo_id,
                supervisor_id: values.supervisor_id,
                detalle_atencion: values.detalle_atencion,
            }
            console.log(`payload`, payload);
            const resp = await onSubmit(payload, resetForm);
            if (resp.success) {
                resetForm();
                handleClose();
            } else {
                console.log(resp.data);
                if (Object.entries(resp.data.errors).length > 0) {
                    formik.setErrors(resp.data.errors);
                }
            }
        }
    });

    useEffect(() => {
        if (open) {
            loadAutocompletes();

            formik.setValues({
                id: initialValues.id || null,
                fecha: initialValues.fecha || dayjs(),
                hora_llamada: initialValues.hora_llamada || null,
                tipo_comunicacion_id: initialValues.tipo_comunicacion_id || '',
                tipo_comunicacion: initialValues.tipo_comunicacion || {},
                turno: initialValues.turno || '',
                descripcion_llamada: initialValues.descripcion_llamada || '',
                zona_incidencia_id: initialValues.zona_incidencia_id || '',
                zona_incidencia: initialValues.zona_incidencia || {},
                operador_id: initialValues.operador_id || '',
                operador: initialValues.operador || {},
                tipo_apoyo_incidencia_id: initialValues.tipo_apoyo_incidencia_id || '',
                tipo_apoyo_incidencia: initialValues.tipo_apoyo_incidencia || {},
                personal_serenazgo_id: initialValues.personal_serenazgo_id || '',
                personal_serenazgo: initialValues.personal_serenazgo || {},
                vehiculo_id: initialValues.vehiculo_id || '',
                vehiculo: initialValues.vehiculo || {},
                supervisor_id: initialValues.supervisor_id || '',
                supervisor: initialValues.supervisor || {},
                detalle_atencion: initialValues.detalle_atencion || '',
            });

            setLoading(false);
        }
        return () => {
            formik.resetForm();
        }
    }, [open]);

    return (
        <>
            {loading ? (
                <p>Cargando...</p>
            ) : (
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
                                Agregar Registro
                            </Typography>
                            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={gridSpacing}>

                                <Grid item xs={12} sm={6} md={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                                        <Stack spacing={3}>
                                            <DatePicker
                                                id="fecha"
                                                name="fecha"
                                                views={['day', 'month', 'year']}
                                                inputFormat="DD/MM/YYYY"
                                                label="Fecha *"
                                                value={formik.values.fecha}
                                                onChange={(newValue) => {
                                                    formik.setFieldValue('fecha', newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={formik.touched.fecha && Boolean(formik.errors.fecha)}
                                                        helperText={formik.touched.fecha && formik.errors.fecha}
                                                        variant="standard"
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                                        <TimePicker
                                            label="Hora"
                                            value={formik.values.hora_llamada}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('hora_llamada', newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={formik.touched.hora_llamada && Boolean(formik.errors.hora_llamada)}
                                                    helperText={formik.touched.hora_llamada && formik.errors.hora_llamada}
                                                    variant="standard"
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="tipo_comunicacion"
                                        name="tipo_comunicacion"
                                        options={tiposComunicacion}

                                        getOptionLabel={(option) =>
                                            option.nombre !== undefined ? `${option.nombre}` : ''
                                        }
                                        value={tiposComunicacion.find((p) => p.id === formik.values.tipo_comunicacion_id) || null}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('tipo_comunicacion', newValue || {});
                                            formik.setFieldValue('tipo_comunicacion_id', newValue ? newValue.id : null);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo comunicación"
                                                error={formik.touched.tipo_comunicacion_id && Boolean(formik.errors.tipo_comunicacion_id)}
                                                helperText={formik.touched.tipo_comunicacion_id && formik.errors.tipo_comunicacion_id}
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* turno */}

                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        id="descripcion_llamada"
                                        label="Descripción de la llamada"
                                        multiline
                                        maxRows={4}
                                        fullWidth
                                        variant="standard"
                                        value={formik.values.descripcion_llamada}
                                        onChange={(event) => {
                                            formik.handleChange(event);
                                        }}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="zona_incidencia"
                                        name="zona_incidencia"
                                        options={zonasIncidencia}
                                        getOptionLabel={(option) =>
                                            option.nombre !== undefined ? `${option.nombre}` : ''
                                        }
                                        value={zonasIncidencia.find((p) => p.id === formik.values.zona_incidencia_id) || null}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('zona_incidencia', newValue || {});
                                            formik.setFieldValue('zona_incidencia_id', newValue ? newValue.id : null);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Zona"
                                                error={formik.touched.zona_incidencia_id && Boolean(formik.errors.zona_incidencia_id)}
                                                helperText={formik.touched.zona_incidencia_id && formik.errors.zona_incidencia_id}
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="operador"
                                        name="operador"
                                        options={operadores}
                                        getOptionLabel={(option) =>
                                            option.nombres !== undefined ? `${option.nombre_completo}` : ''
                                        }
                                        value={operadores.find((p) => p.id === formik.values.operador_id) || null}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('operador', newValue || {});
                                            formik.setFieldValue('operador_id', newValue ? newValue.id : null);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Operador"
                                                error={formik.touched.operador_id && Boolean(formik.errors.operador_id)}
                                                helperText={formik.touched.operador_id && formik.errors.operador_id}
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="tipo_apoyo_incidencia"
                                        name="tipo_apoyo_incidencia"
                                        options={tiposIncidencia}
                                        getOptionLabel={(option) =>
                                            option.nombre !== undefined ? `${option.nombre}` : ''
                                        }
                                        value={tiposIncidencia.find((p) => p.id === formik.values.tipo_apoyo_incidencia_id) || null}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('tipo_apoyo_incidencia', newValue || {});
                                            formik.setFieldValue('tipo_apoyo_incidencia_id', newValue ? newValue.id : null);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo Incidencia"
                                                error={formik.touched.tipo_apoyo_incidencia_id && Boolean(formik.errors.tipo_apoyo_incidencia_id)}
                                                helperText={formik.touched.tipo_apoyo_incidencia_id && formik.errors.tipo_apoyo_incidencia_id}
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
                                        getOptionLabel={(option) =>
                                            option.nombres !== undefined ? `${option.nombre_completo}` : ''
                                        }
                                        value={personasSerenazgo.find((p) => p.id === formik.values.personal_serenazgo_id) || null}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('personal_serenazgo', newValue || {});
                                            formik.setFieldValue('personal_serenazgo_id', newValue ? newValue.id : null);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Sereno"
                                                error={formik.touched.personal_serenazgo_id && Boolean(formik.errors.personal_serenazgo_id)}
                                                helperText={formik.touched.personal_serenazgo_id && formik.errors.personal_serenazgo_id}
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="vehiculo"
                                        name="vehiculo"
                                        options={vehiculos}
                                        getOptionLabel={(option) =>
                                            option.placa !== undefined ? `${option.placa}` : ''
                                        }
                                        value={vehiculos.find((p) => p.id === formik.values.vehiculo_id) || null}
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
                                        id="supervisor"
                                        name="supervisor"
                                        options={supervisores}
                                        getOptionLabel={(option) =>
                                            option.nombres !== undefined ? `${option.nombre_completo}` : ''
                                        }
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

                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        id="detalle_atencion"
                                        label="Resultado de la atención"
                                        multiline
                                        maxRows={4}
                                        fullWidth
                                        variant="standard"
                                        value={formik.values.detalle_atencion}
                                        onChange={(event) => {
                                            formik.handleChange(event);
                                        }}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>

                            </Grid>
                            {/* <Button id="btnSubmitForm" type="submit" sx={{ display: 'none' }}>
                                submit
                            </Button> */}
                        </form>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleClose} endIcon={<CancelIcon />} variant="contained">
                            Cerrar
                        </Button>
                        <Button
                            color="primary"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            onClick={formik.submitForm}
                        // onClick={() => {
                        //     document.getElementById('btnSubmitForm').click();
                        // }}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default CommunicationsCenterForm;