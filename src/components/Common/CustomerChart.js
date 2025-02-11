import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function CustomerChart({ data }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Customers',
                data: [],
                backgroundColor: '#D9DFE3',
            },
        ],
    });

    useEffect(() => {
        setChartData({
            labels: data?.labels || [],
            datasets: [
                {
                    label: 'Total Customers',
                    data: data.data,
                    backgroundColor: '#D9DFE3',
                },
            ],
        });
    }, [data]);

    useEffect(() => {
        // Chart.register(ChartDataLabels);
        setChartData(chartData);
    }, []);

    console.log(chartData, 'chartData');

    return (
        <div>
            <div>
                <div id="chart"></div>
                <Bar
                    data={chartData}
                    // height="400px"
                    width="500px"
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Customer Stats',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
