import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography, Autocomplete, TextField, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// Fechas
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';


// Get Data
import { getDatosGrafico, getZonas } from 'api/monitoreo-camaras/monitoreoCamarasApi';

const LuisitoBarChart = ({ isLoading }) => {
    // Fechas
    const locale = dayjs.locale('es');

    const [fechaInicio, setFechaInicio] = useState('2000-01-01');
    const [fechaFin, setFechaFin] = useState('2023-10-31');

    // Combos
    const [zonas, setzonas] = useState([]);
    const [zona, setzona] = useState({});
    const [turno, setTurno] = useState('');


    const [optionsChart, setOptionsChart] = useState({});
    const [seriesChart, setSeriesChart] = useState([]);


    const fillFilters = async () => {
        const resZonas = await getZonas();
        setzonas(resZonas.data);
    }

    const listDatosGrafico = async (fechaInicio, fechaFin, zona = null, turno = '') => {
        let params = `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

        if(turno !== '') {
            params = params + `&turno=${turno}`;
        }

        if(zona !== null) {
            // params = params + `&turno=${turno}`;
        }

        const respDatosGrafico = await getDatosGrafico(params);

        let dataChartCategories = [];
        let dataChart = [];

        respDatosGrafico.forEach((el) => {
            dataChartCategories.push(el.tipo_incidencia.nombre);
            dataChart.push(el.cantidad_incidencias);
        });

        setOptionsChart({
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: dataChartCategories
            }
        });

        setSeriesChart([
            {
                name: "Incidencias",
                data: dataChart
            }
        ]);
    }

    useEffect(() => {
        fillFilters();
        listDatosGrafico(fechaInicio, fechaFin);
    }, []);

    const onChangeFechaDesde = (value) => {
        setFechaInicio(value.format('YYYY-MM-DD'));
        listDatosGrafico(value.format('YYYY-MM-DD'), fechaFin);
    }

    const onChangeFechaHasta = (fecha) => {
        setFechaFin(fecha.format('YYYY-MM-DD'));
        listDatosGrafico(fechaInicio, fecha.format('YYYY-MM-DD'));
    }

    const onChangeZona = (value) => {
        console.log(value);
        setzona(value ?? {});
        // listDatosGrafico(fechaInicio, fecha.format('YYYY-MM-DD'));
    }

    const onChangeTurno = (event) => {
        console.log(event.target.value);
        setTurno(event.target.value);
        listDatosGrafico(fechaInicio, fechaFin, null, event.target.value);
    }


    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="h3">Monitoreo Cámaras</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                                        <Stack spacing={3}>
                                            <DatePicker
                                                id="desde"
                                                name="desde"
                                                views={['day', 'month', 'year']}
                                                inputFormat="DD/MM/YYYY"
                                                label="Desde *"
                                                // value={formik.values.fecha}
                                                onChange={(newValue) => { onChangeFechaDesde(newValue) }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                                        <Stack spacing={3}>
                                            <DatePicker
                                                id="hasta"
                                                name="hasta"
                                                views={['day', 'month', 'year']}
                                                inputFormat="DD/MM/YYYY"
                                                label="Hasta*"
                                                // value={formik.values.fecha}
                                                onChange={(newValue) => { onChangeFechaHasta(newValue) }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Autocomplete
                                        disablePortal
                                        id="zona"
                                        name="zona"
                                        options={zonas}
                                        getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                                        value={Object.entries(zona).length > 0 ? zona : null}
                                        onChange={(event, newValue) => { onChangeZona(newValue); }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Zona"
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="turno-select-label">Turno</InputLabel>
                                        <Select
                                            labelId="turno-select-label"
                                            id="turno-select"
                                            value={turno}
                                            label="Turno"
                                            onChange={onChangeTurno}
                                        >
                                            <MenuItem value={"DÍA"}>DÍA</MenuItem>
                                            <MenuItem value={"TARDE"}>TARDE</MenuItem>
                                            <MenuItem value={"NOCHE"}>NOCHE</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart
                                options={optionsChart}
                                series={seriesChart}
                                type="bar"
                            // width="500"
                            />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
}

LuisitoBarChart.propTypes = {
    isLoading: PropTypes.bool
}

export default LuisitoBarChart