"use clinet";
import { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";

export default function BarChartOne() {
	const chartRef = useRef(null);
	const [male, setMale] = useState([]);
	const [female, setFemale] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios(
				"https://chartjs-backend-ten.vercel.app/chart-one"
			);

			if (response.status !== 200) {
				console.error("Bad Response");
			}

			const { sortedMaleByAge, sortedFemaleByAge } = response.data;
			// console.log("Male Data: ", sortedMaleByAge);
			// console.log("Female Data: ", sortedFemaleByAge);
			setMale(sortedMaleByAge);
			setFemale(sortedFemaleByAge);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (chartRef.current) {
			if (chartRef.current.chart) {
				chartRef.current.chart.destroy();
			}

			const context = chartRef.current.getContext("2d");

			const data = {
				labels: Object.keys(male),
				datasets: [
					{
						label: "Male",
						data: Object.values(male),
						backgroundColor: ["rgb(54, 162, 235, 0.2)"],
						borderColor: ["rgb(54, 162, 235)"],
						// borderWidth: 1,
						borderSkipped: false,
						borderRadius: {
							topLeft: 10,
							topRight: 10,
							bottomLeft: 10,
							bottomRight: 10,
						},
						barThickness: 30,
					},
					{
						label: "Female",
						data: Object.values(female),
						borderRadius: 10,
						borderSkipped: false,
						backgroundColor: ["rgba(0, 0, 0, 0.2)"],
						borderColor: ["rgba(0, 0, 0, 1)"],
						// borderWidth: 1,
						barThickness: 30,
					},
				],
			};

			const options = {
				plugins: {
					title: {
						display: true,
						text: "Age and Gender Info",
					},
					tooltip: {
						displayColors: false,
						bodyAlign: "left",

						callbacks: {
							label: function (ctx) {
								return null;
							},
							afterBody: (context) => {
								// console.log(data);
								let label = "";
								let total = 0;

								data.datasets.forEach((dataset) => {
									total += dataset.data[context[0].dataIndex];
								});
								data.datasets.forEach((dataset, index) => {
									const value = dataset.data[context[0].dataIndex];
									const percentage = ((value / total) * 100).toFixed(1);
									label += `${dataset.label}: ${value} (${percentage}%)`;
									if (index < data.datasets.length - 1) {
										label += "\n";
									}
								});
								label += "\n";
								label += `Total: ${total}`;
								return label;
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
						stacked: true,
						// grace: 2,
					},
					y: {
						stacked: true,
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
	}, [male, female]);

	return (
		<div className='relative w-full h-[80vh] flex justify-center items-center'>
			<canvas ref={chartRef} />
		</div>
	);
}
