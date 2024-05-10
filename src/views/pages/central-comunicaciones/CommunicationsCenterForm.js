/* eslint-disable no-unused-vars */

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
    DialogContent,
    InputLabel,
    MenuItem,
    FormControl,
    FormHelperText,
    Select
} from '@mui/material';

// assets
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

// Formik
import { Form, useFormik } from 'formik';
import * as Yup from 'yup';

// Fechas
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from 'axios'; // para autocompletar dni

// APIs
import { getTiposComunicacionForAutocomplete, getTiposIncidenciaForAutocomplete, getZonasForAutocomplete } from 'api/multi-table/multiTableApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const validationSchema = Yup.object({
    fecha: Yup.date().required('La fecha es obligatoria'),
    hora_llamada: Yup.date().required('La hora de llamada es obligatoria'),
});

// const validationSchema = Yup.object({
//     fecha: Yup.object().nullable().required('Fecha es requerida'),
//     zona_incidencia_id: Yup.number('Zona no es válido').required('Zona es requerida'),
//     tipo_apoyo_incidencia_id: Yup.number('Tipo Incidencia no es válido').nullable(),
//     operador_id: Yup.number('Operador no es válido').nullable(),
//     personal_serenazgo_id: Yup.number('Activo Fijo no es válido').nullable(),
//     vehiculo_id: Yup.number('Área no es válido').nullable(),
//     supervisor_id: Yup.number('Supervisor no es válido').nullable(),
// });

