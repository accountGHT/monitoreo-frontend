import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, TextField, Stack, MenuItem, Select, InputLabel, FormControl, Autocomplete, } from '@mui/material';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Fechas
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { getZonasForAutocomplete } from 'api/multi-table/multiTableApi';

const validationSchema = Yup.object({
    fecha_inicio: Yup.date().required('La fecha es obligatoria'),
    fecha_fin: Yup.date().required('La fecha es obligatoria'),
});

const turnosOptions = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'DÍA', label: 'DÍA' },
    { value: 'TARDE', label: 'TARDE' },
    { value: 'NOCHE', label: 'NOCHE' },
];

// ==============================|| BarChartFilters Component ||============================== //
// const BarChartFilters = ({ onSubmit, initialValues }) => {
const BarChartFilters = ({ onSubmit }) => {
    // console.log(`BarChartFilters initialValues`, initialValues);
    // Fechas
    const locale = dayjs.locale('es');

    // Combos
    const [zonas, setZonas] = useState([]);
    const [zonasDefault, setZonasDefault] = useState([]);

    const initialValues = {
        fecha_inicio: dayjs().subtract((365 * 40), 'day'),
        fecha_fin: dayjs(),
        turno: 'TODOS',
        zonas: [],
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: async (values) => {
            console.log(`onSubmit`, values);
            onSubmit(values);
            // const resp = await onSubmit(values);
            // console.log(resp.data);
            // if (resp.success) {
            //     return;
            // }

            // if (resp.data.errors && Object.entries(resp.data.errors).length > 0) {
            //     formik.setErrors(resp.data.errors);
            // }
        }
    });

    const handleDateChange = (field, newValue) => {
        let valueFormated = dayjs(newValue).format('YYYY-MM-DD');
        if (valueFormated !== 'Invalid Date') {
            formik.setFieldValue(field, newValue);
            formik.submitForm();
        }
    };

    const handleZonasChange = (event, newValue) => {
        formik.setFieldValue('zonas', newValue);
        formik.submitForm();
    };

    const handleZonasClose = () => {
        formik.setFieldTouched('zonas', true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const resZonas = await getZonasForAutocomplete();
            if (resZonas.success) {
                setZonasDefault(resZonas.data);
                setZonas(resZonas.data);
                formik.setValues({
                    ...initialValues,
                    zonas: initialValues.zonas.length > 0 ? initialValues.zonas : resZonas.data,
                });
            }
            console.log(`getZonasForAutocomplete`);
            formik.submitForm();
        };

        fetchData();
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                    <Stack spacing={3}>
                        <DatePicker
                            id="fecha_inicio"
                            name="fecha_inicio"
                            views={['day', 'month', 'year']}
                            inputFormat="DD/MM/YYYY"
                            label="Desde *"
                            value={formik.values.fecha_inicio}
                            onChange={(newValue) => handleDateChange('fecha_inicio', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={formik.touched.fecha_inicio && Boolean(formik.errors.fecha_inicio)}
                                    helperText={formik.touched.fecha && formik.errors.fecha_inicio}
                                    variant="standard"
                                />
                            )}
                        />
                    </Stack>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                    <Stack spacing={3}>
                        <DatePicker
                            id="fecha_fin"
                            name="fecha_fin"
                            views={['day', 'month', 'year']}
                            inputFormat="DD/MM/YYYY"
                            label="Hasta *"
                            value={formik.values.fecha_fin}
                            onChange={(newValue) => handleDateChange('fecha_fin', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={formik.touched.fecha && Boolean(formik.errors.fecha_fin)}
                                    helperText={formik.touched.fecha_fin && formik.errors.fecha_fin}
                                    variant="standard"
                                />
                            )}
                        />
                    </Stack>
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth variant="standard">
                    <InputLabel id="turno-select-label">Turno</InputLabel>
                    <Select
                        labelId="turno-select-label"
                        id="turno-select"
                        value={formik.values.turno || 'TARDE'}
                        label="Turno"
                        onChange={(event) => {
                            const selectedValue = event.target.value ?? 'TODOS';
                            const isValidValue = turnosOptions.some((option) => option.value === selectedValue);

                            if (isValidValue) {
                                formik.setFieldValue('turno', selectedValue);
                                formik.submitForm();
                            }
                        }}
                    >
                        {turnosOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {(zonas.length > 0) && (
                <Grid item xs={12} sm={12} md={12} sx={{ pb: 3 }}>
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={zonas}
                        value={formik.values.zonas}
                        defaultValue={zonasDefault}
                        onChange={handleZonasChange}
                        onClose={handleZonasClose}
                        getOptionLabel={(option) => option?.nombre || ''}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Zonas"
                                placeholder="Favoritos"
                                variant="standard"
                            // error={formik.touched.zonas && Boolean(formik.errors.zonas)}
                            // helperText={formik.touched.zonas && formik.errors.zonas}
                            />
                        )}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default BarChartFilters;