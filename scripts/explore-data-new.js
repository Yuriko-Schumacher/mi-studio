// ---------- DATA VIZ ----------
let windowSize = {
	w: window.innerWidth,
	h: window.innterHeight,
};
const size = {
	w: document.querySelector(".chart__figure").clientWidth,
	// h: document.querySelector(".chart__figure").clientHeight - 26,
	h: 234,
};
const margin = { top: 0, right: 0, bottom: 75, left: 0 };
let xAxis, xAxis2;

const questions = [
	"Have you experienced increased loneliness during the pandemic?",
	"How much has the pandemic impacted your desire to connect with other people?",
	"Before the pandemic, how important was it to know that your match was healthy? (STI Free, etc.)",
	"How likely are you to trust a match who assures healthy without providing proof of a negative COVID test result?",
	"When you feel lonely, how important is it that people acknowledge that feeling?",
	"How has the pandemic impacted your ability to be happy while alone?",
];

const QandA = {
	increasedLoneliness: ["Yes, often", "Yes, sometimes", "No noticed change"],
	desireToConnect: [
		"Heavily increased",
		"Moderately increased",
		"Not at all",
		"Moderately decreased",
		"Heavily decreased",
		"No Answer",
	],
	healthConfirmationPrePandemic: [
		"Very Important",
		"Somewhat Important",
		"Important",
		"Somewhat Unimportant",
		"Very Unimportant",
		"No Answer",
	],
	withoutProof: [
		"Very Likely",
		"Somewhat Likely",
		"Likely",
		"Somewhat Unlikely",
		"Very Unlikely",
		"No Answer",
	],
	recognizeLoneliness: [
		"Very Important",
		"Somewhat Important",
		"Generally Welcome",
		"Somewhat Unimportant",
		"Very Unimportant",
	],
	abilityToBeHappy: [
		"Significantly decreased",
		"Somewhat decreased",
		"No noted difference",
		"Somewhat increased",
		"Significantly increased",
		"No Answer",
	],
};
const colorDef = {
	hotPink: "#FC0594",
	lightPink: "#ffc7e8",
	white: "#f7f7f7",
	gray: "#aaa",
};
const colors = {
	increasedLoneliness: [colorDef.hotPink, colorDef.lightPink, "black"],
	desireToConnect: [
		colorDef.hotPink,
		colorDef.hotPink,
		colorDef.white,
		"black",
		"black",
		colorDef.gray,
	],
	healthConfirmationPrePandemic: [
		colorDef.hotPink,
		colorDef.lightPink,
		colorDef.lightPink,
		"black",
		colorDef.gray,
	],
	withoutProof: [
		colorDef.hotPink,
		colorDef.hotPink,
		colorDef.hotPink,
		"black",
		"black",
		colorDef.gray,
	],
	recognizeLoneliness: [
		colorDef.hotPink,
		colorDef.hotPink,
		colorDef.white,
		"black",
		"black",
	],
	abilityToBeHappy: [
		"black",
		"black",
		"#f7f7f7",
		colorDef.hotPink,
		colorDef.hotPink,
		colorDef.gray,
	],
};

const svg = d3
	.select("#chart")
	.append("svg")
	.attr("width", size.w)
	.attr("height", size.h);
const containerG = svg.append("g").classed("chart-container", true);

d3.csv("data/survey-cleaned.csv").then(function (d) {
	const data = d;
	console.log(data);
	enterViewDrawChart(data);
});

function enterViewDrawChart(data) {
	enterView({
		selector: ".step",
		enter: (el) => {
			let index = +d3.select(el).attr("data-index");
			el.classList.add("step-active");
			console.log(index);
			if (index < 0) {
				removeViz();
			} else if (Number.isInteger(index)) {
				changeViz(data, index);
				addTooltip();
			} else {
				if (index === 1.1) {
					highlightCircles("increased");
					console.log("1.1!");
				} else if (index === 1.2) {
					highlightCircles("increased", "Heavily");
				} else if (index === 1.3) {
					dehighlightCircles();
				} else if (index === 3.1) {
					highlightCircles("Likely");
				} else if (index === 3.2) {
					dehighlightCircles();
				} else if (index === 5.1) {
					highlightCircles("increased");
				} else if (index === 5.2) {
					dehighlightCircles();
				}
				addTooltip();
			}
		},
		exit: (el) => {
			el.classList.remove("step-active");
			let index = +d3.select(el).attr("data-index");
			if (Number.isInteger(index)) {
				if (index === 0 || index === 2 || index === 4) {
					removeViz();
				} else if (index === -1) {
					return;
				} else if (index === -2) {
					changeViz(data, 1);
				} else if (index === -4) {
					changeViz(data, 3);
				} else {
					changeViz(data, index - 1);
				}
			} else {
				if (index === 1.1) {
					dehighlightCircles();
				} else if (index === 1.2) {
					highlightCircles("increased");
				} else if (index === 1.3) {
					highlightCircles("increased", "Heavily");
				} else if (index === 3.1) {
					dehighlightCircles();
				} else if (index === 3.2) {
					highlightCircles("Likely");
				} else if (index === 5.1) {
					dehighlightCircles();
				} else if (index === 5.2) {
					highlightCircles("increased");
				}
			}
		},
		offset: windowSize.w > 900 ? 0.5 : 0.1,
	});
}

