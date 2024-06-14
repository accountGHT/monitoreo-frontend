import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

// third-party
import Chart from 'react-apexcharts';

// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// APIs
import { getDataForChartDistribucionPersonal } from 'api/distribucion-personal/distribucionPersonalApi';


// ==============================|| DistribucionPersonalBarChart Component ||============================== //
const DistribucionPersonalBarChart = ({ filters }) => {
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
            let dataChartCategories = [];
            let dataChart = [];
            const payload = payloadFormated(filters);
            const resp = await getDataForChartDistribucionPersonal(payload);
            console.log(`resp`, resp);

            if(resp.success) {
                resp.data.forEach((el) => {
                    dataChartCategories.push(el.tipo_patrullaje.nombre);
                    dataChart.push(el.tipo_patrullaje_cantidad);
                });
            } else {
                toast.error(resp.responseData.message ?? resp.errorMessage);
            }

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
        };

        fetchData();
    }, [filters]);

    return (
        <div style={{ paddingBottom: '20px' }}>
            <Chart
                options={optionsChart}
                series={seriesChart}
                type="bar" // width="500"
            />
        </div>
    )
}

export default DistribucionPersonalBarChart;