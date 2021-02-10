let stockData;

d3.csv("data/MTCH_0208_reduced.csv").then(function (data) {
	const parseTime = d3.timeParse("%Y-%m-%d");
	console.log(data);
	data.forEach(function (d) {
		return (d.date = parseTime(d.date));
	});

	const width = document.querySelector("#match-stock").clientWidth;
	const height = document.querySelector("#match-stock").clientHeight;
	const vw = window.innerWidth;
	const margin = { top: 25, right: 25, bottom: 75, left: 75 };

	const xScale = d3
		.scaleTime()
		.domain([
			d3.min(data, function (d) {
				return d.date;
			}),
			d3.max(data, function (d) {
				return d.date;
			}),
		])
		.range([margin.left, width - margin.right]);

	const yScale = d3
		.scaleLinear()
		.domain([
			d3.min(data, function (d) {
				return +d.close;
			}) - 10,
			d3.max(data, function (d) {
				return +d.close;
			}) + 10,
		])
		.range([height - margin.bottom, margin.top]);

	const svg = d3
		.select("#match-stock")
		.append("svg")
		.attr("height", height)
		.attr("width", width);

	const circles = svg
		.selectAll("cirlce")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => xScale(d.date))
		.attr("cy", (d) => yScale(d.close))
		.attr("r", 4)
		.attr("fill", "white")
		.attr("opacity", 0);

	const xAxis = svg
		.append("g")
		.attr("transform", `translate(0, ${height - margin.bottom})`)
		.call(d3.axisBottom().scale(xScale));

	const yAxis = svg
		.append("g")
		.attr("transform", `translate(${margin.left}, 0)`)
		.call(d3.axisLeft().scale(yScale));

	const line = d3
		.line()
		.x(function (d) {
			return xScale(d.date);
		})
		.y(function (d) {
			return yScale(d.close);
		});

	const path = svg
		.append("path")
		.datum(data)
		.attr("d", line)
		.attr("fill", "none")
		.attr("stroke", "black");

	const accentLine = svg
		.append("line")
		.attr("x1", xScale(parseTime("2020-03-13")))
		.attr("y1", margin.top)
		.attr("x2", xScale(parseTime("2020-03-13")))
		.attr("y2", height - margin.bottom)
		.attr("stroke", "red");

	const accentTime = svg
		.append("text")
		.attr("x", `${xScale(parseTime("2020-03-13")) + 10}px`)
		.attr("y", yScale(140))
		.text("March 13")
		.attr("class", "accent-time");

	// tooltip
	const tooltip = d3.select(".tooltip");
	const formatTime = d3.timeFormat("%m/%d/%y");

	circles
		.on("mouseover", function (e, d) {
			let x = +d3.select(this).attr("cx") + 0.1 * vw + 10;
			let y = +d3.select(this).attr("cy") + 74.847 + 10;
			tooltip
				.style("display", "block")
				.style("top", `${y}px`)
				.style("left", `${x}px`)
				.html(
					`${formatTime(d.date)}<br>price: <b>${
						Math.round(d.close * 100) / 100
					}</b>`
				);
			d3.select(this).attr("fill", "black").attr("opacity", 1);
		})
		.on("mouseout", function () {
			tooltip.style("display", "none");
			d3.select(this).attr("fill", "white").attr("opacity", 0);
		});

	const xAxisLabel = svg
		.append("text")
		.attr("x", width / 2)
		.attr("y", height - margin.bottom / 2 + 10)
		.attr("text-anchor", "middle")
		.text("Date");

	const yAxisLabel = svg
		.append("text")
		.attr("x", -height / 2)
		.attr("y", margin.left / 2 - 10)
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.text("Price");
});
