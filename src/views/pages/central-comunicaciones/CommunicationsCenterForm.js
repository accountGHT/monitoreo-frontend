/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// material-ui
import { searchPlaces, getPlaceInfo } from 'api/google-maps/googleMapsApi';
import loader from 'api/google-maps/googleMapsApi';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Paper,
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
    Select,
    Modal,
    Box
} from '@mui/material';
// assets
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// Formik
import { Form, useFormik } from 'formik';
import * as Yup from 'yup';
// Fechas
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from 'axios'; // para autocompletar dni
import { loadFromLocalStorage } from 'utils/localStorage';
// APIs
import { getTiposComunicacionForAutocomplete, getTiposIncidenciaForAutocomplete, getZonasForAutocomplete } from 'api/multi-table/multiTableApi';
const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const validationSchema = Yup.object({
    fecha: Yup.date().required('La fecha es obligatoria'),
    hora_llamada: Yup.date().required('La hora de llamada es obligatoria'),
});
const CommunicationsCenterForm = ({ open, handleClose, onSubmit, initialValues }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const userLocalStorage = loadFromLocalStorage('user');
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
    // integracion google maps
    const [predictions, setPredictions] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -4.5762, lng: -81.2712 });
    const [clickedLocation, setClickedLocation] = useState(null);
    const [openMapModal, setOpenMapModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [direccion, setDireccion] = useState('');
    let turnoInicial;

    useEffect(() => {
        loader.load().then(() => {
            setIsLoaded(true);
            setDireccion(initialValues.direccion_cc || '');
        }).catch(error => {
            console.error('Error al cargar Google Maps API:', error);
        });
    }, []);

    const handleOpenMapModal = () => {
        setOpenMapModal(true);
    };

    const handleCloseMapModal = () => {
        setOpenMapModal(false);
    };

    const handleMapClick = async (event) => {
        const { latLng } = event;
        const latitude = latLng.lat();
        const longitude = latLng.lng();

        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });

            if (response.results.length > 0) {
                const formattedAddress = response.results[0].formatted_address;
                setClickedLocation({ address: formattedAddress, lat: latitude, lng: longitude });
                setDireccion(formattedAddress); // Actualiza el estado local
                formik.setFieldValue('direccion', formattedAddress); // Actualiza formik
                console.log('Direccion actualizada', formattedAddress); // Confirmación de la actualización

                handleSelectPlace(response.results[0].place_id);

                handleCloseMapModal();
            } else {
                console.log('No se encontraron resultados');
            }
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
        }
    };

    useEffect(() => {
        formik.setFieldValue('direccion', direccion);
    }, [direccion]);

    // campos para nombres
    const [nombres, setNombres] = useState('');
    const loadAutocompletes = async () => {
        const resTiposComunicacion = await getTiposComunicacionForAutocomplete();
        const respZonas = await getZonasForAutocomplete();
        const resTiposIncidencia = await getTiposIncidenciaForAutocomplete();
        setTiposComunicacion(resTiposComunicacion.data);
        setZonasIncidencia(respZonas.data);
        setTiposIncidencia(resTiposIncidencia.data);
    }

    const isOptionEqualToValue = (option, value) => {
        return option && value && option.id === value.id;
    };

    // integracion google maps

    const handleAddressSearch = async (value) => {
        if (value) {
            try {
                const results = await searchPlaces(value);
                if (Array.isArray(results)) {
                    setPredictions(results);
                } else {
                    setPredictions([]);
                }
            } catch (error) {
                console.error('Error al buscar direcciones:', error);
                setPredictions([]);
            }
        } else {
            setPredictions([]);
        }
    };

    const handleSelectPlace = async (placeId) => {
        if (!placeId) {
            formik.setFieldValue('zona_incidencia', null);
            formik.setFieldValue('zona_incidencia_id', null);
            return;
        }
        const placeInfo = await getPlaceInfo(placeId);
        console.log('Place Info:', placeInfo);
        setSelectedPlace(placeInfo);
        const lat = placeInfo.geometry.location.lat();
        const lng = placeInfo.geometry.location.lng();
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        // Supongamos que zonasIncidencia está definida en algún lugar de tu código
        const selectedZone = zonasIncidencia.find((zone) => {
            const isInside = isInsideZone({ lat, lng }, zone);
            console.log(`Evaluando zona: ${JSON.stringify(zone)}, ¿Está dentro? ${isInside}`);
            return isInside;
        });

        if (selectedZone) {
            console.log('Las coordenadas se encuentran dentro de la zona:', selectedZone);
            formik.setFieldValue('zona_incidencia', selectedZone);
            formik.setFieldValue('zona_incidencia_id', selectedZone.id);
        } else {
            console.log('Las coordenadas no se encuentran dentro de ninguna zona.');
            formik.setFieldValue('zona_incidencia', null);
            formik.setFieldValue('zona_incidencia_id', null);
        }
    };
    const isInsideZone = (coordinates, zone) => {
        const { lat, lng } = coordinates;
        const { latitud1, latitud2, longitud1, longitud2 } = zone;
        console.log(`Verificando si las coordenadas (${lat}, ${lng}) están dentro de la zona:`);
        console.log(`Latitud debe estar entre ${latitud1} y ${latitud2}`);
        console.log(`Longitud debe estar entre ${longitud1} y ${longitud2}`);
        const isInside = (
            lat >= latitud1 && lat <= latitud2 &&
            lng >= longitud1 && lng <= longitud2
        );
        console.log(`¿Está dentro de la zona? ${isInside}`);
        return isInside;
    };
    // fin integracion google maps
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
                direccion_cc: direccion,
                zona_incidencia_id: values.zona_incidencia_id,
                operador_id: userLocalStorage.operador_id,
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

    const determinarTurno = (hora) => {
        const horas = hora.hour();
        if (horas >= 7 && horas < 12) return 'DÍA';
        if (horas >= 12 && horas < 19) return 'TARDE';
        return 'NOCHE';
    };

    useEffect(() => {
        if (open) {
            loadAutocompletes();
            let horaInicial;
            turnoInicial;
            if (initialValues.hora_llamada) {
                horaInicial = dayjs(initialValues.hora_llamada, 'HH:mm:ss');
            } else {
                horaInicial = dayjs();
            }
            turnoInicial = determinarTurno(horaInicial);

            formik.setValues({
                id: initialValues.id || null,
                fecha: initialValues.fecha || dayjs(),
                hora_llamada: initialValues.hora_llamada ? dayjs(initialValues.hora_llamada, 'HH:mm:ss').toDate() : dayjs(),
                tipo_comunicacion_id: initialValues.tipo_comunicacion_id || '',
                tipo_comunicacion: initialValues.tipo_comunicacion || {},
                turno: initialValues.turno ?? turnoInicial,
                descripcion_llamada: initialValues.descripcion_llamada || '',
                direccion_cc: initialValues.direccion_cc || '',
                zona_incidencia_id: initialValues.zona_incidencia_id || '',
                zona_incidencia: initialValues.zona_incidencia || {},
                //operador_id: initialValues.operador_id || '',
                //operador: initialValues.operador || {},
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
            if (formik.values.dni && formik.values.dni.length === 8) {
                try {
                    const response = await axios.get(`https://api-test.altoqueparking.com/api/consultar-dni-ruc/${formik.values.dni}`);
                    const { nombre } = response.data;
                    setNombres(nombre);
                    console.log('Zonas incidencia: ', zonasIncidencia);
                } catch (error) {
                    console.error(error);
                    setNombres('Indeterminado');
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

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Hora"
                                        value={formik.values.hora_llamada || null}
                                        onChange={(newValue) => {
                                            formik.setFieldValue('hora_llamada', newValue);
                                            const nuevoTurno = determinarTurno(newValue);
                                            formik.setFieldValue('turno', nuevoTurno);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={formik.touched.hora_llamada && Boolean(formik.errors.hora_llamada)}
                                                helperText={formik.touched.hora_llamada && formik.errors.hora_llamada}
                                                variant="standard"
                                            />
                                        )}
                                        ampm={true} // Activamos la opción AM/PM
                                        minutesStep={1}
                                    />
                                </LocalizationProvider>

                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>

                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="turno-select-label">Turno</InputLabel>
                                    <Select
                                        labelId="turno-select-label"
                                        id="turno-select"
                                        value={formik.values.turno || 'TARDE'}
                                        label="Turno"
                                        disabled={true}
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
                                    isOptionEqualToValue={isOptionEqualToValue}
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
                                <Box display="flex" alignItems="center">
                                    <Box flexGrow={1} mr={1}>
                                        <Autocomplete
                                            freeSolo
                                            options={predictions}
                                            getOptionLabel={(option) => option.description || ''}
                                            value={{ description: direccion }} // Set value as an object with description
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Dirección"
                                                    variant="standard"
                                                    value={direccion} // Usa el estado `direccion`
                                                    onChange={(event) => {
                                                        setDireccion(event.target.value);
                                                        formik.setFieldValue('direccion', event.target.value);
                                                        handleAddressSearch(event.target.value);
                                                    }}
                                                />
                                            )}
                                            onInputChange={(event, value) => handleAddressSearch(value)}
                                            onChange={(event, value) => {
                                                if (value && value.place_id) {
                                                    handleSelectPlace(value.place_id);
                                                }
                                            }}
                                        />

                                    </Box>
                                    <IconButton onClick={handleOpenMapModal} aria-label="Abrir mapa">
                                        <LocationOnIcon />
                                    </IconButton>
                                </Box>

                            </Grid>

                            {isLoaded && (
                                <Modal
                                    open={openMapModal}
                                    onClose={handleCloseMapModal}
                                    aria-labelledby="modal-map-title"
                                    aria-describedby="modal-map-description"
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                        }}
                                    >
                                        <GoogleMap
                                            zoom={15}
                                            center={mapCenter}
                                            mapContainerStyle={{ height: '400px', width: '600px' }}
                                            onClick={handleMapClick}
                                        >
                                            {selectedPlace && (
                                                <Marker
                                                    position={{
                                                        lat: selectedPlace.geometry.location.lat(),
                                                        lng: selectedPlace.geometry.location.lng(),
                                                    }}
                                                />
                                            )}
                                        </GoogleMap>
                                    </Box>
                                </Modal>
                            )}


                            <Grid item xs={12} sm={6} md={6}>
                                <Autocomplete
                                    disablePortal
                                    id="zona_incidencia"
                                    name="zona_incidencia"
                                    options={zonasIncidencia}
                                    getOptionLabel={(option) => option.nombre || 'Sin zona'}
                                    value={
                                        selectedPlace &&
                                        zonasIncidencia.find((p) => p.id === formik.values.zona_incidencia_id)
                                    }
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('zona_incidencia', newValue || {});
                                        formik.setFieldValue('zona_incidencia_id', newValue ? newValue.id : null);
                                    }}
                                    isOptionEqualToValue={isOptionEqualToValue}
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
                                    isOptionEqualToValue={isOptionEqualToValue}
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

                            <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', marginLeft: '50px' }}>
                                <Typography variant="h6" gutterBottom align="center">
                                    Persona que realizó la llamada
                                </Typography>
                                <Grid container spacing={2} justifyContent="center">
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
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
                                            helperText={formik.touched.edad && formik.errors.edad}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
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
                                    <Grid item xs={12} sm={6} md={3}>
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
                                </Grid>
                            </Paper>
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