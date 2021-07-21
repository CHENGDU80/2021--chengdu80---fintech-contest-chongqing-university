
// Convert json to 2D array
function formatDoubleDimensional(arr) {
	var result = []
	console.log(arr.length)
	for (var i = 0; i < arr.length; i++) {
		var tmpArr = []
		for (var attr in arr[i]) {
			var value = arr[i][attr]
			if (attr != "data") {
				value = parseFloat(value)
			}
			tmpArr.push(value)
		}
		result[i] = tmpArr
	}
	return result
};

// 将category头部 和 float数据分开
function splitData(rawData) {
	var categoryData = [];
	var values = []
	for (var i = 0; i < rawData.length; i++) {
		categoryData.push(rawData[i].splice(0, 1)[0]);
		values.push(rawData[i])
	}
	return {
		categoryData: categoryData,
		values: values
	};
}

// 计算MA值
function calculateMA(data, dayCount) {
	var result = [];
	for (var i = 0, len = data.length; i < len; i++) {
		if (i < dayCount) {
			result.push('-');
			continue;
		}
		var sum = 0;
		for (var j = 0; j < dayCount; j++) {
			// 以开盘价计算
			sum += data[i - j][1];
		}
		result.push(sum / dayCount);
	}
	return result;
}


$('#history_button').click(function () {
	var name = $('#company_name_input').val();
	name = name.replace(/^\s*|\s*$/g, "");
	if (name.length == 0) {
		alert('Please input a valid company name!');
		return;
	}

	var btn = document.getElementById("predict_button");
	// btn.style.display = "block";
	btn.removeAttribute('disabled');
	// btn.attr('disabled')="";


	// alert(name)
	$.post(
		"/static_k_data",
		{ "company_name": name },
		function (data, status) {
			var my_k_chart = echarts.init(document.getElementById('chart_lstm'))

			// 指定图表的配置项和数据
			var upColor = '#ec0000';
			var upBorderColor = '#8A0000';
			var downColor = '#00da3c';
			var downBorderColor = '#008F28';

			function splitData(rawData) {
				var categoryData = [];
				var values = []
				for (var i = 0; i < rawData.length; i++) {
					categoryData.push(rawData[i].splice(0, 1)[0]);
					values.push(rawData[i])
				}
				return {
					categoryData: categoryData,
					values: values
				};
			}

			function calculateMA(dayCount, data) {
				var result = [];
				for (var i = 0, len = data.values.length; i < len; i++) {
					if (i < dayCount) {
						result.push('-');
						continue;
					}
					var sum = 0;
					for (var j = 0; j < dayCount; j++) {
						sum += data.values[i - j][1];
					}
					result.push(sum / dayCount);
				}
				return result;
			}
			data = JSON.parse(data)
			data = formatDoubleDimensional(data)
			data = splitData(data)
			option = {
				title: {
					text: 'Stock Momentum',
					left: 0
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					}
				},
				legend: {
					data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
				},
				grid: {
					left: '10%',
					right: '10%',
					bottom: '15%'
				},
				xAxis: {
					type: 'category',
					data: data.categoryData,
					scale: true,
					boundaryGap: false,
					axisLine: { onZero: false },
					splitLine: { show: false },
					splitNumber: 20,
					min: 'dataMin',
					max: 'dataMax'
				},
				yAxis: {
					scale: true,
					splitArea: {
						show: true
					}
				},
				dataZoom: [
					{
						type: 'inside',
						start: 50,
						end: 100
					},
					{
						show: true,
						type: 'slider',
						top: '90%',
						start: 50,
						end: 100
					}
				],
				series: [
					{
						name: '日K',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: upBorderColor,
							borderColor0: downBorderColor
						},
						markPoint: {
							label: {
								normal: {
									formatter: function (param) {
										return param != null ? Math.round(param.value) : '';
									}
								}
							},
							data: [
								{
									name: 'XX标点',
									coord: ['2013/5/31', 2300],
									value: 2300,
									itemStyle: {
										color: 'rgb(41,60,85)'
									}
								},
								{
									name: 'highest value',
									type: 'max',
									valueDim: 'highest'
								},
								{
									name: 'lowest value',
									type: 'min',
									valueDim: 'lowest'
								},
								{
									name: 'average value on close',
									type: 'average',
									valueDim: 'close'
								}
							],
							tooltip: {
								formatter: function (param) {
									return param.name + '<br>' + (param.data.coord || '');
								}
							}
						},
						markLine: {
							symbol: ['none', 'none'],
							data: [
								[
									{
										name: 'from lowest to highest',
										type: 'min',
										valueDim: 'lowest',
										symbol: 'circle',
										symbolSize: 10,
										label: {
											show: false
										},
										emphasis: {
											label: {
												show: false
											}
										}
									},
									{
										type: 'max',
										valueDim: 'highest',
										symbol: 'circle',
										symbolSize: 10,
										label: {
											show: false
										},
										emphasis: {
											label: {
												show: false
											}
										}
									}
								],
								{
									name: 'min line on close',
									type: 'min',
									valueDim: 'close'
								},
								{
									name: 'max line on close',
									type: 'max',
									valueDim: 'close'
								}
							]
						}
					},
					{
						name: 'MA5',
						type: 'line',
						data: calculateMA(5, data.values),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA10',
						type: 'line',
						data: calculateMA(10, data.values),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA20',
						type: 'line',
						data: calculateMA(20, data.values),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},
					{
						name: 'MA30',
						type: 'line',
						data: calculateMA(30, data.values),
						smooth: true,
						lineStyle: {
							opacity: 0.5
						}
					},

				]
			};
			my_k_chart.setOption(option)
		})
})

