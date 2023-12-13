
import React, { useEffect, useState } from 'react';

// material-ui
import {
  Autocomplete,
  Grid,
  TextField,
  Dialog,
  DialogContent,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@mui/material';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Get Data
import { getTiposComunicacion } from 'api/monitoreo-camaras/monitoreoCamarasApi';

const gridSpacing = 3;
// ==============================|| FixedAssetMovementAdd Component ||============================== //
const CentralComunicacionesForm = ({ open, handleClose, refreshTable }) => {
  // Combos
  const [tiposComunicacion, setTiposComunicacion] = useState([]);

  const listZonas = async () => {
    const resTiposComunicacion = await getTiposComunicacion();
    setTiposComunicacion(resTiposComunicacion.data);
  }

  const validationSchema = Yup.object({
    fecha: Yup.object().nullable().required('Fecha es requerida'),
    zona_incidencia_id: Yup.number('Zona no es válido').required('Zona es requerida'),
    tipo_apoyo_incidencia_id: Yup.number('Tipo Incidencia no es válido').nullable(),
    operador_id: Yup.number('Operador no es válido').nullable(),
    personal_serenazgo_id: Yup.number('Activo Fijo no es válido').nullable(),
    vehiculo_id: Yup.number('Área no es válido').nullable(),
    supervisor_id: Yup.number('Supervisor no es válido').nullable(),
  });

  const formik = useFormik({
    initialValues: {
      fecha: dayjs(),
      hora_llamada: null,
      tipo_comunicacion_id: '',
      tipo_comunicacion: {},
      turno: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const objParams = {
        fecha: values.fecha = values.fecha.format('YYYY-MM-DD'),
        hora_llamada: values.hora_llamada.format('HH:mm:ss'),
        tipo_comunicacion_id: values.tipo_comunicacion_id,
        turno: values.turno,
      }
    }
  });

  useEffect(() => {
    listZonas();
    return () => {
      formik.resetForm();
    }
  }, []);

  return (
    <Dialog>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={gridSpacing}>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                id="tipo_comunicacion"
                name="tipo_comunicacion"
                options={tiposComunicacion}
                getOptionLabel={(option) => (option.nombre !== undefined ? option.nombre : '')}
                value={Object.entries(formik.values.tipo_comunicacion).length > 0 ? formik.values.tipo_comunicacion : null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tipo_comunicacion', newValue ?? {});
                  formik.setFieldValue('tipo_comunicacion_id', newValue === null ? '' : newValue.id);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de comunicación"
                    error={formik.touched.tipo_comunicacion_id && Boolean(formik.errors.tipo_comunicacion_id)}
                    helperText={formik.touched.tipo_comunicacion_id && formik.errors.tipo_comunicacion_id}
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
                  value={formik.values.turno}
                  label="Turno"
                  onChange={(event) => {
                    formik.setFieldValue('turno', event.target.value ?? '');
                  }}
                >
                  <MenuItem value={"DÍA"}>DÍA</MenuItem>
                  <MenuItem value={"TARDE"}>TARDE</MenuItem>
                  <MenuItem value={"NOCHE"}>NOCHE</MenuItem>
                </Select>
              </FormControl>
            </Grid>        

          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CentralComunicacionesForm;
