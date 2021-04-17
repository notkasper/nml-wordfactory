import { Chart } from 'react-chartjs-2';

const extendChart = () => {
  const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
  Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
    draw: function () {
      originalDoughnutDraw.apply(this, arguments);

      if (this.chart.config.options.elements.center) {
        const chart = this.chart.chart;
        const { text, color } = this.chart.config.options.elements.center;
        const { ctx, width, height } = chart;
        const fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + 'em Verdana';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;

        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
      }
    },
  });
};

export default extendChart;
