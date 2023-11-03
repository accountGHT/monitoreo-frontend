import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const validationSchema = Yup.object().shape({
  codigo: Yup.string(),
  marca: Yup.string().required('Campo requerido'),
  modelo: Yup.string().required('Campo requerido'),
  anio: Yup.number().required('Campo requerido'),
  placa: Yup.string().required('Campo requerido'),
  color: Yup.string(),
  kilometraje: Yup.number(),
  esta_operativo: Yup.boolean(),
  descripcion: Yup.string(),
  estado: Yup.boolean(),
});

const PersonForm = ({ open, handleClose, onSubmit, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      handleClose();
    },
  });
  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle>Formulario de Vehículo</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          {/* Agrega más campos de formulario aquí */}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PersonForm;