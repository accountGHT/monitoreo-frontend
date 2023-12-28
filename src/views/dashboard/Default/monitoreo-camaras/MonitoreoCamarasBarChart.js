import React, { useEffect, useState } from 'react';

// third-party
import Chart from 'react-apexcharts';
// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dayjs from 'dayjs';

// APIs
import { getDataForChartMonitoreoCamaras } from 'api/monitoreo-camaras/monitoreoCamarasApi';

// ==============================|| MonitoreoCamarasBarChart Component ||============================== //
// const MonitoreoCamarasBarChart = ({ onSubmit, filters }) => {
const MonitoreoCamarasBarChart = ({ filters }) => {
    console.log(`MonitoreoCamarasBarChart filters`, filters);

    const [isLoading, setLoading] = useState(true);
    // Chart
    const [optionsChart, setOptionsChart] = useState({});
    const [seriesChart, setSeriesChart] = useState([]);

    const payloadFormated = (values) => {
        const payload = {
            fecha_inicio: dayjs(values.fecha_inicio).format('YYYY-MM-DD'),
            fecha_fin: dayjs(values.fecha_fin).format('YYYY-MM-DD'),
            zonas: values.zonas ?? [],
            turno: values.turno === 'TODOS' ? '' : values.turno,
        }
        return payload;
    }

    const setDataDashboard = (dataChartCategories, dataChart) => {
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
        const fetchData = async () => {
            let dataChartCategories = [];
            let dataChart = [];

            if (Object.entries(filters).length > 0) {
                const payload = payloadFormated(filters);
                if (payload.zonas.length > 0) {
                    const idsArray = payload.zonas.map(item => item.id);
                    payload.zonas = idsArray;
                }

                const resp = await getDataForChartMonitoreoCamaras(payload);
                if (resp.success) {
                    resp.data.forEach((el) => {
                        dataChartCategories.push(el.tipo_incidencia.nombre);
                        dataChart.push(el.cantidad_incidencias);
                    });
                } else {
                    toast.error(resp.responseData.message ?? resp.errorMessage);
                }
                setDataDashboard(dataChartCategories, dataChart);
                setLoading(false);
            } else {
                setDataDashboard(dataChartCategories, dataChart);
                setLoading(false);
            }
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