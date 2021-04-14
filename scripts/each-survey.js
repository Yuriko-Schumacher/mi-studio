// ---------- DATA VIZ ----------
const width = document.querySelector("#each-survey").clientHeight;
const height = document.querySelector("#each-survey").clientHeight;
// const margin = { top: 25, right: 25, bottom: 75, left: 75 };
const svg = d3
	.select("#svg")
	.append("svg")
	.attr("width", 300)
	.attr("height", height);

const containerG = svg.append("g").classed("container", true);

const legendSvg = d3
	.select("#legend")
	.append("svg")
	.attr("width", 400)
	.attr("height", height);

let node;

let questions = [
	"How much has the pandemic impacted your desire to connect with other people?",
	"As the pandemic has gone on, have you experienced increased loneliness or other negative emotions?",
	"Before the pandemic, how important was it for you to know that your match was healthy? (STI Free, Communicable Disease Free, etc)",
	"How likely are you to trust a match who assures you that they are healthy without providing proof of a negative COVID test result?",
];

let QandA = {
	desireToConnect: [
		"Heavily increased",
		"Moderately increased",
		"Not at all",
		"Moderately decreased",
		"Heavily decreased",
		"NA",
	],
	increasedLoneliness: ["Yes, often", "Yes, sometimes", "No noticed change"],
	healthConfirmationPrePandemic: [
		"Very Important",
		"Somewhat Important",
		"Important",
		"Somewhat Unimportant",
		"Very Unimportant",
		"NA",
	],
	withoutProof: [
		"Very Likely",
		"Somewhat Likely",
		"Likely",
		"Somewhat Unlikely",
		"Very Unlikely",
		"NA",
	],
};

let description = [
	"71% said that their desire to connect with people had increased.",
	"64.2% reported dealing with negative emotions often. Almost all the respondents answered they have experienced increased loneliness as the pandemic has gone on.",
	"Before the pandemic, 62.7% said that it was very important that they knew a potential match was STD-free. No one answered it was very unimportant.",
	"111 (54.4%) respondents said that they would take someone’s word about being COVID-free.",
];

let color1 = [
	"#FC0594", // Rose
	"#FC0594", // Carnation Pink,
	"black", // "#f7f7f7", // White
	"black",
	"black", // "#ADF5FF", // Celeste
	"gray", // "#0C94E8", // Sky Blue Crayola
];

let color2 = ["#FC0594", "#FEAEDD", "black"];

let color3 = [
	"#FC0594", // Rose
	"#FEAEDD", // Carnation Pink,
	"#FEAEDD", // "#f7f7f7", // White
	"black", // "#ADF5FF", // Celeste
	"gray", // "#0C94E8", // Sky Blue Crayola
];

let color4 = [
	"#FC0594", // Rose
	"#FC0594", // Carnation Pink,
	"#FC0594", // "#f7f7f7", // White
	"black",
	"black", // "#ADF5FF", // Celeste
	"gray", // "#0C94E8", // Sky Blue Crayola
];

d3.csv("data/survey-cleaned.csv").then(function (data) {
	console.log(data);
	populateQuestions(data);
	changeViz(data, 0);
	addLegend(data, 0, options);

	d3.select("#questions")
		.select(".question")
		.classed("question-active", true);

	d3.select("#questions")
		.selectAll(".question")
		.on("click", function () {
			d3.selectAll(".question").classed("question-active", false);
			d3.select(this).classed("question-active", true);
			let clickedQuestion = d3.select(this).nodes()[0].textContent;
			let questionIndex = questions.findIndex(
				(el) => el === clickedQuestion
			);
			changeViz(data, questionIndex);
		});
});

function populateQuestions(data) {
	questions.forEach((question) => {
		d3.select("#questions")
			.append("li")
			.text(question)
			.classed("question", true);
	});
}

function addQuestion(index) {
	d3.select("#question").text(questions[index]);
	d3.select("#description").text(description[index]);
}

function addDescription(index) {}

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

function changeViz(data, index) {
	addQuestion(index);
	drawNodes(data, index, selectQuestion(data, index));
}

