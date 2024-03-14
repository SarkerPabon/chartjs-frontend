"use clinet";
import { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";

export default function BarChartThree() {
	const chartRef = useRef(null);
	const [answerFour, setAnswerFour] = useState([]);
	const [total, setTotal] = useState();
	const [participants, setParticipants] = useState();
	const [selectedChart, setSelectedChart] = useState("horizontal");
	const [type, setType] = useState("bar");
	const [selectTable, setSelectTable] = useState(false);
	const [sorted, setSorted] = useState([]);
	const [isSort, setIsSort] = useState(false);
	const [qustionFour, setQustionFour] = useState({});
	const [percentage, setPercentage] = useState();
	const [perRespondent, setPerRespondent] = useState();

	const handleSort = () => {
		setIsSort(!isSort);

		// console.log(isSort);

		if (!isSort) {
			console.log(
				Object.fromEntries(
					Object.entries(answerFour).sort(([, a], [, b]) => b - a)
				)
			);
			setSorted(
				Object.fromEntries(
					Object.entries(answerFour).sort(([, a], [, b]) => b - a)
				)
			);
		} else {
			setSorted(answerFour);
		}

		// console.log("sorted: ", sorted);
	};

	const handleTableChange = () => {
		setSelectTable(!selectTable);
	};

	const handleChartChange = (event) => {
		let type = "bar";
		if (
			event.target.value === "horizontal" ||
			event.target.value === "vertical"
		) {
			type = "bar";
		} else if (event.target.value === "pie") {
			type = "pie";
		} else if (event.target.value === "spider") {
			type = "radar";
		}
		setSelectedChart(event.target.value);
		setType(type);
		console.log(selectedChart);
		console.log(type);
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios(
				"https://chartjs-backend-ten.vercel.app/chart-three"
			);

			if (response.status !== 200) {
				console.error("Bad Response");
			}

			const {
				groupedByAnswerFour,
				total,
				participants,
				qustionFour,
				percentage,
				perRespondent,
			} = response.data;
			// console.log("GroupedByAnswerFour: ", groupedByAnswerFour);
			// console.log("Total: ", total);
			setAnswerFour(groupedByAnswerFour);
			setTotal(total);
			setParticipants(participants);
			setSorted(groupedByAnswerFour);
			setQustionFour(qustionFour);
			setPercentage(percentage);
			setPerRespondent(perRespondent);

			// console.log("answerFour: ", answerFour);
			// console.log("total: ", total);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (chartRef.current) {
			if (chartRef.current.chart) {
				chartRef.current.chart.destroy();
			}

			const context = chartRef.current.getContext("2d");

			// TopLabels Plugin Block
			const topLabels = {
				id: "topLabels",
				afterDatasetsDraw(chart, args, pluginOptions) {
					const {
						ctx,
						scales: { x, y },
					} = chart;
					// console.log("topLabels ctx: ", ctx);
					// console.log(chart.getDatasetMeta(1));

					// console.log("Test Data: ", chart.data.datasets[0]);

					chart.data.datasets[0].data.forEach((datapoint, index) => {
						// console.log("DataPoint: ", datapoint);

						// const datasetArray = [];

						ctx.font = "bold 12px sans-serif";
						// ctx.fillStyle = "rgba(255, 26, 104, 1)";
						ctx.fillStyle = "rgba(0, 0, 0, 1)";
						ctx.textAllign = "center";
						ctx.fillText(
							((datapoint / participants) * 100).toFixed(1) + "%",
							x.getPixelForValue(index),
							chart.getDatasetMeta(0).data[index].y - 10
						);
					});
				},
			};

			const data = {
				labels: Object.keys(answerFour).map((obj) =>
					obj.length > 15 ? obj.slice(0, 15) + " ...." : obj
				),
				datasets: [
					{
						label: "General Info",
						data: Object.values(answerFour),

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
						// borderWidth: 1,
						// barThickness: 30,
						borderSkipped: false,
						borderRadius: {
							topLeft: 5,
							topRight: 5,
							bottomLeft: 0,
							bottomRight: 0,
						},
					},
				],
			};

			const options = {
				plugins: {
					title: {
						display: true,
						text: "General Info",
					},
				},
				layout: {
					// padding: 40,
				},
				responsive: true,
				indexAxis: selectedChart === "vertical" ? "y" : null,
				scales:
					type === "bar"
						? {
								x: {
									grace: 1,
								},
								y: {
									grace: 1,
									beginAtZero: true,
								},
						  }
						: null,
			};

			const newChart = new Chart(context, {
				type: type,
				data,
				options,
				plugins: selectedChart === "horizontal" ? [topLabels] : null,
			});

			chartRef.current.chart = newChart;
		}
	}, [answerFour, total, selectedChart, selectTable, sorted]);

	return (
		<>
			<div className='flex flex-col justify-center items-center'>
				<h3>Question: {qustionFour.question}</h3>
				<div>
					<span>{participants} Participants | </span>{" "}
					<span>({percentage}%) |</span>
					<span> {total} Answers |</span>
					<span> {perRespondent} Answers Per Respondent </span>
				</div>
			</div>
			<div className='mt-10'>
				<div className='flex justify-center items-center mb-10 gap-10'>
					<label htmlFor='checkbox' className='ml-2 text-gray-700'>
						Sort
					</label>
					<input
						type='checkbox'
						id='checkbox'
						checked={isSort}
						onChange={handleSort}
						className='h-4 w-4 text-blue-500 focus:ring-blue-400 focus:ring-offset-0 focus:ring-2 focus:outline-none border-gray-300 rounded cursor-pointer'
					/>
					<label htmlFor='checkbox' className='ml-2 text-gray-700'>
						Table
					</label>
					<input
						type='checkbox'
						id='checkbox'
						checked={selectTable}
						onChange={handleTableChange}
						className='h-4 w-4 text-blue-500 focus:ring-blue-400 focus:ring-offset-0 focus:ring-2 focus:outline-none border-gray-300 rounded cursor-pointer'
					/>

					<label htmlFor='chart-select' className='mb-2 font-medium mr-4'>
						Select Chart Type:
					</label>
					<select
						id='chart-select'
						value={selectedChart}
						onChange={handleChartChange}
						className='px-4 py-2 border rounded-md outline-none focus:border-blue-500'
					>
						<option value=''>Select...</option>
						<option value='bar'>Horizontal Bar Chart</option>
						<option value='vertical'>Vertical Bar Chart</option>
						<option value='pie'>Pie Chart</option>
						<option value='spider'>Spider Chart</option>
					</select>
				</div>
				<div className='block md:flex gap-4'>
					<div
						className={`relative w-full ${
							!selectTable ? "h-[80vh] flex justify-center items-center" : null
						}`}
					>
						{/* Canvas */}
						<canvas ref={chartRef} />
					</div>
					{selectTable ? (
						<table className='w-full border-collapse border border-gray-300'>
							<thead>
								<tr>
									<th className='border border-gray-300 px-4 py-2'>Answer</th>
									<th className='border border-gray-300 px-4 py-2'>Response</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(answerFour).map(([answer, response]) => (
									<tr key={answer}>
										<td className='border border-gray-300 px-4 py-2'>
											{answer}
										</td>
										<td className='border border-gray-300 px-4 py-2'>
											{response}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : null}
				</div>
			</div>
		</>
	);
}
