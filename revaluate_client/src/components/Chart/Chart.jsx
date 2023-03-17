import React from "react";
import "./chart.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar, Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function Chart(props) {
    const { type, data, title, labels, hideLegends, width, height } = props;

    const options = {
        responsive: true,
        plugins: {
            legend: {display: !hideLegends},
            title: {
                display: true,
                text: title,
                font: {
                    fontFamily: "Open Sans",
                    size: "20%",
                }
            }
        },
        maintainAspectRatio: false,
    };

    const chartData = {
        labels,
        datasets: data,
    };

    return <div className="chart" style={{width: width, height: height}} >
        {type === "bar" && <Bar options={options} data={chartData} />}
        {type === "line" && <Line options={options} data={chartData} />}
    </div>
}

export default Chart;