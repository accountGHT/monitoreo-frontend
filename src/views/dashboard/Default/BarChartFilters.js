import React from 'react';

// material-ui
// import { Grid, Autocomplete, TextField, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Grid, TextField, Stack, } from '@mui/material';

// Fechas
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';


const BarChartFilters = () => {
    // Fechas
    const locale = dayjs.locale('es');

    const onChangeFechaDesde = (value) => {
        console.log(`onChangeFechaDesde`, value);
        // setDrawTable(false);
        // setFechaInicio(value.format('YYYY-MM-DD'));
        // listDatosGrafico(value.format('YYYY-MM-DD'), fechaFin, null, turno);
        // setDrawTable(true);
    }

    return (
        <div>
            <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                    <Stack spacing={3}>
                        <DatePicker
                            id="fecha"
                            name="fecha"
                            views={['day', 'month', 'year']}
                            inputFormat="DD/MM/YYYY"
                            label="Fecha *"
                            // value={formik.values.fecha}
                            // onChange={(newValue) => { formik.setFieldValue('fecha', newValue); }}
                            onChange={(newValue) => { onChangeFechaDesde(newValue) }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    // error={formik.touched.fecha && Boolean(formik.errors.fecha)}
                                    // helperText={formik.touched.fecha && formik.errors.fecha}
                                    variant="standard"
                                />
                            )}
                        />
                    </Stack>
                </LocalizationProvider>
            </Grid>
        </div>
    )
}

export default BarChartFilters;