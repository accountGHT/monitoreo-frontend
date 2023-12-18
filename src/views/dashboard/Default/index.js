import { useEffect, useState } from 'react';

// material-ui
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// project imports
import BarChartFilters from './BarChartFilters';
import { gridSpacing } from 'store/constant';

// import LuisitoBarChart from './LuisitoBarChart';
import MainCard from 'ui-component/cards/MainCard';
import dayjs from 'dayjs';

// Get Data
import { getDataForChartMonitoreoCamaras } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import MonitoreoCamarasBarChart from './monitoreo-camaras/MonitoreoCamarasBarChart';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  // const [isLoading, setLoading] = useState(true);
  const [tipoReporte, setTipoReporte] = useState('Monitoreo Cámaras');
  // const [zona, setzona] = useState({});

  // Chart
  const [optionsChart, setOptionsChart] = useState({});
  const [seriesChart, setSeriesChart] = useState([]);

  // filters
  const initialValues = {
    fecha_inicio: dayjs().subtract((365 * 40), 'day'),
    fecha_fin: dayjs(),
    turno: 'TODOS',
  };

  const setDataForAPI = async (values) => {
    console.log(`setDataForAPI`, values);

    const payload = {
      fecha_inicio: dayjs(values.fecha_inicio).format('YYYY-MM-DD'),
      fecha_fin: dayjs(values.fecha_fin).format('YYYY-MM-DD'),
      zona: null,
      turno: values.turno === 'TODOS' ? '' : values.turno,
    }

    const respDatosGrafico = await getDataForChartMonitoreoCamaras(payload);
    console.log(`respDatosGrafico`, respDatosGrafico);


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
    return { success: true };
  }

  useEffect(() => {
    setDataForAPI(initialValues);
    // setLoading(false);
  }, []);

  const onChangeTipoReporte = (value) => {
    console.log(value);
    setTipoReporte(value);
  }



  return (
    <MainCard sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>

        <Grid item xs={12}><Typography variant="h1">CENTRAL DE MONITOREO SERENAZGO TALARA</Typography></Grid>

        <Grid item lg={9} md={9} sm={12} xs={12}>
          <Typography variant="h3">{tipoReporte}</Typography>
          <MonitoreoCamarasBarChart optionsChart={optionsChart} seriesChart={seriesChart} />
          {/* <LuisitoBarChart isLoading={isLoading} /> */}
        </Grid>

        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Grid sx={{ pb: 4 }}>
            <h3>Selecciona el tipo de reporte</h3>
            <FormControl fullWidth variant="standard">
              <InputLabel id="tipo-reporte-select-label">Tipo de reporte</InputLabel>
              <Select
                labelId="tipo-reporte-select-label"
                id="tipo-reporte-select"
                value={tipoReporte}
                label="Tipo de reporte"
                onChange={(event) => {
                  onChangeTipoReporte(event.target.value);
                }}
              >
                <MenuItem value={"Monitoreo Cámaras"}>Monitoreo Cámaras</MenuItem>
                <MenuItem value={"CECOM"}>CECOM</MenuItem>
                <MenuItem value={"Distribución del personal"}>Distribución del personal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <BarChartFilters onSubmit={setDataForAPI} initialValues={initialValues || {}} />
        </Grid>

      </Grid>
    </MainCard>

  );
};

export default Dashboard;
