import { useEffect, useState } from 'react';

// material-ui
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// project imports
import MonitoreoCamarasBarChart from './monitoreo-camaras/MonitoreoCamarasBarChart';
import BarChartFilters from './BarChartFilters';
import { gridSpacing } from 'store/constant';

import LuisitoBarChart from './LuisitoBarChart';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [tipoReporte, setTipoReporte] = useState('Monitoreo Cámaras');

  useEffect(() => {
    setLoading(false);
  }, []);

  const onChangeTipoReporte = (event) => {
    console.log(event.target.value);
    setTipoReporte(event.target.value);
  }

  return (
    <MainCard sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>

        <Grid item xs={12}><Typography variant="h1">CENTRAL DE MONITOREO SERENAZGO TALARA</Typography></Grid>

        <Grid item lg={9} md={9} sm={12} xs={12}>
          <Typography variant="h3">{tipoReporte}</Typography>
          <MonitoreoCamarasBarChart />
          <LuisitoBarChart isLoading={isLoading} />
        </Grid>

        <Grid item lg={3} md={3} sm={12} xs={12}>
          <div style={{ paddingBottom: '20px' }}>
            <h3>Selecciona el tipo de reporte</h3>
            <FormControl fullWidth variant="standard">
              <InputLabel id="tipo-reporte-select-label">Tipo de reporte</InputLabel>
              <Select
                labelId="tipo-reporte-select-label"
                id="tipo-reporte-select"
                value={tipoReporte}
                label="Tipo de reporte"
                onChange={onChangeTipoReporte}
              >
                <MenuItem value={"Monitoreo Cámaras"}>Monitoreo Cámaras</MenuItem>
                <MenuItem value={"CECOM"}>CECOM</MenuItem>
                <MenuItem value={"Distribución del personal"}>Distribución del personal</MenuItem>
              </Select>
            </FormControl>
          </div>
          <BarChartFilters />
        </Grid>

      </Grid>
    </MainCard>

  );
};

export default Dashboard;
