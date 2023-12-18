import { DataGrid } from '@mui/x-data-grid';
import { getTablaGrafico } from 'api/monitoreo-camaras/monitoreoCamarasApi';
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types'

const MonitoreoCamarasTable = ({ fechaInicio, fechaFin, turno }) => {

    const [data, setData] = useState([]);


    const fillTable = async (params) => {
        const response = await getTablaGrafico(params);
        console.log(response);
        setData(response.data.data);
    }

    const columns = [
        { field: 'id', headerName: 'Id', width: 30 },
        { field: 'fecha', headerName: 'Fecha', width: 95 },
        { field: 'hora_inicio', headerName: 'Hora inicio', width: 75 },
        { field: 'hora_fin', headerName: 'Hora fin', width: 75 },
        // { field: 'turno', headerName: 'Turno', width: 70 },
        { field: 'descripcion_incidencia', headerName: 'Descripción Incidencia', width: 200 },
        {
            field: 'zona',
            headerName: 'Zona',
            width: 100,
            renderCell: (params) => {
                return params.row.zona.nombre; // Accede a la propiedad 'nombre' de la propiedad 'zona' del objeto
            }
        },
        { field: 'camara_nombre', headerName: 'Cámara', width: 100 },
        {
            field: 'operador_camaras',
            headerName: 'Operador de cámaras',
            width: 200,
            renderCell: (params) => {
                return params.row.operador_camaras.nombres + ' ' + params.row.personal_serenazgo.p_apellido;
            }
        },
        {
            field: 'tipo_incidencia',
            headerName: 'Tipo de Incidencia',
            width: 150,
            renderCell: (params) => {
                return params.row.tipo_incidencia.nombre; // Accede a la propiedad 'nombre' de la propiedad 'tipo_incidencia' del objeto
            }
        },
        {
            field: 'personal_serenazgo',
            headerName: 'Personal de Serenazgo',
            width: 200,
            renderCell: (params) => {
                return params.row.personal_serenazgo.nombres + ' ' + params.row.personal_serenazgo.p_apellido;
            }
        },
        {
            field: 'vehiculo_serenazgo',
            headerName: 'Vehiculo de Serenazgo',
            width: 200,
            renderCell: (params) => {
                return params.row.vehiculo_serenazgo.placa;
            }
        },

        {
            field: 'encargado',
            headerName: 'Encargado',
            width: 200,
            renderCell: (params) => {
                return params.row.encargado.nombres + ' ' + params.row.encargado.p_apellido;
            }
        },
    ];

    useEffect(() => {
        let params = `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

        if (turno !== '') {
            params = params + `&turno=${turno}`;
        }

        if (zona !== null) {
            // params = params + `&turno=${turno}`;
        }

        fillTable(params);
    }, [fechaInicio, fechaFin, turno]);

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={data} columns={columns} pageSize={10} />
        </div>
    )
}

// MonitoreoCamarasTable.propTypes = {}

export default MonitoreoCamarasTable;