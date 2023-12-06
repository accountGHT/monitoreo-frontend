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

import { toast } from 'react-toastify';

// Get Data
import { getPersonas, getTiposPatrullaje, getZonas, postCreateDistribucionPersonal } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;
// ==============================|| FixedAssetMovementAdd Component ||============================== //
const DistribucionPersonalForm = ({ open, handleClose, refreshTable }) => {
  const theme = useTheme();
  // const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Fechas
  const locale = dayjs.locale('es');
  // Combos
  const [zonasList, setzonasList] = useState([]);
  const [tiposPatrullaje, setTiposPatrullaje] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  // const create = async (params) => {
  //   const respCreate = await postCreateDistribucionPersonal(params);
  //   console.log(respCreate);
  //   toast.success(respCreate.message);
  //   formik.resetForm();
  //   refreshTable();
  //   handleClose();
  // }

  const listZonas = async () => {
    const resZonas = await getZonas();
    const resTiposPatrullaje = await getTiposPatrullaje();
    const resPersonas = await getPersonas();
    const resVehiculos = await getVehiculosForAutocomplete();
    setzonasList(resZonas.data);
    setTiposPatrullaje(resTiposPatrullaje.data);
    setPersonas(resPersonas.data);
    setVehiculos(resVehiculos.data);
  }

  const validationSchema = Yup.object({
    fecha: Yup.object().nullable().required('Fecha es requerida'),
    zona_id: Yup.number('Zona no es válido').required('Zona es requerida'),
    patrullero_id: Yup.number('Activo Fijo no es válido').nullable(),
    vehiculo_id: Yup.number('Área no es válido').nullable(),
    num_partes_ocurrencia: Yup.number('Num. de partes debe se numérico'),
    supervisor_id: Yup.number('Supervisor no es válido').nullable(),
  });


  const formik = useFormik({
    initialValues: {
      fecha: dayjs(),
      hora: null,
      turno: '',
      patrullero_id: '',
      patrullero: {},
      vehiculo_id: '',
      vehiculo: {},
      zona_id: '',
      zona: {},
      patrullaje_integrado: 0,
      ubicacion_persona: '',
      tipo_patrullaje_id: '',
      tipo_patrullaje: {},
      num_partes_ocurrencia: '',
      entrega_hoja_ruta: 0,
      supervisor_id: '',
      supervisor: {},
      codigo_radio: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(`onSubmit`);
      console.log(values);
      const objParams = {
        fecha: values.fecha = values.fecha.format('YYYY-MM-DD'),
        hora: values.hora.format('HH:mm:ss'),
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

      console.log(objParams);
      create(objParams);
    }
  });

  useEffect(() => {
    listZonas();
    return () => {
      formik.resetForm();
      // setOpen(false);
    }
  }, []);

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
                options={personas}
                getOptionLabel={(option) =>
                  option.nombres !== undefined ? `${option.nombres} ${option.p_apellido} ${option.s_apellido}` : ''
                }
                value={Object.entries(formik.values.patrullero).length > 0 ? formik.values.patrullero : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('patrullero', newValue === null ? {} : newValue);
                  formik.setFieldValue('patrullero_id', newValue === null ? null : newValue.id);
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
                getOptionLabel={(option) => (option.placa !== undefined ? option.placa : '')}
                value={Object.entries(formik.values.vehiculo).length > 0 ? formik.values.vehiculo : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('vehiculo', newValue ?? {});
                  formik.setFieldValue('vehiculo_id', newValue === null ? '' : newValue.id);
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
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.zona).length > 0 ? formik.values.zona : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('zona', newValue ?? {});
                  formik.setFieldValue('zona_id', newValue === null ? '' : newValue.id);
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
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.tipo_patrullaje).length > 0 ? formik.values.tipo_patrullaje : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tipo_patrullaje', newValue ?? {});
                  formik.setFieldValue('tipo_patrullaje_id', newValue === null ? '' : newValue.id);
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
                options={personas}
                getOptionLabel={(option) =>
                  option.nombres !== undefined ? `${option.nombres} ${option.p_apellido} ${option.s_apellido}` : ''
                }
                value={Object.entries(formik.values.supervisor).length > 0 ? formik.values.supervisor : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('supervisor', newValue === null ? {} : newValue);
                  formik.setFieldValue('supervisor_id', newValue === null ? null : newValue.id);
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
          onClick={() => {
            document.getElementById('btnSubmitForm').click();
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DistribucionPersonalForm;
