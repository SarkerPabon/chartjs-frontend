"use clinet";
import { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";

export default function BarChartTwo() {
	const chartRef = useRef(null);
	const [labels, setLabels] = useState([]);
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios(
				"https://chartjs-backend-ten.vercel.app/chart-two"
			);

			if (response.status !== 200) {
				console.error("Bad Response");
			}

			const { labels, locations } = response.data;
			// console.log("Labels: ", labels);
			// console.log("Locations: ", locations);
			setLabels(labels);
			setLocations(locations);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (chartRef.current) {
			if (chartRef.current.chart) {
				chartRef.current.chart.destroy();
			}

			const context = chartRef.current.getContext("2d");

			const totalCount = 500;
			const data = {
				labels: labels,
				datasets: [
					{
						label: "Locations",
						data: Object.values(locations),

						borderRadius: 16,
						borderSkipped: false,
						backgroundColor: [
							"rgba(255, 26, 104, 0.2)",
							"rgba(54, 162, 235, 0.2)",
							"rgba(255, 206, 86, 0.2)",
							"rgba(75, 192, 192, 0.2)",
							"rgba(153, 102, 255, 0.2)",
							"rgba(255, 159, 64, 0.2)",
							"rgba(0, 0, 0, 0.2)",
						],
						borderColor: [
							"rgba(255, 26, 104, 1)",
							"rgba(54, 162, 235, 1)",
							"rgba(255, 206, 86, 1)",
							"rgba(75, 192, 192, 1)",
							"rgba(153, 102, 255, 1)",
							"rgba(255, 159, 64, 1)",
							"rgba(0, 0, 0, 1)",
						],
						borderWidth: 1,
						barThickness: 30,
					},
				],
			};

			const options = {
				plugins: {
					title: {
						display: true,
						text: "Locations Info",
					},
					tooltip: {
						displayColors: false,
						callbacks: {
							label: function (ctx) {
								// console.log("ctx: ", ctx);
								const percentage = ((ctx.raw / totalCount) * 100).toFixed(1);
								return `Amount: ${ctx.formattedValue} (${percentage} %)`;
							},
							footer: (ctx) => {
								return `Total: ${totalCount}`;
							},
						},
					},
				},
				layout: {
					padding: 40,
				},
				responsive: true,
				indexAxis: "y",
				scales: {
					x: {
						grace: 1,
					},
					y: {
						beginAtZero: true,
					},
				},
			};

			const newChart = new Chart(context, {
				type: "bar",
				data,
				options,
			});

			chartRef.current.chart = newChart;
		}
	}, [labels, locations]);

	return (
		<div className='relative w-full h-[80vh] flex justify-center items-center'>
			<canvas ref={chartRef} />
		</div>
	);
}
