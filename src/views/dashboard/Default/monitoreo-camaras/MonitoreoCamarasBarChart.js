import React from 'react';
// third-party
import Chart from 'react-apexcharts';


// ==============================|| MonitoreoCamarasBarChart Component ||============================== //
const MonitoreoCamarasBarChart = ({ optionsChart, seriesChart }) => {
    return (
        <div style={{ marginTop: '20px', paddingBottom: '20px' }}>
            <Chart
                options={optionsChart}
                series={seriesChart}
                type="bar"
            // width="500"
            />
        </div>
    )
}

export default MonitoreoCamarasBarChart