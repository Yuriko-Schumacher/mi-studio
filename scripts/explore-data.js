// ---------- DATA VIZ ----------
const width = 950;
const height = 200;
const margin = { top: 0, right: 0, bottom: 75, left: 0 };
const svg = d3
	.select("#survey")
	.append("svg")
	.attr("id", "surveySvg")
	.attr("width", width)
	.attr("height", height);
const legendDescription = d3
	.select("#survey")
	.append("g")
	.classed("color-description", true);
const legendSvg = d3
	.select("#survey")
	.append("svg")
	.attr("id", "legendSvg")
	.attr("width", width)
	.attr("height", 30);

const containerG = svg.append("g").classed("container", true);
const legendsG = legendSvg.append("g").classed("legend-container", true);

let node;

const questions = [
	"Have you experienced increased loneliness during the pandemic?",
	"How much has the pandemic impacted your desire to connect with other people?",
	"When you feel lonely, how important is it that people acknowledge that feeling?",
	"How has the pandemic impacted your ability to be happy while alone?",
	// "If you hadn't been using dating applications before the pandemic, how long did it take for you to begin using one when the pandemic hit?",
	// "If you had been using dating applications before the pandemic, did you begin using them more regularly? How much more?",
	// "Before the pandemic, how likely were you to overlook potential “deal breaking” aspects of a match for any reason? (attractiveness, personality quirks, job status, etc)?",
	// "As the pandemic continues, how would you describe yourself when deciding if you want to match with someone?",
	"Before the pandemic, how important was it to know that your match was healthy? (STI Free, etc.)",
	"How likely are you to trust a match who assures healthy without providing proof of a negative COVID test result?",
	// "Before the pandemic, when you were in a relationship, how important was physical intimacy to you?",
	// "If a potential match expresses a strong need for physical intimacy on their profile, how likely are you to try to match with them?",
	// "When deciding on a date with a new match, do you prefer a virtual date or an in person date?",
	// "How old are you?",
	// "How would you describe your ethnic background?",
	// "What is your sexual orientation?",
	// "Are you an introvert or an extrovert?",
];

const QandA = {
	increasedLoneliness: ["Yes, often", "Yes, sometimes", "No noticed change"],
	desireToConnect: [
		"Heavily increased",
		"Moderately increased",
		"Not at all",
		"Moderately decreased",
		"Heavily decreased",
		"NA",
	],
	recognizeLoneliness: [
		"Very Important",
		"Somewhat Important",
		"Generally Welcome",
		"Somewhat Unimportant",
		"Very Unimportant",
	],
	abilityToBeHappy: [
		"Significantly decreased my ability",
		"Somewhat decreased my ability",
		"No noted difference",
		"Somewhat increased my ability",
		"Significantly increased my ability",
		"NA",
	],
	// timeToUseApp: [
	// 	"1-2 weeks",
	// 	"3-4 weeks",
	// 	"1-3 months",
	// 	"4-6 months",
	// 	"7-9 months",
	// 	"NA",
	// ],
	// frequencyOfUseage: [
	// 	"Much more often",
	// 	"Somewhat more often",
	// 	"Used same amount",
	// 	"Somewhat less often",
	// 	"Much less often",
	// 	"NA",
	// ],
	// dealBreaking: [
	// 	"Very likely",
	// 	"Somewhat likely",
	// 	"Somewhat unlikely",
	// 	"Very unlikely",
	// 	"NA",
	// ],
	// matchingAttitudes: [
	// 	"Very particular",
	// 	"Somewhat particular",
	// 	"Moderate",
	// 	"Somewhat easy going",
	// 	"Very easy going",
	// 	"NA",
	// ],
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
	// physicalIntimacyPrePandemic: [
	// 	"Very Important",
	// 	"Somewhat Important",
	// 	"Important",
	// 	"Somewhat Unimportant",
	// 	"Very Unimportant",
	// 	"NA",
	// ],
	// physicalIntimacyMatching: [
	// 	"Very Likely",
	// 	"Somewhat Likely",
	// 	"Likely",
	// 	"Somewhat Unlikely",
	// 	"Very Unlikely",
	// 	"NA",
	// ],
	// virtualOrF2f: [
	// 	"I prefer a virtual date",
	// 	"I prefer an in person date",
	// 	"It depends on my match",
	// 	"NA",
	// ],
	// age: ["18-21", "22-26", "27-29"],
	// ethnisity: [
	// 	"White",
	// 	"Black",
	// 	"Asian",
	// 	"East Asian",
	// 	"South Asian",
	// 	"Spanish",
	// 	"Hispanic",
	// 	"Islander",
	// 	"Pacific Islander",
	// 	"Middle Eastern",
	// 	"African",
	// 	"South American",
	// 	"Other",
	// ],
	// sexuality: [
	// 	"Heterosexual",
	// 	"Homosexual",
	// 	"Bisexual",
	// 	"Pansexual",
	// 	"Other",
	// 	"NA",
	// ],
	// personality: ["Introvert (less outgoing)", "Extrovert (more outgoing)"],
};

