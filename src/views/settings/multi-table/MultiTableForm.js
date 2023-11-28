import React from 'react';
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
    Autocomplete,
    TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getMultiTablesForAutocomplete } from 'api/multi-table/multiTableApi';

const maxWidth = 'sm'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = Yup.object().shape({
    codigo: Yup.string().nullable(),
    nombre: Yup.string().required('El nombre es obligatorio'),
    nombre_plural: Yup.string().nullable(),
    // es_tabla: Yup.boolean().required('Este campo es obligatorio'),
    es_tabla: Yup.boolean(),
    padre_id: Yup.number().nullable(),
    estado: Yup.boolean().required('Este campo es obligatorio'),
});

const MultiTableForm = ({ open, handleClose, onSubmit, initialValues, setSnackbar }) => {
    console.log(`initialValues`, initialValues);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [options, setOptions] = React.useState([]);

    const formik = useFormik({
        initialValues: Object.entries(initialValues).length > 0 ? initialValues : {
            codigo: '',
            nombre: '',
            nombre_plural: '',
            padre_id: '',
            estado: true,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const valuesAsParams = {
                codigo: values.codigo,
                nombre: values.nombre,
                nombre_plural: values.nombre_plural,
                // padre_id: values.padre_id,
                es_tabla: 0,
                estado: values.estado,
            }
            const resp = await onSubmit(valuesAsParams, resetForm);
            if (resp.success) {
                resetForm();
                handleClose();
            } else {
                console.log(resp);
            }
        },
    });

    const fetchParent = async () => {
        const resp = await getMultiTablesForAutocomplete(`?es_tabla=1`);
        if (resp.error) {
            setOptions([]);
            setSnackbar({ open: true, message: resp.responseData.message, severity: 'error' });
        } else {
            setOptions(resp.data);
        }
    }

    React.useEffect(() => {

        fetchParent();
    }, []); // La dependencia vacía asegura que la solicitud se realice solo una vez al montar el componente


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
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                id="nombre"
                                name="nombre"
                                label="Nombre"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                variant="standard"
                                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                helperText={formik.touched.nombre && formik.errors.nombre}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={5}>
                            <TextField
                                fullWidth
                                id="nombre_plural"
                                name="nombre_plural"
                                label="Nombre plural"
                                value={formik.values.nombre_plural}
                                onChange={formik.handleChange}
                                variant="standard"
                                error={formik.touched.nombre_plural && Boolean(formik.errors.nombre_plural)}
                                helperText={formik.touched.nombre_plural && formik.errors.nombre_plural}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                            <Autocomplete
                                fullWidth
                                id="padre_id"
                                name="padre_id"
                                options={options}
                                getOptionLabel={(option) => option.nombre}
                                value={options.find((option) => option.id === formik.values.padre_id) || null}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue('padre_id', newValue ? newValue.id : null);
                                }}
                                renderInput={(params) => <TextField {...params} variant="standard" label="Padre" />}
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
                            <label htmlFor="estado">Habilitado</label>
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
    );
};

export default MultiTableForm;
