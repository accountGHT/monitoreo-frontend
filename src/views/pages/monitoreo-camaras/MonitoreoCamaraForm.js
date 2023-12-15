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
  Select
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

// APIs
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';
import { getCamarasForAutocomplete, getTiposIncidenciaForAutocomplete, getZonasForAutocomplete } from 'api/multi-table/multiTableApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const validationSchema = Yup.object({
  fecha: Yup.date().required('La fecha es obligatoria'),
  // hora: Yup.date().required('La hora es obligatoria'),
});

// const validationSchema = Yup.object({
//   fecha: Yup.object().nullable().required('Fecha es requerida'),
//   zona_id: Yup.number('Zona no es válido').required('Zona es requerida'),
//   tipo_incidencia_id: Yup.number('Tipo Incidencia no es válido').nullable(),
//   operador_camaras_id: Yup.number('Operador no es válido').nullable(),
//   personal_serenazgo_id: Yup.number('Activo Fijo no es válido').nullable(),
//   vehiculo_serenazgo_id: Yup.number('Área no es válido').nullable(),
//   encargado_id: Yup.number('Encargado no es válido').nullable(),
// });
// ==============================|| MonitoreoCamaraForm Component ||============================== //
const MonitoreoCamaraForm = ({ open, handleClose, onSubmit, initialValues }) => {
  console.log(`initialValues`, initialValues);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Agrega un estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  // Fechas
  const locale = dayjs.locale('es');

  // Combos
  const [zonas, setZonas] = useState([]);
  const [tiposIncidencia, setTiposIncidencia] = useState([]);
  const [camaras, setCamaras] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [personasSerenazgo, setPersonasSerenazgo] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const loadAutocompletes = async () => {
    const resZonas = await getZonasForAutocomplete();
    const resTiposIncidencia = await getTiposIncidenciaForAutocomplete();
    const resCamaras = await getCamarasForAutocomplete();
    const resPersonas = await getPersonasForAutocomplete();
    const resVehiculos = await getVehiculosForAutocomplete();
    setZonas(resZonas.data);
    setTiposIncidencia(resTiposIncidencia.data);
    console.log(resCamaras);
    console.log(resCamaras.data);
    setCamaras(resCamaras.data);
    setPersonas(resPersonas.data);
    setPersonasSerenazgo(resPersonas.data);
    setVehiculos(resVehiculos.data);
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
        hora_inicio: dayjs(values.hora_inicio).format('HH:mm:ss'),
        hora_fin: dayjs(values.hora_fin).format('HH:mm:ss'),
        turno: values.turno,
        descripcion_incidencia: values.descripcion_incidencia,
        zona_id: values.zona_id,
        camara_id: values.camara_id,
        operador_camaras_id: values.operador_camaras_id,
        tipo_incidencia_id: values.tipo_incidencia_id,
        personal_serenazgo_id: values.personal_serenazgo_id,
        vehiculo_serenazgo_id: values.vehiculo_serenazgo_id,
        encargado_id: values.encargado_id,
      }

      console.log(`payload`, payload);
      const resp = await onSubmit(payload, resetForm);
      console.log(`resp`, resp);
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
        hora_inicio: initialValues.hora_inicio ? dayjs(initialValues.hora_inicio, 'HH:mm:ss').toDate() : dayjs(),
        hora_fin: initialValues.hora_fin ? dayjs(initialValues.hora_fin, 'HH:mm:ss').toDate() : dayjs(),
        turno: initialValues.turno ?? 'TARDE',
        descripcion_incidencia: initialValues.descripcion_incidencia,
        zona_id: initialValues.zona_id || '',
        zona: initialValues.zona || {},
        camara_nombre: initialValues.camara_nombre,
        camara_id: initialValues.camara_id || '',
        camara: initialValues.camara || {},
        operador_camaras_id: initialValues.operador_camaras_id || '',
        operador_camaras: initialValues.operador_camaras || {},
        tipo_incidencia_id: initialValues.tipo_incidencia_id || '',
        tipo_incidencia: initialValues.tipo_incidencia || {},
        personal_serenazgo_id: initialValues.personal_serenazgo_id || '',
        personal_serenazgo: initialValues.personal_serenazgo || {},
        vehiculo_serenazgo_id: initialValues.vehiculo_serenazgo_id || '',
        vehiculo_serenazgo: initialValues.vehiculo_serenazgo || {},
        encargado_id: initialValues.encargado_id || '',
        encargado: initialValues.encargado || {},
      });
      setLoading(false);
      return () => {
        formik.resetForm();
      }

    }
  }, [open]);

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
                    label="Hora Inicio"
                    value={formik.values.hora_inicio}
                    onChange={(newValue) => {
                      formik.setFieldValue('hora_inicio', newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                  <TimePicker
                    label="Hora Fin"
                    value={formik.values.hora_fin}
                    onChange={(newValue) => {
                      formik.setFieldValue('hora_fin', newValue ?? '');
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="turno-select-label">Turno</InputLabel>
                  <Select
                    labelId="turno-select-label"
                    id="turno-select"
                    value={formik.values.turno || 'TARDE'}
                    label="Turno"
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

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id="descripcion_incidencia"
                  label="Descripción de la incidencia"
                  multiline
                  maxRows={4}
                  fullWidth
                  variant="standard"
                  value={formik.values.descripcion_incidencia}
                  onChange={(event) => {
                    formik.handleChange(event);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.descripcion_incidencia && Boolean(formik.errors.descripcion_incidencia)}
                  helperText={formik.touched.descripcion_incidencia && formik.errors.descripcion_incidencia}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  disablePortal
                  id="zona"
                  name="zona"
                  options={zonas}
                  getOptionLabel={(option) =>
                    option.nombre !== undefined ? `${option.nombre}` : ''
                  }
                  value={zonas.find((p) => p.id === formik.values.zona_id) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('zona', newValue || {});
                    formik.setFieldValue('zona_id', newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Zona"
                      error={formik.touched.zona_id && Boolean(formik.errors.zona_id)}
                      helperText={formik.touched.zona_id && formik.errors.zona_id}
                      variant="standard"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  disablePortal
                  id="camara"
                  name="camara"
                  options={camaras}
                  getOptionLabel={(option) =>
                    option.nombre !== undefined ? `${option.nombre}` : ''
                  }
                  value={camaras.find((p) => p.id === formik.values.camara_id) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('camara', newValue || {});
                    formik.setFieldValue('camara_id', newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cámara"
                      error={formik.touched.camara_id && Boolean(formik.errors.camara_id)}
                      helperText={formik.touched.camara_id && formik.errors.camara_id}
                      variant="standard"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  disablePortal
                  id="operador_camaras"
                  name="operador_camaras"
                  options={personas}
                  getOptionLabel={(option) =>
                    option.nombres !== undefined ? `${option.nombre_completo}` : ''
                  }
                  value={personas.find((p) => p.id === formik.values.operador_camaras_id) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('operador_camaras', newValue || {});
                    formik.setFieldValue('operador_camaras_id', newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supervisor"
                      error={formik.touched.operador_camaras_id && Boolean(formik.errors.operador_camaras_id)}
                      helperText={formik.touched.operador_camaras_id && formik.errors.operador_camaras_id}
                      variant="standard"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  disablePortal
                  id="tipo_incidencia"
                  name="tipo_incidencia"
                  options={tiposIncidencia}
                  getOptionLabel={(option) =>
                    option.nombre !== undefined ? `${option.nombre}` : ''
                  }
                  value={tiposIncidencia.find((p) => p.id === formik.values.tipo_incidencia_id) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('tipo_incidencia', newValue || {});
                    formik.setFieldValue('tipo_incidencia_id', newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo Incidencia"
                      error={formik.touched.tipo_incidencia_id && Boolean(formik.errors.tipo_incidencia_id)}
                      helperText={formik.touched.tipo_incidencia_id && formik.errors.tipo_incidencia_id}
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
                  id="vehiculo_serenazgo"
                  name="vehiculo_serenazgo"
                  options={vehiculos}
                  getOptionLabel={(option) =>
                    option.placa !== undefined ? `${option.placa}` : ''
                  }
                  value={vehiculos.find((p) => p.id === formik.values.vehiculo_serenazgo_id) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('vehiculo_serenazgo', newValue || {});
                    formik.setFieldValue('vehiculo_serenazgo_id', newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehículo"
                      error={formik.touched.vehiculo_serenazgo_id && Boolean(formik.errors.vehiculo_serenazgo_id)}
                      helperText={formik.touched.vehiculo_serenazgo_id && formik.errors.vehiculo_serenazgo_id}
                      variant="standard"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Autocomplete
                  disablePortal
                  id="encargado"
                  name="encargado"
                  options={personas}
                  getOptionLabel={(option) =>
                    option.nombres !== undefined ? `${option.nombre_completo}` : ''
                  }
                  value={personas.find((p) => p.id === formik.values.encargado_id) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('encargado', newValue || {});
                    formik.setFieldValue('encargado_id', newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Encargado"
                      error={formik.touched.encargado_id && Boolean(formik.errors.encargado_id)}
                      helperText={formik.touched.encargado_id && formik.errors.encargado_id}
                      variant="standard"
                    />
                  )}
                />
              </Grid>

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

export default MonitoreoCamaraForm;
