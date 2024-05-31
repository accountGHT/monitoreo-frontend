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
    Autocomplete,
    TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { getMultiTablesForAutocomplete } from 'api/multi-table/multiTableApi';

const maxWidth = 'sm'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const MultiTableForm = ({ open, handleClose, onSubmit, initialValues, setSnackbar }) => {
    console.log(open, open);
    console.log(initialValues, initialValues);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // Agrega un estado para controlar la carga de datos
    const [loading, setLoading] = useState(true);
    //
    const [options, setOptions] = useState([]);

    const formik = useFormik({
        initialValues: initialValues || {},
        onSubmit: async (values, { resetForm }) => {
            const valuesAsParams = {
                id: values.id || null,
                codigo: values.codigo,
                nombre: values.nombre,
                nombre_plural: values.nombre_plural,
                padre_id: values.padre_id,
                es_tabla: 0,
                estado: values.estado ? 1 : 0,
                latitud1: values.latitud1 || null,
                longitud1: values.longitud1 || null,
                latitud2: values.latitud2 || null,
                longitud2: values.longitud2 || null,
            };
            const resp = await onSubmit(valuesAsParams, resetForm);
            if (resp.success) {
                resetForm();
                handleClose();
            } else {
                console.log(resp);
            }
        },
    });

    useEffect(() => {
        const fetchParent = async () => {
            const resp = await getMultiTablesForAutocomplete(`?es_tabla=1`);
            if (resp.error) {
                setOptions([]);
                setSnackbar({ open: true, message: resp.responseData.message, severity: 'error' });
            } else {
                setOptions(resp.data || []);
                // Modificar la asignación de initialValues
                formik.setValues(prevValues => ({
                    ...prevValues,
                    id: initialValues.id || null,
                    codigo: initialValues.codigo || '',
                    nombre: initialValues.nombre || '',
                    nombre_plural: initialValues.nombre_plural || '',
                    padre_id: initialValues.padre_id || null,
                    es_tabla: initialValues.es_tabla || 0,
                    estado: (initialValues.estado === 1 ? true : false) || true,
                    latitud1: initialValues.latitud1 || null,
                    longitud1: initialValues.longitud1 || null,
                    latitud2: initialValues.latitud2 || null,
                    longitud2: initialValues.longitud2 || null,
                }));
            }
            // Cambia el estado de carga después de cargar los datos
            setLoading(false);
        }

        fetchParent();
    }, [open]); // Agrega initialValues como dependencia

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
                    <DialogTitle>{Object.entries(initialValues).length > 0 ? 'ACTUALIZAR REGISTRO' : 'NUEVO REGISTRO'}</DialogTitle>
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
                                {formik.values.padre_id === 2 && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="latitud1"
                                                name="latitud1"
                                                label="Latitud 1"
                                                value={formik.values.latitud1}
                                                onChange={formik.handleChange}
                                                variant="standard"
                                                error={formik.touched.latitud1 && Boolean(formik.errors.latitud1)}
                                                helperText={formik.touched.latitud1 && formik.errors.latitud1}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="longitud1"
                                                name="longitud1"
                                                label="Longitud 1"
                                                value={formik.values.longitud1}
                                                onChange={formik.handleChange}
                                                variant="standard"
                                                error={formik.touched.longitud1 && Boolean(formik.errors.longitud1)}
                                                helperText={formik.touched.longitud1 && formik.errors.longitud1}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="latitud2"
                                                name="latitud2"
                                                label="Latitud 2"
                                                value={formik.values.latitud2}
                                                onChange={formik.handleChange}
                                                variant="standard"
                                                error={formik.touched.latitud2 && Boolean(formik.errors.latitud2)}
                                                helperText={formik.touched.latitud2 && formik.errors.latitud2}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="longitud2"
                                                name="longitud2"
                                                label="Longitud 2"
                                                value={formik.values.longitud2}
                                                onChange={formik.handleChange}
                                                variant="standard"
                                                error={formik.touched.longitud2 && Boolean(formik.errors.longitud2)}
                                                helperText={formik.touched.longitud2 && formik.errors.longitud2}
                                            />
                                        </Grid>
                                    </>
                                )}
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
            )}
        </>
    );

};
export default MultiTableForm;
