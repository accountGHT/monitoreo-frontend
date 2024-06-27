/*eslint-disable*/
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
import 'dayjs/locale/es';

// APIs
import {  getZonasForAutocomplete } from 'api/multi-table/multiTableApi';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const gridSpacing = 3;

const validationSchema = Yup.object({
  zona_id: Yup.number('Zona no es válido').required('Zona es requerida'),
  num_partes_ocurrencia: Yup.number('Num. de partes debe se numérico'),
  supervisor_id: Yup.number('Supervisor no es válido').nullable(),
});
// ==============================|| FixedAssetMovementAdd Component ||============================== //
const DistribucionPersonalForm = ({ selectedTurno, open, handleClose, onSubmit, initialValues }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Agrega un estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Fechas
  // Combos
  const [zonasList, setzonasList] = useState([]);
  const [supervisores, setSupervisores] = useState([]);

  const loadAutocompletes = async () => {
    const respZonas = await getZonasForAutocomplete();
    const resPersonas = await getPersonasForAutocomplete();
    setzonasList(respZonas.data);
    setSupervisores(resPersonas.data.filter((p) => p.tipo === 3));
  }

  const formik = useFormik({
    initialValues: {},
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        id: values.id || null,
        zona_id: values.zona_id,
        patrullaje_integrado: values.patrullaje_integrado,
        num_partes_ocurrencia: values.num_partes_ocurrencia,
        entrega_hoja_ruta: values.entrega_hoja_ruta,
        codigo_radio: values.codigo_radio,
        supervisor_id: values.supervisor_id,
        estado: values.estado,
        nombre_equipo: values.nombre_equipo,
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
        turno: initialValues.turno ?? selectedTurno,
        zona_id: initialValues.zona_id || '',
        zona: initialValues.zona || {},
        patrullaje_integrado: initialValues.patrullaje_integrado || 0,
        num_partes_ocurrencia: initialValues.num_partes_ocurrencia || '',
        entrega_hoja_ruta: initialValues.entrega_hoja_ruta || 0,
        codigo_radio: initialValues.codigo_radio || '',
        supervisor_id: initialValues.supervisor_id || '',
        supervisor: initialValues.supervisor || {},
        estado: initialValues.estado || 0,
        nombre_equipo: initialValues.nombre_equipo || '',
      });

      setLoading(false);
    }
    return () => {
      formik.resetForm();
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
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  id="nombre_equipo"
                  name="nombre_equipo"
                  label="Nombre del equipo"
                  fullWidth
                  variant="standard"
                  value={formik.values.nombre_equipo}
                  onChange={(event) => {
                    formik.handleChange(event);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nombre_equipo && Boolean(formik.errors.nombre_equipo)}
                  helperText={formik.touched.nombre_equipo && formik.errors.nombre_equipo}
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  id="patrullaje_integrado"
                  name="patrullaje_integrado"
                  label="¿Patrullaje integrado?"
                  labelPlacement="end"
                  control={
                    <Switch
                      color="primary"
                      checked={formik.values.patrullaje_integrado === 1}
                      onChange={(event) => {
                        formik.setFieldValue('patrullaje_integrado', event.target.checked ? 1 : 0);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={formik.values.estado === 1}
                      onChange={(event) => {
                        formik.setFieldValue('estado', event.target.checked ? 1 : 0);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Estado"
                  labelPlacement="end"
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
          // onClick={formik.submitForm}
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