function changeViz(data, index) {
	if (xAxis) {
		xAxis.remove();
		xAxis2.remove();
	}
	changeQuestion(index);
	let colorIndex = index < 2 ? 0 : index < 4 ? 2 : 4;
	console.log(colorIndex);
	let options = selectQuestion(data, index);
	drawNodes(data, index, colorIndex, options);
}

function selectQuestion(data, index) {
	let thisQ = Object.keys(QandA)[index];
	options = d3.group(data, (d) => d[thisQ]);
	options = Array.from(options);
	let choices = QandA[thisQ];
	options.sort((a, b) => {
		return choices.indexOf(a[0]) > choices.indexOf(b[0]) ? 1 : -1;
	});
	return options;
}

function changeQuestion(index) {
	d3.select(`#question`).select("p").text(questions[index]);
}

function drawNodes(data, index, colorIndex, options) {
	let thisQ = Object.keys(QandA)[index];
	let prevQ = Object.keys(QandA)[index - 1];
	let QForColor = Object.keys(QandA)[colorIndex];
	let thisOption = options.map((el) => el[0]);

	// create scale
	xScale = d3
		.scaleBand()
		.domain(thisOption)
		.range([margin.left, size.w - margin.right]);

	colorScale = d3
		.scaleOrdinal()
		.domain(selectQuestion(data, colorIndex).map((el) => el[0]))
		.range(colors[QForColor]);

	xAxis = containerG
		.append("g")
		.classed("x-axis", true)
		.call(d3.axisBottom(xScale))
		.attr("transform", `translate(0, ${size.h - 35})`);

	xAxis2 = containerG
		.append("g")
		.classed("x-axis", true)
		.call(
			d3.axisBottom(xScale).tickFormat((d, i) => {
				let num = options[i][1].length;
				let percentage = Math.round((num / 204) * 100 * 10) / 10;
				return `${num} (${percentage}%)`;
			})
		)
		.attr("transform", `translate(0, ${size.h - 20})`);

	let simulation = d3
		.forceSimulation(data)
		.force(
			"collide",
			d3
				.forceCollide()
				.radius(windowSize.w >= 800 ? 5.5 : (windowSize.w / 800) * 5.5)
		)
		.force("charge", d3.forceManyBody().strength(0.3))
		.force(
			"x",
			d3
				.forceX()
				.x((d) => xScale(d[thisQ]) + size.w / thisOption.length / 2)
		)
		.force("y", d3.forceY().y(size.h / 2));

	let circles = containerG.selectAll("circle");
	console.log(thisQ);

	if (circles.nodes().length === 0) {
		node = containerG
			.append("g")
			.classed("circles", true)
			.attr("stroke", "lightgray")
			.attr(
				"stroke-width",
				windowSize.w >= 800 ? 1 : (windowSize.w / 800) * 1
			)
			.selectAll("circle")
			.data(data, (d) => d.index)
			.enter()
			.append("circle")
			.attr("class", (d) => d[thisQ])
			.attr("r", windowSize.w >= 800 ? 5 : (windowSize.w / 800) * 5)
			.attr("fill", (d) =>
				index % 2 !== 0 ? colorScale(d[prevQ]) : colorScale(d[thisQ])
			);
		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	} else {
		node.attr("class", (d) => d[thisQ]);
		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	}
}

function removeViz() {
	if (xAxis) {
		xAxis.remove();
		xAxis2.remove();
	}
	d3.select(`#question`).select("p").text("");
	d3.select("g.circles").remove();
	d3.select(".tooltip").style("visibility", "hidden");
}

function highlightCircles(toHighlight, toHighlight2) {
	containerG
		.select("g.circles")
		.selectAll("circle")
		.classed("dehighlight", true);
	console.log(arguments);
	let circlesToHighlight;
	if (arguments.length === 2) {
		circlesToHighlight = containerG
			.select("g.circles")
			.selectAll(`circle.${toHighlight}.${toHighlight2}`);
	} else {
		circlesToHighlight = containerG
			.select("g.circles")
			.selectAll(`circle.${toHighlight}`);
	}
	console.log(circlesToHighlight);
	circlesToHighlight.classed("dehighlight", false);
}

function dehighlightCircles() {
	containerG.selectAll("circle").classed("dehighlight", false);
}

function addTooltip() {
	let circles = containerG.selectAll("circle");
	let tooltip = d3.select(`#chart__container`).select(".tooltip");
	circles
		.on("mouseover", function (e, d) {
			let thisCircle = d3.select(this);
			thisCircle.attr("stroke-width", 2).attr("stroke", "black");
			let x = e.pageX;
			tooltip
				.style("visibility", "visible")
				.style("left", `${x + 10}px`)
				.html(
					`Age: <b>${d.age}</b><br>Ethnicity: <b>${d.ethnisity}</b><br>Sexuality: <b>${d.sexuality}</b><br>Personality: <b>${d.personality}</b>`
				);
		})
		.on("mouseout", function () {
			d3.select(this).attr("stroke-width", 1).attr("stroke", "lightgray");
			tooltip.style("visibility", "hidden");
		});
}