// ==============================|| FixedAssetMovementAdd Component ||============================== //
const CommunicationsCenterForm = ({ open, handleClose, onSubmit, initialValues }) => {
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
    // campos para nombres
    const [nombres, setNombres] = useState('');
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
        //setPersonasSerenazgo(resPersonas.data);
        //setVehiculos(resVehiculos.data);
        //setSupervisores(resPersonas.data);
    }

    const convertToBoolean = (value) => {
        return value === 1 || value === '1' || value === true;
    };

    const formik = useFormik({
        initialValues: {},
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                id: values.id || null,
                fecha: dayjs(values.fecha).format('YYYY-MM-DD'),
                hora_llamada: dayjs(values.hora_llamada).format('HH:mm:ss'),
                tipo_comunicacion_id: values.tipo_comunicacion_id,
                turno: values.turno,
                descripcion_llamada: values.descripcion_llamada,
                zona_incidencia_id: values.zona_incidencia_id,
                operador_id: values.operador_id,
                tipo_apoyo_incidencia_id: values.tipo_apoyo_incidencia_id,
                //personal_serenazgo_id: values.personal_serenazgo_id,
                //vehiculo_id: values.vehiculo_id,
                //supervisor_id: values.supervisor_id,
                //detalle_atencion: values.detalle_atencion,
                tipo_delito: values.tipo_delito,
                es_duplicado: values.es_duplicado,
                es_victima_mujer: values.es_victima_mujer,
                //campos opcionales:
                dni: values.dni,
                nombres: nombres,
                edad: values.edad,
                sexo: values.sexo,
                telefono: values.telefono,
            }
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
                hora_llamada: initialValues.hora_llamada ? dayjs(initialValues.hora_llamada, 'HH:mm:ss').toDate() : dayjs(),
                tipo_comunicacion_id: initialValues.tipo_comunicacion_id || '',
                tipo_comunicacion: initialValues.tipo_comunicacion || {},
                turno: initialValues.turno ?? 'TARDE',
                descripcion_llamada: initialValues.descripcion_llamada || '',
                zona_incidencia_id: initialValues.zona_incidencia_id || '',
                zona_incidencia: initialValues.zona_incidencia || {},
                operador_id: initialValues.operador_id || '',
                operador: initialValues.operador || {},
                tipo_apoyo_incidencia_id: initialValues.tipo_apoyo_incidencia_id || '',
                tipo_apoyo_incidencia: initialValues.tipo_apoyo_incidencia || {},
                //personal_serenazgo_id: initialValues.personal_serenazgo_id || '',
                //personal_serenazgo: initialValues.personal_serenazgo || {},
                //vehiculo_id: initialValues.vehiculo_id || '',
                //vehiculo: initialValues.vehiculo || {},
                //supervisor_id: initialValues.supervisor_id || '',
                //supervisor: initialValues.supervisor || {},
                //detalle_atencion: initialValues.detalle_atencion || '',
                tipo_delito: initialValues.tipo_delito ?? '',
                es_duplicado: convertToBoolean(initialValues.es_duplicado),
                es_victima_mujer: convertToBoolean(initialValues.es_victima_mujer),
                //campos opcionales:
                dni: initialValues.dni || '',
                nombres: initialValues.nombres || '',
                edad: initialValues.edad || '',
                sexo: initialValues.sexo ?? '',
                telefono: initialValues.telefono || '',
            });

            setLoading(false);
        }
        return () => {
            formik.resetForm();
        }
    }, [open]);

    useEffect(() => {
        const fetchNombre = async () => {
            if (formik.values.dni.length === 8) {
                try {
                    const response = await axios.get(`https://api-test.altoqueparking.com/api/consultar-dni-ruc/${formik.values.dni}`);
                    const { nombre } = response.data;
                    setNombres(nombre);
                } catch (error) {
                    console.error(error);
                    setNombres('Indeterminado')
                }
            } else {
                setNombres('');
            }
        };

        fetchNombre();
    }, [formik.values.dni]);

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
                        {Object.entries(initialValues).length > 0 ? 'ACTUALIZAR REGISTRO' : 'NUEVO REGISTRO'}
                    </Typography>


                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                {loading ? (<p>Cargando...</p>) : (
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

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="turno-select-label">Turno</InputLabel>
                                    <Select
                                        labelId="turno-select-label"
                                        id="turno-select"
                                        value={formik.values.turno || 'TARDE'}
                                        label="Turno"
                                        // error={formik.touched.turno && Boolean(formik.errors.turno)}
                                        // helperText={formik.touched.turno && formik.errors.turno}
                                        onChange={(event) => {
                                            const selectedValue = event.target.value ?? '';
                                            const isValidValue = ['DÍA', 'TARDE', 'NOCHE'].includes(selectedValue);

                                            if (isValidValue) {
                                                formik.setFieldValue('turno', selectedValue);
                                            }
                                        }}
                                    >
                                        <MenuItem value={"DÍA"}>DÍA</MenuItem>
                                        <MenuItem value={"TARDE"}>TARDE</MenuItem>
                                        <MenuItem value={"NOCHE"}>NOCHE</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={9}>
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
                                    error={formik.touched.descripcion_llamada && Boolean(formik.errors.descripcion_llamada)}
                                    helperText={formik.touched.descripcion_llamada && formik.errors.descripcion_llamada}
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
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="tipo_delito-select-label">Tipo delito</InputLabel>
                                    <Select
                                        labelId="tipo_delito-select-label"
                                        id="tipo_delito-select"
                                        value={formik.values.tipo_delito || ''}
                                        label="Tipo delito"
                                        onChange={(event) => {
                                            const selectedValue = event.target.value ?? '';
                                            formik.setFieldValue('tipo_delito', selectedValue);
                                        }}
                                    >
                                        <MenuItem value={"leve"}>Leve</MenuItem>
                                        <MenuItem value={"moderado"}>Moderado</MenuItem>
                                        <MenuItem value={"grave"}>Grave</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="es_duplicado-select-label">Es duplicado</InputLabel>
                                    <Select
                                        labelId="es_duplicado-select-label"
                                        id="es_duplicado-select"
                                        value={formik.values.es_duplicado || false}
                                        label="Es duplicado"
                                        onChange={(event) => {
                                            const selectedValue = event.target.value ?? false;
                                            formik.setFieldValue('es_duplicado', selectedValue);
                                        }}
                                    >
                                        <MenuItem value={true}>Sí</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="es_victima_mujer-select-label">Es víctima mujer</InputLabel>
                                    <Select
                                        labelId="es_victima_mujer-select-label"
                                        id="es_victima_mujer-select"
                                        value={formik.values.es_victima_mujer || false}
                                        label="Es víctima mujer"
                                        onChange={(event) => {
                                            const selectedValue = event.target.value ?? false;
                                            formik.setFieldValue('es_victima_mujer', selectedValue);
                                        }}
                                    >
                                        <MenuItem value={true}>Sí</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        id="dni"
                                        label="DNI (Opcional)"
                                        fullWidth
                                        variant="standard"
                                        value={formik.values.dni}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dni && Boolean(formik.errors.dni)}
                                        helperText={formik.touched.dni && formik.errors.dni}
                                        size='small'
                                        style={{ marginLeft: "25px" }}
                                        inputProps={{ maxLength: 8 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        id="nombres"
                                        label="Nombres (Opcional)"
                                        fullWidth
                                        variant="standard"
                                        value={nombres}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        id="edad"
                                        label="Edad (Opcional)"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        value={formik.values.edad}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.edad && Boolean(formik.errors.edad)}
                                        helperText={formik.touched.edad && formik.errors.edad}
                                        style={{ width: "100%" }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="sexo-label">Sexo (Opcional)</InputLabel>
                                        <Select
                                            labelId="sexo-label"
                                            id="sexo"
                                            value={formik.values.sexo || ''}
                                            onChange={(event) => {
                                                const selectedValue = event.target.value;
                                                formik.setFieldValue('sexo', selectedValue);
                                            }}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.sexo && Boolean(formik.errors.sexo)}
                                        >
                                            <MenuItem value="">Seleccione una opción</MenuItem>
                                            <MenuItem value="M">Masculino</MenuItem>
                                            <MenuItem value="F">Femenino</MenuItem>
                                            <MenuItem value="O">Otro</MenuItem>
                                        </Select>
                                        {formik.touched.sexo && formik.errors.sexo && (
                                            <FormHelperText error>{formik.errors.sexo}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    id="telefono"
                                    label="Teléfono (Opcional)"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.telefono}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                                    helperText={formik.touched.telefono && formik.errors.telefono}
                                />
                            </Grid>

                            {
                                /*
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
                                */
                            }
                            {
                                /*
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
                                */
                            }
                            {
                                /*
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
                            */
                            }

                            {
                                /*
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
                                    error={formik.touched.detalle_atencion && Boolean(formik.errors.detalle_atencion)}
                                    helperText={formik.touched.detalle_atencion && formik.errors.detalle_atencion}
                                />
                            </Grid>
                            */
                            }

                        </Grid>
                    </form>
                )}
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
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationsCenterForm;