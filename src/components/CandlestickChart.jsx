import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CandlestickChart = ({ data }) => {
  const series = [{
    data: data.map(day => ({
      x: new Date(day.time),
      y: [day.open, day.high, day.low, day.close]
    }))
  }];

  const options = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <ReactApexChart options={options} series={series} type="candlestick" height={400} />
  );
};

export default CandlestickChart;
