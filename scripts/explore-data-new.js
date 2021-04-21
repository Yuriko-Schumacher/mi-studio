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
const svg = [];
const group = [];
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

d3.csv("data/survey-cleaned.csv").then(function (d) {
	const data = d;
	console.log(data);
	// let idx = 0;
	// while (idx < 4) {
	// 	svg[idx] = d3
	// 		.select(`#survey__${idx}`)
	// 		.append("svg")
	// 		.attr("id", `chart__svg__${idx}`)
	// 		.attr("width", size.w)
	// 		.attr("height", size.h);
	// 	group[idx] = svg[idx]
	// 		.append("g")
	// 		.classed(`chart__container__${idx}`, true);
	// 	idx++;
	// }
	svg[0] = d3
		.select(`#chart__1`)
		.append("svg")
		.attr("id", `chart__svg__0`)
		.attr("width", size.w)
		.attr("height", size.h);
	group[0] = svg[0].append("g").classed(`chart__container__0`, true);
	enterViewDrawChart(data);
});

function enterViewDrawChart(data) {
	enterView({
		selector: ".step",
		enter: (el) => {
			let index = +d3.select(el).attr("data-index");
			console.log("step", index);
			el.classList.add("step-active");
			changeViz(data, index);
		},
		exit: (el) => {
			el.classList.remove("step-active");
			let index = +d3.select(el).attr("data-index");
			changeViz(data, index - 1);
		},
		offset: 0.75,
	});
}

// colorScale = d3
// 	.scaleOrdinal()
// 	.domain(selectQuestion(data, 0).map((el) => el[0]))
// 	.range(colors.increasedLoneliness);

// function enterViewChangeViz(data, selector, partIndex, indexOffset) {
// 	enterView({
// 		selector: selector,
// 		enter: (el) => {
// 			el.classList.add("step-active");
// 			let index = el.getAttribute("data-index");

// 			changeViz(data, index);
// 		},
// 		exit: (el) => {
// 			el.classList.remove("step-active");
// 			let index = el.getAttribute("data-index");
// 			if (index > indexOffset) {
// 				changeViz(data, index - 1);
// 			}
// 		},
// 		offset: 0.75,
// 	});
// }

function changeViz(data, index) {
	if (xAxis) {
		xAxis.remove();
		xAxis2.remove();
	}
	changeQuestion(index);
	let options = selectQuestion(data, index);
	// let group =
	// 	index < 2
	// 		? surveyLonelinessG
	// 		: index < 4
	// 		? surveyRelationshipG
	// 		: surveyRiskG;
	drawNodes(data, index, options, group[0]);
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
	let id = index < 2 ? "loneliness" : index < 4 ? "relationship" : "risk";
	questionSel = d3.select(`#question__${id}`).select("p");
	questionSel.text(questions[index]);
}

function drawNodes(data, index, options, group) {
	let thisQ = Object.keys(QandA)[index];
	let prevQ = Object.keys(QandA)[index - 1];
	let thisOption = options.map((el) => el[0]);

	// create scale
	xScale = d3
		.scaleBand()
		.domain(thisOption)
		.range([margin.left, size.w - margin.right]);

	if (index % 2 === 0) {
		colorScale = d3
			.scaleOrdinal()
			.domain(selectQuestion(data, index).map((el) => el[0]))
			.range(colors[thisQ]);
	}

	xAxis = group
		.append("g")
		.classed("x-axis", true)
		.call(d3.axisBottom(xScale))
		.attr("transform", `translate(0, ${size.h - 35})`);

	xAxis2 = group
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
		.force("collide", d3.forceCollide().radius(5.5))
		.force("charge", d3.forceManyBody().strength(0.3))
		.force(
			"x",
			d3
				.forceX()
				.x((d) => xScale(d[thisQ]) + size.w / thisOption.length / 2)
		)
		.force("y", d3.forceY().y(size.h / 2));

	let circles = group.selectAll("circle");
	console.log(thisQ);

	if (circles.nodes().length === 0) {
		node = group
			.append("g")
			.classed("circles", true)
			.attr("stroke", "lightgray")
			.attr("stroke-width", 1)
			.selectAll("circle")
			.data(data, (d) => d.index)
			.enter()
			.append("circle")
			.attr("yy", (d) => d[thisQ])
			.attr("r", 5)
			.attr("fill", (d) =>
				index % 2 !== 0 ? colorScale(d[prevQ]) : colorScale(d[thisQ])
			);
		// colors[thisQ].forEach((color, i) => {
		// 	let legendG = group.append("g").classed("color-legendG", true);
		// 	legendG
		// 		.append("circle")
		// 		.attr("cx", i * 170)
		// 		.attr("cy", 20)
		// 		.attr("r", 5)
		// 		.attr("fill", color)
		// 		.attr("stroke", "lightgray")
		// 		.attr("stroke-widht", 1);
		// 	legendG
		// 		.append("text")
		// 		.classed("color-legend", true)
		// 		.attr("transform", `translate(${i * 170 + 10}, 23)`)
		// 		.text(QandA[thisQ][i]);
		// });
		// let xToMove = width / 2 - legendWidth / 2;
		// legendsG.attr("transform", `translate(${xToMove}, 0)`);

		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	} else {
		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	}
}
