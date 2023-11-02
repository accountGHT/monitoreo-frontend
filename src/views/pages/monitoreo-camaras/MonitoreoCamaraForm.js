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

import { toast } from 'react-toastify';

// Get Data
import { getCamaras, getPersonas, getTiposIncidencia, getZonas, postCreate } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;
// ==============================|| FixedAssetMovementAdd Component ||============================== //
const MonitoreoCamaraForm = ({ open, handleClose, refreshTable }) => {
  const theme = useTheme();
  // const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Fechas
  const locale = dayjs.locale('es');
  // Combos
  const [zonasList, setzonasList] = useState([]);
  const [tiposIncidencia, setTiposIncidencia] = useState([]);
  const [camaras, setCamaras] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const create = async (params) => {
    const respCreate = await postCreate(params);
    console.log(respCreate);
    toast.success(respCreate.message);
    formik.resetForm();
    refreshTable();
    handleClose();
  }

  const listZonas = async () => {
    const resZonas = await getZonas();
    const resTiposIncidencia = await getTiposIncidencia();
    const resCamaras = await getCamaras();
    const resPersonas = await getPersonas();
    const resVehiculos = await getVehiculosForAutocomplete();
    setzonasList(resZonas.data);
    setTiposIncidencia(resTiposIncidencia.data);
    setCamaras(resCamaras.data);
    setPersonas(resPersonas.data);
    setVehiculos(resVehiculos.data);
  }

  const validationSchema = Yup.object({
    fecha: Yup.object().nullable().required('Fecha es requerida'),
    zona_id: Yup.number('Zona no es válido').required('Zona es requerida'),
    tipo_incidencia_id: Yup.number('Tipo Incidencia no es válido').nullable(),
    operador_camaras_id: Yup.number('Operador no es válido').nullable(),
    personal_serenazgo_id: Yup.number('Activo Fijo no es válido').nullable(),
    vehiculo_serenazgo_id: Yup.number('Área no es válido').nullable(),
    encargado_id: Yup.number('Encargado no es válido').nullable(),
  });


  const formik = useFormik({
    initialValues: {
      fecha: dayjs(),
      hora_inicio: null, // inicializar el campo de hora con null
      hora_fin: null,
      turno: '',
      descripcion_incidencia: '',
      zona_id: '',
      zona: {},
      camara_id: '',
      camara: {},
      tipo_incidencia_id: '',
      tipo_incidencia: {},
      operador_camaras_id: '',
      operador_camaras: {},
      personal_serenazgo_id: '',
      personal_serenazgo: {},
      vehiculo_serenazgo_id: '',
      vehiculo_serenazgo: {},
      encargado_id: '',
      encargado: {},
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(`onSubmit`);
      console.log(values);
      const objParams = {
        fecha: values.fecha = values.fecha.format('YYYY-MM-DD'),
        hora_inicio: values.hora_inicio.format('HH:mm:ss'),
        hora_fin: values.hora_fin.format('HH:mm:ss'),
        turno: values.turno,
        descripcion_incidencia: values.descripcion_incidencia,
        zona_id: values.zona_id,
        camara_nombre: values.camara.nombre,
        operador_camaras_id: values.operador_camaras_id,
        tipo_incidencia_id: values.tipo_incidencia_id,
        personal_serenazgo_id: values.personal_serenazgo_id,
        vehiculo_serenazgo_id: values.vehiculo_serenazgo_id,
        encargado_id: values.encargado_id,
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

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                id="camara"
                name="camara"
                options={camaras}
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.camara).length > 0 ? formik.values.camara : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('camara', newValue ?? {});
                  formik.setFieldValue('camara_id', newValue === null ? '' : newValue.id);
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
                  option.nombres !== undefined ? `${option.nombres} ${option.p_apellido} ${option.s_apellido}` : ''
                }
                value={Object.entries(formik.values.operador_camaras).length > 0 ? formik.values.operador_camaras : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('operador_camaras', newValue === null ? {} : newValue);
                  formik.setFieldValue('operador_camaras_id', newValue === null ? null : newValue.id);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operador cámaras"
                    error={formik.touched.operador_camaras_id && Boolean(formik.errors.operador_camaras_id)}
                    helperText={formik.touched.operador_camaras_id && formik.errors.operador_camaras_id}
                    variant="standard"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                id="tipo_incidencia"
                name="tipo_incidencia"
                options={tiposIncidencia}
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.tipo_incidencia).length > 0 ? formik.values.tipo_incidencia : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tipo_incidencia', newValue ?? {});
                  formik.setFieldValue('tipo_incidencia_id', newValue === null ? '' : newValue.id);
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
                options={personas}
                getOptionLabel={(option) =>
                  option.nombres !== undefined ? `${option.nombres} ${option.p_apellido} ${option.s_apellido}` : ''
                }
                value={Object.entries(formik.values.personal_serenazgo).length > 0 ? formik.values.personal_serenazgo : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('personal_serenazgo', newValue === null ? {} : newValue);
                  formik.setFieldValue('personal_serenazgo_id', newValue === null ? null : newValue.id);
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
                getOptionLabel={(option) => (option.placa !== undefined ? option.placa : '')}
                value={Object.entries(formik.values.vehiculo_serenazgo).length > 0 ? formik.values.vehiculo_serenazgo : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('vehiculo_serenazgo', newValue ?? {});
                  formik.setFieldValue('vehiculo_serenazgo_id', newValue === null ? '' : newValue.id);
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
                  option.nombres !== undefined ? `${option.nombres} ${option.p_apellido} ${option.s_apellido}` : ''
                }
                value={Object.entries(formik.values.encargado).length > 0 ? formik.values.encargado : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('encargado', newValue === null ? {} : newValue);
                  formik.setFieldValue('encargado_id', newValue === null ? null : newValue.id);
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

export default MonitoreoCamaraForm;
