import React, { useState } from 'react';

// material-ui
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// project imports
import BarChartFilters from './BarChartFilters';
import { gridSpacing } from 'store/constant';

import MainCard from 'ui-component/cards/MainCard';
import dayjs from 'dayjs';

// APIs
import MonitoreoCamarasBarChart from './monitoreo-camaras/MonitoreoCamarasBarChart';
import CommunicationsCenterBarChart from './central-comunicaciones/CommunicationsCenterBarChart';
import DistribucionPersonalBarChart from './distribucion-personal/DistribucionPersonalBarChart';

import MonitoreoCamarasTable from './monitoreo-camaras/MonitoreoCamarasTable';
import CommunicationsCenterTable from './central-comunicaciones/CommunicationsCenterTable';
import DistribucionPersonalTable from './distribucion-personal/DistribucionPersonalTable';

const tiposReporte = ['Monitoreo Cámaras', 'CECOM', 'Distribución del personal'];

// ==============================|| DEFAULT DASHBOARD ||============================== //
const Dashboard = () => {
  // const [isLoading, setLoading] = useState(true);
  const [tipoReporte, setTipoReporte] = useState('Monitoreo Cámaras');

  // filters
  const initialValues = {
    fecha_inicio: dayjs().subtract((365 * 40), 'day'),
    fecha_fin: dayjs(),
    turno: 'TODOS',
  };

  const [filters, setFilters] = useState(initialValues);

  // const setDataForAPI = async (values) => {
  //   console.log(`setDataForAPI`, values);
  //   setFilters(values);
  // }

  const onChangeTipoReporte = (value) => {
    const selectedValue = value ?? '';
    const isValidValue = tiposReporte.includes(selectedValue);
    if (isValidValue) {
      setTipoReporte(value);
    }
  }

  return (
    <MainCard sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>

        <Grid item xs={12}><Typography variant="h1">CENTRAL DE MONITOREO SERENAZGO TALARA</Typography></Grid>

        <Grid item lg={7} md={9} sm={12} xs={12}>
          <Typography variant="h3" sx={{ mb: 2 }}>{tipoReporte}</Typography>
          {(tipoReporte === 'Monitoreo Cámaras') && (<MonitoreoCamarasBarChart filters={filters} />)}
          {(tipoReporte === 'CECOM') && (<CommunicationsCenterBarChart filters={filters} />)}
          {(tipoReporte === 'Distribución del personal') && (<DistribucionPersonalBarChart filters={filters} />)}
        </Grid>

        <Grid item lg={5} md={3} sm={12} xs={12}>
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
          <BarChartFilters onSubmit={setFilters} initialValues={initialValues || {}} />
          {/* <BarChartFilters onSubmit={setDataForAPI} initialValues={initialValues || {}} /> */}
        </Grid>

        <Grid item xs={12}>
          {(tipoReporte === 'Monitoreo Cámaras') && (<MonitoreoCamarasTable filters={filters} />)}
          {(tipoReporte === 'CECOM') && (<CommunicationsCenterTable filters={filters} />)}
          {(tipoReporte === 'Distribución del personal') && (<DistribucionPersonalTable filters={filters} />)}
        </Grid>

      </Grid>
    </MainCard>

  );
};

export default Dashboard;
