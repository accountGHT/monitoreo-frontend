import React, { useEffect, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Slide,
  TextField,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

// assets
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Fechas
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = Yup.object().shape({
  // nombres: Yup.string().required('Campo requerido'),
  p_apellido: Yup.string(),
  s_apellido: Yup.string(),
  // dni: Yup.string().required('Campo requerido'),
  correo: Yup.string(),
  // fecha_nacimiento: Yup.string(),
  estado: Yup.boolean(),
});

const UsersForm = ({ open, handleClose, onSubmit, initialValues }) => {
  console.log(`initialValues`, initialValues);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Agrega un estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  // Fechas
  const locale = dayjs.locale('es');

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      const payload = {
        id: values.id || null,
        nombres: values.nombres,
        p_apellido: values.p_apellido,
        s_apellido: values.s_apellido,
        dni: values.dni,
        correo: values.correo,
        fecha_nacimiento: dayjs(values.fecha_nacimiento).format('YYYY-MM-DD'),
        genero: values.genero,
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
    },
  });

  useEffect(() => {

    if (open) {
      formik.setValues({
        id: initialValues.id || null,
        nombres: initialValues.nombres || '',
        p_apellido: initialValues.p_apellido || '',
        s_apellido: initialValues.s_apellido || '',
        dni: initialValues.dni || '',
        placa: initialValues.placa || '',
        correo: initialValues.correo || '',
        fecha_nacimiento: initialValues.fecha || dayjs(),
        genero: initialValues.genero ?? 'MASCULINO',
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

      <DialogContent sx={{ pt: 3, pb: 1 }}>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="nombres"
                  name="nombres"
                  label="Nombres"
                  value={formik.values.nombres}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={formik.touched.nombres && Boolean(formik.errors.nombres)}
                  helperText={formik.touched.nombres && formik.errors.nombres}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="p_apellido"
                  name="p_apellido"
                  label="P. apellido"
                  value={formik.values.p_apellido}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={formik.touched.p_apellido && Boolean(formik.errors.p_apellido)}
                  helperText={formik.touched.p_apellido && formik.errors.p_apellido}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="s_apellido"
                  name="s_apellido"
                  label="S. apellido"
                  value={formik.values.s_apellido}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={formik.touched.s_apellido && Boolean(formik.errors.s_apellido)}
                  helperText={formik.touched.s_apellido && formik.errors.s_apellido}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="dni"
                  name="dni"
                  label="DNI"
                  // type="number"
                  value={formik.values.dni}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={formik.touched.dni && Boolean(formik.errors.dni)}
                  helperText={formik.touched.dni && formik.errors.dni}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                  <Stack spacing={3}>
                    <DatePicker
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      views={['day', 'month', 'year']}
                      inputFormat="DD/MM/YYYY"
                      label="Fecha nac.*"
                      value={formik.values.fecha_nacimiento}
                      onChange={(newValue) => {
                        formik.setFieldValue('fecha_nacimiento', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={formik.touched.fecha_nacimiento && Boolean(formik.errors.fecha_nacimiento)}
                          helperText={formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento}
                          variant="standard"
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  id="correo"
                  name="correo"
                  label="Correo Electrónico"
                  value={formik.values.correo}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={formik.touched.correo && Boolean(formik.errors.correo)}
                  helperText={formik.touched.correo && formik.errors.correo}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="genero-select-label">Genero</InputLabel>
                  <Select
                    labelId="genero-select-label"
                    id="genero-select"
                    value={formik.values.genero || 'MASCULINO'}
                    label="Genero"
                    onChange={(event) => {
                      const selectedValue = event.target.value ?? '';
                      const isValidValue = ['MASCULINO', 'FEMENINO'].includes(selectedValue);

                      if (isValidValue) {
                        formik.setFieldValue('genero', selectedValue);
                      }
                    }}
                  >
                    <MenuItem value={"MASCULINO"}>MASCULINO</MenuItem>
                    <MenuItem value={"FEMENINO"}>FEMENINO</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
            <DialogActions sx={{ pt: 5 }}>
              <Button onClick={handleClose} endIcon={<CancelIcon />} variant="contained">
                Cerrar
              </Button>

              <Button
                type="submit"
                // onClick={formik.submitForm}
                color="primary"
                startIcon={<SaveIcon />}
                variant="contained"
              >
                Guardar
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UsersForm;