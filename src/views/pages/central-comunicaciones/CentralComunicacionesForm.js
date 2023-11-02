
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
import { getPersonas, getTiposComunicacion, getTiposIncidencia, getZonas, postCreateCentralComunicacion } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;
// ==============================|| FixedAssetMovementAdd Component ||============================== //
const CentralComunicacionesForm = ({ open, handleClose, refreshTable }) => {
  const theme = useTheme();
  // const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Fechas
  const locale = dayjs.locale('es');
  // Combos
  const [zonasList, setzonasList] = useState([]);
  const [tiposComunicacion, setTiposComunicacion] = useState([]);
  const [tiposIncidencia, setTiposIncidencia] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const create = async (params) => {
    const respCreate = await postCreateCentralComunicacion(params);
    console.log(respCreate);
    toast.success(respCreate.message);
    formik.resetForm();
    refreshTable();
    handleClose();
  }

  const listZonas = async () => {
    const resZonas = await getZonas();
    const resTiposComunicacion = await getTiposComunicacion();
    const resTiposIncidencia = await getTiposIncidencia();
    const resPersonas = await getPersonas();
    const resVehiculos = await getVehiculosForAutocomplete();
    setzonasList(resZonas.data);
    setTiposComunicacion(resTiposComunicacion.data);
    setTiposIncidencia(resTiposIncidencia.data);
    setPersonas(resPersonas.data);
    setVehiculos(resVehiculos.data);
  }

  const validationSchema = Yup.object({
    fecha: Yup.object().nullable().required('Fecha es requerida'),
    zona_incidencia_id: Yup.number('Zona no es válido').required('Zona es requerida'),
    tipo_apoyo_incidencia_id: Yup.number('Tipo Incidencia no es válido').nullable(),
    operador_id: Yup.number('Operador no es válido').nullable(),
    personal_serenazgo_id: Yup.number('Activo Fijo no es válido').nullable(),
    vehiculo_id: Yup.number('Área no es válido').nullable(),
    supervisor_id: Yup.number('Supervisor no es válido').nullable(),
  });


  const formik = useFormik({
    initialValues: {
      fecha: dayjs(),
      hora_llamada: null,
      tipo_comunicacion_id: '',
      tipo_comunicacion: {},
      turno: '',
      descripcion_llamada: '',
      zona_incidencia_id: '',
      zona: {},
      tipo_apoyo_incidencia_id: '',
      tipo_apoyo_incidencia: {},
      operador_id: '',
      operador: {},
      personal_serenazgo_id: '',
      personal_serenazgo: {},
      vehiculo_id: '',
      vehiculo: {},
      supervisor_id: '',
      supervisor: {},
      detalle_atencion: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(`onSubmit`);
      console.log(values);
      const objParams = {
        fecha: values.fecha = values.fecha.format('YYYY-MM-DD'),
        hora_llamada: values.hora_llamada.format('HH:mm:ss'),
        tipo_comunicacion_id: values.tipo_comunicacion_id,
        turno: values.turno,
        descripcion_llamada: values.descripcion_llamada,
        zona_incidencia_id: values.zona_incidencia_id,
        operador_id: values.operador_id,
        tipo_apoyo_incidencia_id: values.tipo_apoyo_incidencia_id,
        personal_serenazgo_id: values.personal_serenazgo_id,
        vehiculo_id: values.vehiculo_id,
        supervisor_id: values.supervisor_id,
        detalle_atencion: values.detalle_atencion,
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
                  label="Hora de la Llamada"
                  value={formik.values.hora_llamada}
                  onChange={(newValue) => {
                    formik.setFieldValue('hora_llamada', newValue);
                  }}
                  renderInput={(params) => <TextField {...params} variant="standard" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                id="tipo_comunicacion"
                name="tipo_comunicacion"
                options={tiposComunicacion}
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.tipo_comunicacion).length > 0 ? formik.values.tipo_comunicacion : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tipo_comunicacion', newValue ?? {});
                  formik.setFieldValue('tipo_comunicacion_id', newValue === null ? '' : newValue.id);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de comunicación"
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
                  formik.setFieldValue('zona_incidencia_id', newValue === null ? '' : newValue.id);
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
                options={personas}
                getOptionLabel={(option) =>
                  option.nombres !== undefined ? `${option.nombres} ${option.p_apellido} ${option.s_apellido}` : ''
                }
                value={Object.entries(formik.values.operador).length > 0 ? formik.values.operador : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('operador', newValue === null ? {} : newValue);
                  formik.setFieldValue('operador_id', newValue === null ? null : newValue.id);
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

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                id="tipo_apoyo_incidencia"
                name="tipo_apoyo_incidencia"
                options={tiposIncidencia}
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.tipo_apoyo_incidencia).length > 0 ? formik.values.tipo_apoyo_incidencia : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tipo_apoyo_incidencia', newValue ?? {});
                  formik.setFieldValue('tipo_apoyo_incidencia_id', newValue === null ? '' : newValue.id);
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

export default CentralComunicacionesForm;
