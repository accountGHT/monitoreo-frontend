import React, { useEffect, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment,
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

const VehicleForm = ({ open, handleClose, onSubmit, initialValues }) => {
    console.log(`initialValues`, initialValues);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Agrega un estado para controlar la carga de datos
    const [loading, setLoading] = useState(true);

    const formik = useFormik({
        initialValues: {},
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const valuesAsParams = {
                id: values.id || null,
                codigo: values.codigo,
                marca: values.marca,
                modelo: values.modelo,
                anio: values.anio,
                placa: values.placa,
                color: values.color,
                kilometraje: values.kilometraje,
                esta_operativo: values.esta_operativo,
                descripcion: values.descripcion,
                estado: values.estado,
            }
            const resp = await onSubmit(valuesAsParams, resetForm);
            console.log(`resp onSubmit`, resp);
            if (resp.success) {
                resetForm();
                handleClose();
            } else {
                console.log(resp.data);
            }

        },
    });

    useEffect(() => {
        console.log(`initialValues`, initialValues);
        if (open) {
            formik.setValues({
                id: initialValues.id || null,
                codigo: initialValues.codigo || '',
                marca: initialValues.marca || '',
                modelo: initialValues.modelo || '',
                anio: initialValues.anio || '',
                placa: initialValues.placa || '',
                color: initialValues.color || '',
                kilometraje: initialValues.kilometraje || '',
                esta_operativo: (initialValues.esta_operativo === 1 ? true : false) || true,
                descripcion: initialValues.descripcion || '',
                estado: (initialValues.estado === 1 ? true : false) || true,
            });
            setLoading(false);
        }
        return () => {
            // second
            // 
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
                                        id="codigo"
                                        name="codigo"
                                        label="Código"
                                        value={formik.values.codigo}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                                        helperText={formik.touched.codigo && formik.errors.codigo}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        id="marca"
                                        name="marca"
                                        label="Marca"
                                        value={formik.values.marca}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        error={formik.touched.marca && Boolean(formik.errors.marca)}
                                        helperText={formik.touched.marca && formik.errors.marca}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        id="modelo"
                                        name="modelo"
                                        label="Modelo"
                                        value={formik.values.modelo}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        error={formik.touched.modelo && Boolean(formik.errors.modelo)}
                                        helperText={formik.touched.modelo && formik.errors.modelo}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        id="anio"
                                        name="anio"
                                        label="Año"
                                        type="number"
                                        value={formik.values.anio}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        error={formik.touched.anio && Boolean(formik.errors.anio)}
                                        helperText={formik.touched.anio && formik.errors.anio}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        id="placa"
                                        name="placa"
                                        label="Placa"
                                        value={formik.values.placa}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        error={formik.touched.placa && Boolean(formik.errors.placa)}
                                        helperText={formik.touched.placa && formik.errors.placa}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        id="color"
                                        name="color"
                                        label="Color"
                                        value={formik.values.color}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        error={formik.touched.color && Boolean(formik.errors.color)}
                                        helperText={formik.touched.color && formik.errors.color}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        id="kilometraje"
                                        name="kilometraje"
                                        label="kilometraje"
                                        type="number"
                                        value={formik.values.kilometraje}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">Km</InputAdornment>
                                        }}
                                        error={formik.touched.kilometraje && Boolean(formik.errors.kilometraje)}
                                        helperText={formik.touched.kilometraje && formik.errors.kilometraje}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Checkbox
                                        id="esta_operativo"
                                        name="esta_operativo"
                                        checked={formik.values.esta_operativo}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor="esta_operativo">¿Está operativo?</label>
                                </Grid>
                                <Grid item xs={12} sm={7} md={9}>
                                    <TextField
                                        id="descripcion"
                                        name="descripcion"
                                        label="Descripción"
                                        multiline
                                        maxRows={4}
                                        fullWidth
                                        variant="standard"
                                        value={formik.values.descripcion}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
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
            )}
        </>
    );
};

export default VehicleForm;