$('#predict_button').click(function () {
	var name = $('#company_name_input').val()
	// alert(name)
	$.post(
		"/predict_company_data",
		{ "company_name": name },
		function (data, status) {
			var my_k_chart_predict = echarts.init(document.getElementById('chart_lstm_predict'))
			data = JSON.parse(data)
			var ori_data = data.orgin
			var pre_data = data.predict
			var category_data = []
			var ori_close = []
			var predict_close = []
			ori_data = formatDoubleDimensional(ori_data)
			for (var i = 0; i < ori_data.length; i++) {
				category_data.push(ori_data[i][0])
				ori_close.push(ori_data[i][2])
				predict_close.push(ori_data[i][2])
			}
			for (var i = ori_data.length - 15, j = 0; i < ori_data.length, j < pre_data.length; i++, j++) {
				predict_close[i] = pre_data[j]
			}
			option_predict = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					}
				},
				legend: {
					data: ['origin', 'prediction']
				},
				grid: {
					left: '10%',
					right: '10%',
					bottom: '15%'
				},
				xAxis: {
					type: 'category',
					data: category_data,
					scale: true,
					boundaryGap: false,
					axisLine: { onZero: false },
					splitLine: { show: false },
					splitNumber: 20,
					min: 'dataMin',
					max: 'dataMax'
				},
				yAxis: {
					scale: true,
					splitArea: {
						show: true
					}
				},
				dataZoom: [
					{
						type: 'inside',
						start: 50,
						end: 100
					},
					{
						show: true,
						type: 'slider',
						top: '90%',
						start: 80,
						end: 100
					}
				],
				series: [{
					name: 'origin',
					data: ori_close,
					type: 'line',
					smooth: true
				},
				{
					name: 'prediction',
					data: predict_close,
					type: 'line',
					smooth: true
				}]
			};
			my_k_chart_predict.setOption(option_predict)
		})
	$.post(
		'/show_company_relation',
		{ "company_name": name },
		function (data, status) {
			data = JSON.parse(data)
			var company_category = []
			var company_value = []
			for (var x in data) {
				company_category.push(x)
				company_value.push(data[x])
			}
			var company_relation_bar = echarts.init(document.getElementById('chart_company_ralation'))
			company_relation_bar_option = {
				// color: ['#3398DB'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: company_category,
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				color: 'rgb(0,123,255)',
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						// name: '直接访问',
						type: 'bar',
						barWidth: '60%',
						data: company_value
					}
				]
			};

			// company_relation_bar_option = {
			// 	xAxis: {
			// 		type: 'category',
			// 		data: company_category
			// 	},
			// 	yAxis: {
			// 		type: 'value'
			// 	},
			// 	color: 'rgb(0,123,255)',
			// 	series: [{
			// 		data: company_value,
			// 		type: 'bar',
			// 		showBackground: true,
			// 		backgroundStyle: {
			// 			color: 'rgba(220, 220, 220, 0.8)'
			// 		}
			// 	}]
			// };
			company_relation_bar.setOption(company_relation_bar_option)

		}
	)

	$.post(
		'/show_kd',
		{ "company_name": name },
		function (data, status) {
			data = JSON.parse(data)
			var company_category = data['features'];
			var company_value = data['weight'];
			// for (var x in data) {
			// 	company_category.push(x)
			// 	company_value.push(data[x])
			// }
			var company_relation_bar = echarts.init(document.getElementById('ichart6'))
			company_relation_bar_option = {
				// color: ['#3398DB'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: company_category,
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				color: 'rgb(0,123,255)',
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						// name: '直接访问',
						type: 'bar',
						barWidth: '60%',
						data: company_value
					}
				]
			};

			company_relation_bar.setOption(company_relation_bar_option)

		}
	)

})
//origin_js_end


