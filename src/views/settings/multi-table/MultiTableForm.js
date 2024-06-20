/*eslint-disable*/
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
import { getMultiTablesForAutocomplete, getInstitucionesForAutocomplete, getAreasForAutocomplete } from 'api/multi-table/multiTableApi';
import es from 'dayjs/locale/es';
// assets
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const maxWidth = 'sm'; // xs, sm, md, lg, xl
const fullWidth = true;
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const MultiTableForm = ({ tablaActual, open, handleClose, onSubmit, initialValues, setSnackbar }) => {
    console.log(open, open);
    console.log(initialValues, initialValues);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // Agrega un estado para controlar la carga de datos
    const [loading, setLoading] = useState(true);
    const [esZona, setEsZona] = useState(false);
    const [esArea, setEsArea] = useState(false);
    const [esTipoIncidencia, setEsTipoIndicencia] = useState(false);
    //
    const [options, setOptions] = useState([]);

    // Instituciones

    const [optionsInstituciones, setOptionsInstituciones] = useState([])

    // Areas

    const [optionsAreas, setOptionsAreas] = useState([])

    // area filtradas
    const [filteredAreas, setFilteredAreas] = useState([]);


    const formik = useFormik({
        initialValues: initialValues || {},
        onSubmit: async (values, { resetForm }) => {
            console.log('payload', values);
            const valuesAsParams = {

                id: values.id || null,
                codigo: values.codigo,
                nombre: values.nombre,
                nombre_plural: values.nombre_plural,
                padre_id: values.padre_id,
                estado: values.estado ? 1 : 0,
                ...esZona && {
                    latitud1: values.latitud1 || null,
                    longitud1: values.longitud1 || null,
                    latitud2: values.latitud2 || null,
                    longitud2: values.longitud2 || null,
                },
                ...(esTipoIncidencia && {
                    es_violento: values.es_violento ? 1 : 0,
                    es_transito: values.es_transito ? 1 : 0,
                    institucion_id: values.institucion_id,
                    area_id: values.area_id,
                }),
                ...(esArea && {
                    institucion_id: values.institucion_id,
                }),
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
                    estado: (initialValues.estado === 1 ? true : false) || true,
                    latitud1: initialValues.latitud1 ?? '',
                    longitud1: initialValues.longitud1 ?? '',
                    latitud2: initialValues.latitud2 ?? '',
                    longitud2: initialValues.longitud2 ?? '',
                    es_violento: (initialValues.es_violento === 1 ? true : false) || true,
                    es_transito: (initialValues.es_transito === 1 ? true : false) || true,
                    institucion_id: initialValues.institucion_id || null,
                    area_id: initialValues.area_id || null,
                }));
            }
            // Cambia el estado de carga después de cargar los datos
            setLoading(false);
        }

        fetchParent();
    }, [open]); // Agrega initialValues como dependencia

    useEffect(() => {
        const defaultOption = options.find(option => option.nombre === tablaActual);
        if (defaultOption) {
            formik.setFieldValue('padre_id', defaultOption.id);
        }
    }, [options]);

    useEffect(() => {
        if (formik.values.institucion_id) {
            const newFilteredAreas = optionsAreas.filter(area => area.institucion_id === formik.values.institucion_id);
            setFilteredAreas(newFilteredAreas);
        } else {
            setFilteredAreas([]);
        }
    }, [formik.values.institucion_id, optionsAreas]);


    useEffect(() => {
        if (tablaActual === 'ZONA') {
            setEsZona(true);
            console.log('es zona');
        }
        if (tablaActual === 'TIPO DE INCIDENCIA') {
            setEsTipoIndicencia(true);
            fetchAreas();
            fetchInstituciones();
            console.log('es tipo incidencia');
        }
        if (tablaActual === 'AREA') {
            setEsArea(true);
            fetchInstituciones();
            console.log('es area');
        }
    }, [tablaActual]);

    const fetchInstituciones = async () => {
        const resp = await getInstitucionesForAutocomplete();
        console.log('Instituciones', resp.data);
        if (resp.error) {
            setSnackbar({ open: true, message: resp.responseData.message, severity: 'error' });
        } else {
            setOptionsInstituciones(resp.data || []);
        }
    }

    const fetchAreas = async () => {
        const resp = await getAreasForAutocomplete();
        console.log('Areas', resp.data);
        if (resp.error) {
            setSnackbar({ open: true, message: resp.responseData.message, severity: 'error' });
        } else {
            setOptionsAreas(resp.data || []);
        }
    }

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
                                <Grid item xs={10} sm={6} md={5}>
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
                                {esZona && (
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
                                {esTipoIncidencia && (

                                    <>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Autocomplete
                                                fullWidth
                                                id="institucion_id"
                                                name="institucion_id"
                                                options={optionsInstituciones}
                                                getOptionLabel={(option) => option.nombre}
                                                value={optionsInstituciones.find((option) => option.id === formik.values.institucion_id) || null}
                                                onChange={(event, newValue) => {
                                                    formik.setFieldValue('institucion_id', newValue ? newValue.id : null);
                                                }}
                                                renderInput={(params) => <TextField {...params} variant="standard" label="Institución" />}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Autocomplete
                                                fullWidth
                                                id="area_id"
                                                name="area_id"
                                                options={filteredAreas}
                                                getOptionLabel={(option) => option.nombre}
                                                value={filteredAreas.find((option) => option.id === formik.values.area_id) || null}
                                                onChange={(event, newValue) => {
                                                    formik.setFieldValue('area_id', newValue ? newValue.id : null);
                                                }}
                                                renderInput={(params) => <TextField {...params} variant="standard" label="Área" />}
                                            />

                                        </Grid>
                                    </>
                                )}

                                {esArea && (

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Autocomplete
                                            fullWidth
                                            id="institucion_id"
                                            name="institucion_id"
                                            options={optionsInstituciones}
                                            getOptionLabel={(option) => option.nombre}
                                            value={optionsInstituciones.find((option) => option.id === formik.values.institucion_id) || null}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue('institucion_id', newValue ? newValue.id : null);
                                            }}
                                            renderInput={(params) => <TextField {...params} variant="standard" label="Institución" />}
                                        />
                                    </Grid>
                                )
                                }

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

                                {esTipoIncidencia && (
                                    <>
                                        <Grid item xs={12} sm={5} md={3}>
                                            <Switch
                                                id="es_violento"
                                                name="es_violento"
                                                checked={formik.values.es_violento}
                                                onChange={formik.handleChange}
                                                color="primary"
                                            />
                                            <label htmlFor="es_violento">Es violento</label>
                                        </Grid>
                                        <Grid item xs={12} sm={5} md={3}>
                                            <Switch
                                                id="es_transito"
                                                name="es_transito"
                                                checked={formik.values.es_transito}
                                                onChange={formik.handleChange}
                                                color="primary"
                                            />
                                            <label htmlFor="es_transito">Es tránsito</label>
                                        </Grid>

                                    </>
                                )}

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
                    </DialogContent>
                </Dialog>
            )}
        </>
    );

};
export default MultiTableForm;