function drawNodes(data, index, options) {
	console.log(options);

	// create scale
	let colorScale = d3
		.scaleOrdinal()
		.domain(options.map((el) => el[0]))
		.range(color1);

	let thisQ = Object.keys(QandA)[index];
	let choices = QandA[thisQ];
	console.log(thisQ);

	let sortedData = data.sort((a, b) => {
		return choices.indexOf(a[0]) > choices.indexOf(b[0]) ? 1 : -1;
	});
	console.log(sortedData);
	let xCenter = 200;

	// FOR QUESTION 1
	let forceXScale = d3
		.scaleOrdinal()
		.domain(options.map((el) => el[0]))
		.range([
			xCenter - 20,
			xCenter,
			xCenter + 35,
			xCenter + 35,
			xCenter + 35,
			xCenter + 45,
		]);

	// FOR QUESTION 2
	// let forceXScale = d3
	// 	.scaleOrdinal()
	// 	.domain(options.map((el) => el[0]))
	// 	.range([xCenter - 20, xCenter + 30, xCenter + 60]);

	// let forceYScale = d3
	// 	.scaleOrdinal()
	// 	.domain(options.map((el) => el[0]))
	// 	.range([height / 2, height / 2, height / 2 + 20]);

	// FOR QUESTION 3
	// let forceXScale = d3
	// 	.scaleOrdinal()
	// 	.domain(options.map((el) => el[0]))
	// 	.range([
	// 		xCenter - 30,
	// 		xCenter + 10,
	// 		xCenter + 10,
	// 		xCenter + 35,
	// 		xCenter + 40,
	// 	]);

	// FOR QUESTION 4
	// let forceXScale = d3
	// 	.scaleOrdinal()
	// 	.domain(options.map((el) => el[0]))
	// 	.range([
	// 		xCenter - 30,
	// 		xCenter - 30,
	// 		xCenter - 30,
	// 		xCenter + 20,
	// 		xCenter + 20,
	// 		xCenter + 40,
	// 	]);

	let simulation = d3
		.forceSimulation(data)
		.force("collide", d3.forceCollide().radius(5.21))
		.force(
			"x",
			d3.forceX((d) => forceXScale(d.desireToConnect))
		)
		.force("y", d3.forceY(height / 2));

	if (typeof node === "undefined") {
		node = svg
			.append("g")
			.attr("stroke", "lightgray")
			.attr("stroke-width", 1)
			.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("yy", (d) => d[thisQ])
			.attr("r", 5)
			.attr("fill", (d) => colorScale(d.desireToConnect));

		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	} else {
		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	}
}

function addLegend(data, index, options) {
	console.log(options);

	let q1 = [
		["Heavily or Moderately Increased", 145],
		["No impact / Moderately or Heavily decreased", 58],
		["No answer", 1],
	];

	let newColor1 = [
		"#FC0594", // Rose
		"black", // "#ADF5FF", // Celeste
		"gray", // "#0C94E8", // Sky Blue Crayola
	];

	let q3 = [
		["Very Important", 128],
		["Somewhat or Slightly Important", 55],
		["Somewhat Unimportant", 12],
		["No answer", 9],
	];

	let newColor3 = [
		"#FC0594", // Rose
		"#FEAEDD", // Carnation Pink,
		"black", // "#ADF5FF", // Celeste
		"gray", // "#0C94E8", // Sky Blue Crayola
	];

	let q4 = [
		["Very, Somewhat or Slightly Likely", 111],
		["Very or Somewhat Unlikely", 83],
		["No answer", 10],
	];

	let newColor4 = [
		"#FC0594", // Rose
		"black", // "#ADF5FF", // Celeste
		"gray", // "#0C94E8", // Sky Blue Crayola
	];

	legendSvg
		.selectAll("circle")
		.data(q1)
		.enter()
		.append("circle")
		.attr("cx", 50)
		.attr("cy", (d, i) => i * 15 + 80) // 80 for Q2, 70 for Q4
		.attr("r", 4)
		.attr("fill", (d, i) => newColor1[i])
		.attr("stroke", "lightgray")
		.attr("stroke-width", 1);

	legendSvg
		.selectAll("text")
		.data(q1)
		.enter()
		.append("text")
		.classed("legend", true)
		.attr("x", 60)
		.attr("y", (d, i) => i * 15 + 84)
		.text(
			(d) =>
				`${d[0]} ... ${d[1]} (${
					Math.round((d[1] / 204) * 100 * 10) / 10
				}%)`
		);
}