const colors = {
	increasedLoneliness: ["#FC0594", "#ffc7e8", "#000000"],
	desireToConnect: [
		"#FC0594",
		"#FC0594", // "#ffc7e8"
		"#f7f7f7",
		"black", // "#ADF5FF"
		"black", // "#0C94E8"
		"#ccc",
	],
	recognizeLoneliness: [
		"#FC0594",
		"#FC0594", // "#ffc7e8"
		"#f7f7f7",
		"black", // "#ADF5FF"
		"black", // "#0C94E8"
	],
	abilityToBeHappy: [
		"black", // "#FC0594",
		"black", // "#ffc7e8",
		"#f7f7f7",
		"#FC0594", // "#ADF5FF",
		"#FC0594", // "#0C94E8",
		"#ccc",
	],
	healthConfirmationPrePandemic: [
		"#FC0594",
		"#ffc7e8",
		"#ffc7e8", // "#f7f7f7",
		"black", // "#ADF5FF",
		"#ccc",
	],
	withoutProof: [
		"#FC0594",
		"#FC0594", // "#ffc7e8",
		"#FC0594", //"#f7f7f7",
		"black", // "#ADF5FF",
		"black", // "#0C94E8",
		"#ccc",
	],
};

d3.csv("data/survey-cleaned.csv").then(function (data) {
	console.log(data);
	populateQuestions();
	changeColorDescription(0);

	colorScale = d3
		.scaleOrdinal()
		.domain(selectQuestion(data, 0).map((el) => el[0]))
		.range(colors.increasedLoneliness);

	changeViz(data, 0);
	changeLegend(0);

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
			xAxis.remove();
			xAxis2.remove();
			changeViz(data, questionIndex);
		});

	d3.select("#setColor").on("click", function () {
		let lockedQuestion = d3.select(".question-active").nodes()[0]
			.textContent;
		let lockedIndex = questions.findIndex((el) => el === lockedQuestion);
		changeColor(data, lockedIndex);
		changeColorDescription(lockedIndex);
		changeLegend(lockedIndex);
	});
});

function changeViz(data, index) {
	addQuestion(index);
	let options = selectQuestion(data, index);
	drawNodes(data, index, options);
}

function populateQuestions() {
	questions.forEach((question) => {
		d3.select("#questions")
			.append("li")
			.text(question)
			.classed("question", true);
	});
}

function addQuestion(index) {
	d3.select("#question").text(questions[index]);
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

function changeColor(data, index) {
	let thisQ = Object.keys(QandA)[index];
	console.log(colors[thisQ]);
	colorScale = d3
		.scaleOrdinal()
		.domain(selectQuestion(data, index).map((el) => el[0]))
		.range(colors[thisQ]);
	node.attr("fill", (d) => colorScale(d[thisQ]));
	changeColorDescription(index);
}

function changeColorDescription(index) {
	d3.select(".color-description").select("p").remove();
	legendDescription
		.append("p")
		.html(
			`Colors are set based on the question: "<b>${questions[index]}</b>"`
		);
}

function changeLegend(index) {
	legendsG.selectAll(".color-legendG").remove();
	let thisQ = Object.keys(QandA)[index];
	colors[thisQ].forEach((color, i) => {
		let legendG = legendsG.append("g").classed("color-legendG", true);
		legendG
			.append("circle")
			.attr("cx", i * 170)
			.attr("cy", 20)
			.attr("r", 5)
			.attr("fill", color)
			.attr("stroke", "lightgray")
			.attr("stroke-widht", 1);
		legendG
			.append("text")
			.classed("color-legend", true)
			.attr("transform", `translate(${i * 170 + 10}, 23)`)
			.text(QandA[thisQ][i]);
	});
	let legendWidth = document
		.querySelector(".legend-container")
		.getBoundingClientRect().width;
	let xToMove = width / 2 - legendWidth / 2;
	legendsG.attr("transform", `translate(${xToMove}, 0)`);
}

function drawNodes(data, index, options) {
	let thisQ = Object.keys(QandA)[index];

	// create scale
	xScale = d3
		.scaleBand()
		.domain(options.map((el) => el[0]))
		.range([margin.left, width - margin.right]);

	xAxis = containerG
		.append("g")
		.classed("x-axis", true)
		.call(d3.axisBottom(xScale))
		.attr("transform", `translate(0, ${height - 20})`);

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
		.attr("transform", `translate(0, ${height - 30})`);

	let simulation = d3
		.forceSimulation(data)
		// .force('center', )
		.force("collide", d3.forceCollide().radius(5.5))
		.force("charge", d3.forceManyBody().strength(0.3))
		.force(
			"x",
			d3.forceX().x((d) => xScale(d[thisQ]) - options.length * 28 + 250)
		)
		.force("y", d3.forceY().y(height / 2));

	if (typeof node === "undefined") {
		node = svg
			.append("g")
			.attr("stroke", "lightgray")
			.attr("stroke-width", 1)
			.selectAll("circle")
			.data(data, (d) => d.index)
			.enter()
			.append("circle")
			.attr("yy", (d) => d[thisQ])
			.attr("r", 5)
			.attr("fill", (d) => colorScale(d[thisQ]));

		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	} else {
		simulation.on("tick", () => {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});
	}
}
