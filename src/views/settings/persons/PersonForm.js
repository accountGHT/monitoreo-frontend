import React, { useEffect, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Switch,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const maxWidth = 'md'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = Yup.object().shape({
  nombres: Yup.string().required('Campo requerido'),
  p_apellido: Yup.string(),
  s_apellido: Yup.string(),
  dni: Yup.number().required('Campo requerido'),
  correo: Yup.string(),
  // fecha_nacimiento: Yup.string(),
  estado: Yup.boolean(),
});

const PersonForm = ({ open, handleClose, onSubmit, initialValues }) => {
  console.log(`initialValues`, initialValues);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Agrega un estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      handleClose();
    },
  });

  useEffect(() => {
    console.log(`initialValues`, initialValues);
    if (open) {
      formik.setValues({
        id: initialValues.id || null,
        nombres: initialValues.nombres || '',
        p_apellido: initialValues.p_apellido || '',
        s_apellido: initialValues.s_apellido || '',
        dni: initialValues.dni || '',
        placa: initialValues.placa || '',
        correo: initialValues.correo || '',
        fecha_nacimiento: initialValues.fecha_nacimiento || '',
        estado: (initialValues.estado === 1 ? true : false) || true,
      });
      setLoading(false);
    }
    return () => {
      // second
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
          <DialogTitle>NUEVO REGISTRO</DialogTitle>
          <DialogContent>
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
                    type="number"
                    value={formik.values.dni}
                    onChange={formik.handleChange}
                    variant="standard"
                    error={formik.touched.dni && Boolean(formik.errors.dni)}
                    helperText={formik.touched.dni && formik.errors.dni}
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={3}>
                  <Switch
                    id="estado"
                    name="estado"
                    checked={formik.values.estado}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                  <label htmlFor="estado">Estado</label>
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancelar</Button>
                <Button type="submit" color="primary">Guardar</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default PersonForm;