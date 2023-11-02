import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid } from '@mui/material';
import axios from 'axios';

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

const CreateVehicleForm = ({ onVehicleCreated }) => {
    const formik = useFormik({
        initialValues: {
            codigo: '',
            marca: '',
            modelo: '',
            anio: '',
            placa: '',
            color: '',
            kilometraje: '',
            esta_operativo: true,
            descripcion: '',
            estado: true,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post('/api/vehiculos', values); // Ajusta la URL de la API según tu configuración
                onVehicleCreated(response.data);
                resetForm();
            } catch (error) {
                console.error('Error al crear el vehículo:', error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="marca"
                        name="marca"
                        label="Marca"
                        value={formik.values.marca}
                        onChange={formik.handleChange}
                        error={formik.touched.marca && Boolean(formik.errors.marca)}
                        helperText={formik.touched.marca && formik.errors.marca}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="modelo"
                        name="modelo"
                        label="Modelo"
                        value={formik.values.modelo}
                        onChange={formik.handleChange}
                        error={formik.touched.modelo && Boolean(formik.errors.modelo)}
                        helperText={formik.touched.modelo && formik.errors.modelo}
                    />
                </Grid>
                {/* Agrega más campos de formulario aquí */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                        Crear Vehículo
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default CreateVehicleForm;
