import React, { useEffect, useState } from 'react';

// third-party
import Chart from 'react-apexcharts';
// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';

import dayjs from 'dayjs';

// APIs
import { getDataForChartMonitoreoCamaras } from 'api/monitoreo-camaras/monitoreoCamarasApi';


// ==============================|| MonitoreoCamarasBarChart Component ||============================== //
const MonitoreoCamarasBarChart = ({ filters }) => {

    const [isLoading, setLoading] = useState(true);

    // Chart
    const [optionsChart, setOptionsChart] = useState({});
    const [seriesChart, setSeriesChart] = useState([]);

    const payloadFormated = (values) => {
        console.log(`setDataForAPI`, values);
        const payload = {
            fecha_inicio: dayjs(values.fecha_inicio).format('YYYY-MM-DD'),
            fecha_fin: dayjs(values.fecha_fin).format('YYYY-MM-DD'),
            zona: null,
            turno: values.turno === 'TODOS' ? '' : values.turno,
        }
        return payload;
    }

    useEffect(() => {
        const fetchData = async () => {
            const payload = payloadFormated(filters);
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
            setLoading(false);
        };


        fetchData();
    }, [filters]);


    return (
        <>
            {
                isLoading ? (
                    <SkeletonTotalGrowthBarChart />
                ) : (
                    <div style={{ paddingBottom: '20px' }}>
                        <Chart
                            options={optionsChart}
                            series={seriesChart}
                            type="bar"
                        // width="500"
                        />
                    </div>
                )
            }
        </>
    )
}

export default MonitoreoCamarasBarChart