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
});

const turnosOptions = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'DÍA', label: 'DÍA' },
    { value: 'TARDE', label: 'TARDE' },
    { value: 'NOCHE', label: 'NOCHE' },
];

// ==============================|| BarChartFilters Component ||============================== //
const BarChartFilters = ({ onSubmit, initialValues }) => {
    console.log(`BarChartFilters`);
    // Fechas
    const locale = dayjs.locale('es');

    // Combos
    const [zonas, setZonas] = useState([]);

    const formik = useFormik({
        initialValues: {
            fecha_inicio: initialValues.fecha_inicio || dayjs().subtract(28, 'day'),
            fecha_fin: initialValues.fecha_fin || dayjs(),
            turno: initialValues.turno ?? 'TODOS',
        },
        validationSchema,
        onSubmit: async (values) => {
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

    useEffect(() => {
        const fetchData = async () => {
            console.log('loadDataForFilters');
            const resZonas = await getZonasForAutocomplete();
            console.log(resZonas.data);
            setZonas(resZonas.data);
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
                        getOptionLabel={(option) => option?.nombre || ''}
                        defaultValue={[zonas[0]]}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Zonas"
                                placeholder="Favoritos"
                                variant="standard"
                            />
                        )}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default BarChartFilters;