var name = "A"

$.post(
	"/static_k_data",
	{ "company_name": name },
	function (data, status) {
		var my_k_chart = echarts.init(document.getElementById('chart_lstm'))

		// 指定图表的配置项和数据
		var upColor = '#ec0000';
		var upBorderColor = '#8A0000';
		var downColor = '#00da3c';
		var downBorderColor = '#008F28';

		data = JSON.parse(data)
		data = formatDoubleDimensional(data)
		data = splitData(data)
		option = {
			title: {
				text: 'Stock Momentum',
				left: 0
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			legend: {
				data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
			},
			grid: {
				left: '10%',
				right: '10%',
				bottom: '15%'
			},
			xAxis: {
				type: 'category',
				data: data.categoryData,
				scale: true,
				boundaryGap: false,
				axisLine: { onZero: false },
				splitLine: { show: false },
				splitNumber: 20,
				min: 'dataMin',
				max: 'dataMax'
			},
			yAxis: {
				scale: true,
				splitArea: {
					show: true
				}
			},
			dataZoom: [
				{
					type: 'inside',
					start: 50,
					end: 100
				},
				{
					show: true,
					type: 'slider',
					top: '90%',
					start: 50,
					end: 100
				}
			],
			series: [
				{
					name: '日K',
					type: 'candlestick',
					data: data.values,
					itemStyle: {
						color: upColor,
						color0: downColor,
						borderColor: upBorderColor,
						borderColor0: downBorderColor
					},
					markPoint: {
						label: {
							normal: {
								formatter: function (param) {
									return param != null ? Math.round(param.value) : '';
								}
							}
						},
						data: [
							{
								name: 'XX标点',
								coord: ['2013/5/31', 2300],
								value: 2300,
								itemStyle: {
									color: 'rgb(41,60,85)'
								}
							},
							{
								name: 'highest value',
								type: 'max',
								valueDim: 'highest'
							},
							{
								name: 'lowest value',
								type: 'min',
								valueDim: 'lowest'
							},
							{
								name: 'average value on close',
								type: 'average',
								valueDim: 'close'
							}
						],
						tooltip: {
							formatter: function (param) {
								return param.name + '<br>' + (param.data.coord || '');
							}
						}
					},
					markLine: {
						symbol: ['none', 'none'],
						data: [
							[
								{
									name: 'from lowest to highest',
									type: 'min',
									valueDim: 'lowest',
									symbol: 'circle',
									symbolSize: 10,
									label: {
										show: false
									},
									emphasis: {
										label: {
											show: false
										}
									}
								},
								{
									type: 'max',
									valueDim: 'highest',
									symbol: 'circle',
									symbolSize: 10,
									label: {
										show: false
									},
									emphasis: {
										label: {
											show: false
										}
									}
								}
							],
							{
								name: 'min line on close',
								type: 'min',
								valueDim: 'close'
							},
							{
								name: 'max line on close',
								type: 'max',
								valueDim: 'close'
							}
						]
					}
				},
				{
					name: 'MA5',
					type: 'line',
					data: calculateMA(data.values, 5),
					smooth: true,
					lineStyle: {
						opacity: 0.5
					}
				},
				{
					name: 'MA10',
					type: 'line',
					data: calculateMA(data.values, 10),
					smooth: true,
					lineStyle: {
						opacity: 0.5
					}
				},
				{
					name: 'MA20',
					type: 'line',
					data: calculateMA(data.values, 20),
					smooth: true,
					lineStyle: {
						opacity: 0.5
					}
				},
				{
					name: 'MA30',
					type: 'line',
					data: calculateMA(data.values, 30),
					smooth: true,
					lineStyle: {
						opacity: 0.5
					}
				},

			]
		};
		my_k_chart.setOption(option);
		window.onresize = function () {
			my_k_chart.resize();
		};
	}
)


// alert(name)
$.post(
	"/predict_company_data",
	{ "company_name": name },
	function (data, status) {
		var my_k_chart_predict = echarts.init(document.getElementById('chart_lstm_predict'))
		data = JSON.parse(data)
		var ori_data = data.orgin
		var pre_data = data.predict
		var category_data = []
		var ori_close = []
		var predict_close = []
		ori_data = formatDoubleDimensional(ori_data)
		for (var i = 0; i < ori_data.length; i++) {
			category_data.push(ori_data[i][0])
			ori_close.push(ori_data[i][2])
			predict_close.push(ori_data[i][2])
		}
		for (var i = ori_data.length - 15, j = 0; i < ori_data.length, j < pre_data.length; i++, j++) {
			predict_close[i] = pre_data[j]
		}
		option_predict = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			legend: {
				data: ['origin', 'prediction']
			},
			grid: {
				left: '10%',
				right: '10%',
				bottom: '15%'
			},
			xAxis: {
				type: 'category',
				data: category_data,
				scale: true,
				boundaryGap: false,
				axisLine: { onZero: false },
				splitLine: { show: false },
				splitNumber: 20,
				min: 'dataMin',
				max: 'dataMax'
			},
			yAxis: {
				scale: true,
				splitArea: {
					show: true
				}
			},
			dataZoom: [
				{
					type: 'inside',
					start: 50,
					end: 100
				},
				{
					show: true,
					type: 'slider',
					top: '90%',
					start: 80,
					end: 100
				}
			],
			series: [{
				name: 'origin',
				data: ori_close,
				type: 'line',
				smooth: true
			},
			{
				name: 'prediction',
				data: predict_close,
				type: 'line',
				smooth: true
			}]
		};
		my_k_chart_predict.setOption(option_predict);
		window.onresize = function () {
			my_k_chart_predict.resize();
		};
	})

