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
import { getDataForChartDistribucionPersonal } from 'api/distribucion-personal/distribucionPersonalApi';

// ==============================|| DistribucionPersonalBarChart Component ||============================== //
const DistribucionPersonalBarChart = ({ filters }) => {
    console.log(`DistribucionPersonalBarChart filters`, filters);

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
                name: "Tipo Patrullaje",
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

                const resp = await getDataForChartDistribucionPersonal(payload);
                console.log(`resp`, resp);

                if (resp.success) {
                    resp.data.forEach((el) => {
                        dataChartCategories.push(el.tipo_patrullaje.nombre);
                        dataChart.push(el.tipo_patrullaje_cantidad);
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

export default DistribucionPersonalBarChart;