import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const LineChart = (props) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const labels = Object.keys(props.data).map((key) => Number(key));
    const data = Object.keys(props.data).map((key) => ({
      x: Number(key),
      y: props.data[key].intensity.compound,
    }));
    new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: props.title,
            fill: true,
            data,
            backgroundColor: props.color,
          },
        ],
      },
      options: {
        labelString: 'test',
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: -1,
                suggestedMax: 1,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return 'week ' + value;
                },
              },
            },
          ],
        },
      },
    });
  }, [canvasRef, props.data, props.title, props.color]);
  return <canvas ref={canvasRef} />;
};

export default LineChart;
