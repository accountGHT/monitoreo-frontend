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
    //   const [patrulleros, setPatrulleros] = useState([]);
    //   const [supervisores, setSupervisores] = useState([]);
    //   const [vehiculos, setVehiculos] = useState([]);

    const loadAutocompletes = async () => {
        const resTiposComunicacion = await getTiposComunicacionForAutocomplete();
        const respZonas = await getZonasForAutocomplete();
        const resTiposIncidencia = await getTiposIncidenciaForAutocomplete();
        //     const resPersonas = await getPersonasForAutocomplete();
        //     const resVehiculos = await getVehiculosForAutocomplete();
        //     setzonasList(respZonas.data);
        setTiposComunicacion(resTiposComunicacion.data);
        setZonasIncidencia(respZonas.data);
        setTiposIncidencia(resTiposIncidencia.data);
        //     setPatrulleros(resPersonas.data);
        //     setSupervisores(resPersonas.data);
        //     setVehiculos(resVehiculos.data);
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
                zona_incidencia_id: initialValues.zona_incidencia_id || '',
                zona_incidencia: initialValues.zona_incidencia || {},
                tipo_apoyo_incidencia_id: initialValues.tipo_apoyo_incidencia_id || '',
                tipo_apoyo_incidencia: initialValues.tipo_apoyo_incidencia || {},
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
                                {/* descripcion_llamada */}
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