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
  Select,
  FormControlLabel,
  Switch,
  InputAdornment
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

// import { toast } from 'react-toastify';

// APIs
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';
import { getTiposPatrullajeForAutocomplete, getZonasForAutocomplete } from 'api/multi-table/multiTableApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const validationSchema = Yup.object({
  fecha: Yup.date().required('La fecha es obligatoria'),
  hora: Yup.date().required('La hora es obligatoria'),
  zona_id: Yup.number('Zona no es válido').required('Zona es requerida'),
  patrullero_id: Yup.number('Activo Fijo no es válido').nullable(),
  vehiculo_id: Yup.number('Área no es válido').nullable(),
  num_partes_ocurrencia: Yup.number('Num. de partes debe se numérico'),
  supervisor_id: Yup.number('Supervisor no es válido').nullable(),
});
// ==============================|| FixedAssetMovementAdd Component ||============================== //
const DistribucionPersonalForm = ({ open, handleClose, onSubmit, initialValues }) => {
  console.log(`initialValues`, initialValues);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Agrega un estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  // Fechas
  const locale = dayjs.locale('es');

  // Combos
  const [zonasList, setzonasList] = useState([]);
  const [tiposPatrullaje, setTiposPatrullaje] = useState([]);
  const [patrulleros, setPatrulleros] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const loadAutocompletes = async () => {
    const respZonas = await getZonasForAutocomplete();
    const resTiposPatrullaje = await getTiposPatrullajeForAutocomplete();
    const resPersonas = await getPersonasForAutocomplete();
    const resVehiculos = await getVehiculosForAutocomplete();
    setzonasList(respZonas.data);
    setTiposPatrullaje(resTiposPatrullaje.data);
    setPatrulleros(resPersonas.data);
    setSupervisores(resPersonas.data);
    setVehiculos(resVehiculos.data);
  }

  const formik = useFormik({
    initialValues: {},
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      const payload = {
        id: values.id || null,
        fecha: dayjs(values.fecha).format('YYYY-MM-DD'),
        hora: dayjs(values.hora).format('HH:mm:ss'),
        turno: values.turno,
        patrullero_id: values.patrullero_id,
        vehiculo_id: values.vehiculo_id,
        zona_id: values.zona_id,
        patrullaje_integrado: values.patrullaje_integrado,
        ubicacion_persona: values.ubicacion_persona,
        tipo_patrullaje_id: values.tipo_patrullaje_id,
        num_partes_ocurrencia: values.num_partes_ocurrencia,
        entrega_hoja_ruta: values.entrega_hoja_ruta,
        codigo_radio: values.codigo_radio,
        supervisor_id: values.supervisor_id,
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
        hora: initialValues.hora ? dayjs(initialValues.hora, 'HH:mm:ss').toDate() : dayjs(),
        turno: initialValues.turno || '',
        patrullero_id: initialValues.patrullero_id || '',
        patrullero: initialValues.patrullero || {},
        vehiculo_id: initialValues.vehiculo_id || '',
        vehiculo: initialValues.vehiculo || {},
        zona_id: initialValues.zona_id || '',
        zona: initialValues.zona || {},
        patrullaje_integrado: initialValues.patrullaje_integrado || 0,
        ubicacion_persona: initialValues.ubicacion_persona || '',
        tipo_patrullaje_id: initialValues.tipo_patrullaje_id || '',
        tipo_patrullaje: initialValues.tipo_patrullaje || {},
        num_partes_ocurrencia: initialValues.num_partes_ocurrencia || '',
        entrega_hoja_ruta: initialValues.entrega_hoja_ruta || 0,
        supervisor_id: initialValues.supervisor_id || '',
        supervisor: initialValues.supervisor || {},
        codigo_radio: initialValues.codigo_radio || '',
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
                {Object.entries(initialValues).length > 0 ? 'ACTUALIZAR REGISTRO' : 'NUEVO REGISTRO'}
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
                      value={formik.values.hora}
                      onChange={(newValue) => {
                        formik.setFieldValue('hora', newValue);
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
                      value={formik.values.turno}
                      label="Turno"
                      onChange={(event) => {
                        formik.setFieldValue('turno', event.target.value ?? '');
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
                    id="patrullero"
                    name="patrullero"
                    options={patrulleros}
                    getOptionLabel={(option) =>
                      option.nombres !== undefined ? `${option.nombre_completo}` : ''
                    }
                    value={patrulleros.find((p) => p.id === formik.values.patrullero_id) || null}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('patrullero', newValue || {});
                      formik.setFieldValue('patrullero_id', newValue ? newValue.id : null);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sereno"
                        error={formik.touched.patrullero_id && Boolean(formik.errors.patrullero_id)}
                        helperText={formik.touched.patrullero_id && formik.errors.patrullero_id}
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

                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    disablePortal
                    id="zona"
                    name="zona"
                    options={zonasList}
                    getOptionLabel={(option) =>
                      option.nombre !== undefined ? `${option.nombre}` : ''
                    }
                    value={zonasList.find((p) => p.id === formik.values.zona_id) || null}
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

                <Grid item xs={12} sm={6} md={6}>
                  <FormControlLabel
                    id="patrullaje_integrado"
                    name="patrullaje_integrado"
                    label="¿Patrullaje integrado?"
                    labelPlacement="end"
                    value={formik.values.patrullaje_integrado}
                    onChange={formik.handleChange}
                    control={
                      <Switch
                        color="primary"
                        checked={formik.values.patrullaje_integrado === 1}
                        value={formik.values.patrullaje_integrado}
                        onChange={(event) => {
                          formik.setFieldValue('patrullaje_integrado', event.target.checked ? 1 : 0);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    autoComplete="family-name"
                    variant="standard"
                  />
                </Grid>

                <Grid item xs={12} sm={9} md={9}>
                  <TextField
                    id="ubicacion_persona"
                    label="Ubicación actual del personal durante el servicio"
                    multiline
                    maxRows={4}
                    fullWidth
                    value={formik.values.ubicacion_persona}
                    onChange={(event) => {
                      formik.handleChange(event);
                    }}
                    onBlur={formik.handleBlur}
                    variant="standard"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    disablePortal
                    id="tipo_patrullaje"
                    name="tipo_patrullaje"
                    options={tiposPatrullaje}
                    getOptionLabel={(option) =>
                      option.nombre !== undefined ? `${option.nombre}` : ''
                    }
                    value={tiposPatrullaje.find((p) => p.id === formik.values.tipo_patrullaje_id) || null}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('tipo_patrullaje', newValue || {});
                      formik.setFieldValue('tipo_patrullaje_id', newValue ? newValue.id : null);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de patrullaje"
                        error={formik.touched.tipo_patrullaje_id && Boolean(formik.errors.tipo_patrullaje_id)}
                        helperText={formik.touched.tipo_patrullaje_id && formik.errors.tipo_patrullaje_id}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={3} md={3}>
                  <TextField
                    id="num_partes_ocurrencia"
                    name="num_partes_ocurrencia"
                    label="Partes de ocurrencias"
                    type="number"
                    value={formik.values.num_partes_ocurrencia > 0 ? formik.values.num_partes_ocurrencia : ''}
                    onChange={formik.handleChange}
                    error={formik.touched.num_partes_ocurrencia && Boolean(formik.errors.num_partes_ocurrencia)}
                    helperText={formik.touched.num_partes_ocurrencia && formik.errors.num_partes_ocurrencia}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Cantidad</InputAdornment>
                    }}
                    variant="standard"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormControlLabel
                    id="entrega_hoja_ruta"
                    name="entrega_hoja_ruta"
                    label="¿Se entrego Hoja de Ruta del patrullaje?"
                    labelPlacement="end"
                    value={formik.values.entrega_hoja_ruta}
                    onChange={formik.handleChange}
                    control={
                      <Switch
                        color="primary"
                        checked={formik.values.entrega_hoja_ruta === 1}
                        value={formik.values.entrega_hoja_ruta}
                        onChange={(event) => {
                          formik.setFieldValue('entrega_hoja_ruta', event.target.checked ? 1 : 0);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    autoComplete="family-name"
                    variant="standard"
                  />
                </Grid>

                <Grid item xs={12} sm={3} md={3}>
                  <TextField
                    id="codigo_radio"
                    label="Código de radio portátil"
                    fullWidth
                    variant="standard"
                    value={formik.values.codigo_radio}
                    onChange={(event) => {
                      formik.handleChange(event);
                    }}
                    onBlur={formik.handleBlur}
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

              </Grid>
              <Button id="btnSubmitForm" type="submit" sx={{ display: 'none' }}>
                submit
              </Button>
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
              // onClick={formik.submitForm}
              onClick={() => {
                document.getElementById('btnSubmitForm').click();
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default DistribucionPersonalForm;
