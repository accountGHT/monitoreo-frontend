import React from 'react';

// material-ui
// import { Grid, Autocomplete, TextField, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Grid, TextField, Stack, MenuItem, Select, InputLabel, FormControl, } from '@mui/material';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Fechas
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const validationSchema = Yup.object({
    fecha_inicio: Yup.date().required('La fecha es obligatoria'),
});

// ==============================|| BarChartFilters Component ||============================== //
const BarChartFilters = ({ onSubmit, initialValues }) => {
    // Fechas
    const locale = dayjs.locale('es');

    const formik = useFormik({
        initialValues: {
            fecha_inicio: initialValues.fecha_inicio || dayjs().subtract(28, 'day'),
            fecha_fin: initialValues.fecha_fin || dayjs(),
            turno: initialValues.turno ?? 'TODOS',
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log(`values`, values);
            const resp = await onSubmit(values);
            if (!resp.success) {
                console.log(resp.data);
                if (Object.entries(resp.data.errors).length > 0) {
                    formik.setErrors(resp.data.errors);
                }
            }
        }
    });


    // const last28Days = dayjs().subtract(28, 'day');
    // useEffect(() => {
    //     formik.setValues({
    //         fecha_inicio: initialValues.fecha_inicio || dayjs().subtract(28, 'day'),
    //         fecha_fin: initialValues.fecha_fin || dayjs(),
    //         turno: initialValues.turno ?? 'TODOS',
    //     });

    //     return () => {
    //         formik.resetForm();
    //     }
    // }, []);

    const onChangeTurno = (value) => {
        console.log(`onChangeTurno`, value);
        const selectedValue = value ?? '';
        const isValidValue = ['TODOS', 'DÍA', 'TARDE', 'NOCHE'].includes(selectedValue);

        if (isValidValue) {
            formik.setFieldValue('turno', selectedValue);
        }
        formik.submitForm();
    }

    return (
        <div>
            <Grid item xs={12} sm={12} md={12} sx={{ pb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                    <Stack spacing={3}>
                        <DatePicker
                            id="fecha_inicio"
                            name="fecha_inicio"
                            views={['day', 'month', 'year']}
                            inputFormat="DD/MM/YYYY"
                            label="Desde *"
                            value={formik.values.fecha_inicio}
                            onChange={(newValue) => {
                                let valueFormated = dayjs(newValue).format('YYYY-MM-DD');
                                if (valueFormated !== 'Invalid Date') {
                                    formik.setFieldValue('fecha_inicio', newValue);
                                    formik.submitForm();
                                }
                            }}
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
            <Grid item xs={12} sm={12} md={12} sx={{ pb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                    <Stack spacing={3}>
                        <DatePicker
                            id="fecha_fin"
                            name="fecha_fin"
                            views={['day', 'month', 'year']}
                            inputFormat="DD/MM/YYYY"
                            label="Hasta *"
                            value={formik.values.fecha_fin}
                            onChange={(newValue) => {
                                let valueFormated = dayjs(newValue).format('YYYY-MM-DD');
                                if (valueFormated !== 'Invalid Date') {
                                    formik.setFieldValue('fecha_fin', newValue);
                                    formik.submitForm();
                                }
                            }}
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
                        onChange={(event) => { onChangeTurno(event.target.value) }}
                    >
                        <MenuItem value={"TODOS"}>TODOS</MenuItem>
                        <MenuItem value={"DÍA"}>DÍA</MenuItem>
                        <MenuItem value={"TARDE"}>TARDE</MenuItem>
                        <MenuItem value={"NOCHE"}>NOCHE</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </div>
    )
}

export default BarChartFilters;