$.post(
	'/show_company_relation',
	{ "company_name": name },
	function (data, status) {
		data = JSON.parse(data)
		var company_category = []
		var company_value = []
		for (var x in data) {
			company_category.push(x)
			company_value.push(data[x])
		}
		var company_relation_bar = echarts.init(document.getElementById('chart_company_ralation'))
		company_relation_bar_option = {
			// color: ['#3398DB'],
			// 调色盘
			color: 'rgb(0,123,255)',
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: company_category,
					axisTick: {
						alignWithLabel: true
					},
					axisLabel: {
						rotate: 60
					}
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					// name: '直接访问',
					type: 'bar',
					barWidth: '60%',
					data: company_value
				}
			]
		};

		company_relation_bar.setOption(company_relation_bar_option)
		window.onresize = function () {
			company_relation_bar.resize();
		};
	}
)

$.post(
	'/show_kd',
	{ "company_name": name },
	function (data, status) {
		data = JSON.parse(data)
		var company_category = data['features'];
		var company_value = data['weight'];

		var company_relation_bar = echarts.init(document.getElementById('ichart6'))
		company_relation_bar_option = {
			// 调色盘
			color: 'rgb(0,123,255)',
			// color: ['#3398DB'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: company_category,
					axisTick: {
						alignWithLabel: true
					},
					axisLabel: {
						rotate: 60
					}
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					// name: '直接访问',
					type: 'bar',
					barWidth: '60%',
					data: company_value
				}
			]
		};

		company_relation_bar.setOption(company_relation_bar_option)
		window.onresize = function () {
			company_relation_bar.resize();
		};

	})

$.get('/news', function (data) {
	data = JSON.parse(data);

	var keys = ["title", "date", "time", "content"]
	// var tbody = $("#com_news_info tbody");

	function add_table(item, index) {
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = index + 1;
		th.setAttribute("scope", "row");
		tr.appendChild(th);
		for (var i = 0; i < 3; i++) {
			td = document.createElement("td");
			td.innerHTML = item[keys[i]];
			tr.appendChild(td);
		}
		td = document.createElement("td");
		bt = document.createElement("button");
		bt.setAttribute("type", "button");
		bt.setAttribute("class", "btn btn-primary");
		bt.setAttribute("data-container", "body");
		bt.setAttribute("data-toggle", "popover");
		bt.setAttribute("data-trigger", "hover");
		bt.setAttribute("data-placement", "left");
		bt.setAttribute("data-content", item[keys[i]].slice(0, 200) + '...');
		bt.innerHTML = "detail";
		td.appendChild(bt)
		tr.appendChild(td);
		$("#com_news_info tbody").append(tr)
	}
	data.forEach(add_table);
	// popover
	$('[data-toggle="popover"]').popover();
	$("#com_news_info").DataTable();
})
