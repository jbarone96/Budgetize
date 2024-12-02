import React from "react";
import ReactApexChart from "react-apexcharts";

const Chart = ({ transactions }) => {
  const chartData = {
    options: {
      chart: {
        id: "basic-line", //Change ID if needed.
        toolbar: {
          //Show/Hide Chart toolbar
          show: false,
        },
      },
      xaxis: {
        // Update this to pie chart
        categories: transactions.map((transaction) => {
          transaction.data;
        }),
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["var(--primary-purple"],
    },
    series: [
      {
        name: "Amount",
        data: transactions.map((transaction) => {
          transaction.amount;
        }),
      },
    ],
  };

  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="line"
      height={350}
    />
  );
};

export default Chart;
