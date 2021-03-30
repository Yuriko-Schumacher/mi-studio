const width = document.querySelector("#survey").clientWidth;
const height = document.querySelector("#survey").clientHeight;
const margin = { top: 25, right: 25, bottom: 75, left: 75 };
const svg = d3
	.select("#survey")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

const containerG = svg.append("g").classed("container", true);

let node;

let questions = [
	"How much the pandemic has impacted your desire to connect with other people?",
	"As the pandemic has gone on, have you experienced increased loneliness or other negative emotions?",
	"When you feel lonely or experience other negative emotions, how important is it that people close to you acknowledge and recognize that feeling?",
	"As the pandemic has gone on, how has it impacted your ability to be comfortable or happy while alone?",
	"If you hadn't been using dating applications before the pandemic, how long did it take for you to begin using one when the pandemic hit?",
	"If you had been using dating applications before the pandemic, did you begin using them more regularly? How much more?",
	"Before the pandemic, how likely were you to overlook potential “deal breaking” aspects of a match for any reason? (attractiveness, personality quirks, job status, etc)?",
	"As the pandemic continues, how would you describe yourself when deciding if you want to match with someone?",
	"Before the pandemic, how important was it for you to know that your match was healthy? (STI Free, Communicable Disease Free, ETC)",
	"How likely are you to trust a match who assures you that they are healthy without providing proof of a negative COVID test result?",
	"Before the pandemic, when you were in a relationship, how important was physical intimacy to you?",
	"If a potential match expresses a strong need for physical intimacy on their profile, how likely are you to try to match with them?",
	"When deciding on a date with a new match, do you prefer a virtual date or an in person date?",
];

let QandA = {
	desireToConnect: [
		"Heavily increased",
		"Moderately increased",
		"Not at all",
		"Moderately decreased",
		"Heavily decreased",
		"YI",
	],
	increasedLoneliness: ["Yes, often", "Yes, sometimes", "No noticed change"],
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
	],
	timeToUseApp: [
		"1-2 weeks",
		"3-4 weeks",
		"1-3 months",
		"4-6 months",
		"7-9 months",
	],
	frequencyOfUseage: [
		"Much more often",
		"Somewhat more often",
		"Used same amount",
		"Somewhat less often",
		"Much less often",
	],
	dealBreaking: [
		"Very likely",
		"Somewhat likely",
		"Somewhat unlikely",
		"Very unlikely",
	],
	matchingAttitudes: [
		"Very particular",
		"Somewhat particular",
		"Moderate",
		"Somewhat easy going",
		"Very easy going",
	],
	healthConfirmationPrePandemic: [
		"Very Important",
		"Somewhat Important",
		"Important",
		"Somewhat Unimportant",
		"Very Unimportant",
	],
	withoutProof: [
		"Very Likely",
		"Somewhat Likely",
		"Likely",
		"Somewhat Unlikely",
		"Very Unlikely",
	],
	physicalIntimacyPrePandemic: [
		"Very Important",
		"Somewhat Important",
		"Important",
		"Somewhat Unimportant",
		"Very Unimportant",
	],
	physicalIntimacyMatching: [
		"Very Likely",
		"Somewhat Likely",
		"Likely",
		"Somewhat Unlikely",
		"Very Unlikely",
	],
	virtualOrF2f: [
		"I prefer a virtual date",
		"I prefer an in person date",
		"It depends on my match",
	],
};
d3.csv("data/survey-cleaned.csv").then(function (data) {
	console.log(data);
	populateQuestions(data);

	colorScale = d3
		.scaleOrdinal()
		.domain(selectQuestion(data, 0).map((el) => el[0]))
		.range([
			"#FF007F", // Rose
			"#FFADD8", // Carnation Pink
			"#f7f7f7", // White
			"#ADF5FF", // Celeste
			"#19E3FF", // Sky Blue Crayola
			"#ccc",
		]);

	changeViz(data, 0);
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
			changeViz(data, questionIndex);
		});
});

function changeViz(data, index) {
	addQuestion(index);
	drawNodes(data, index, selectQuestion(data, index));
}

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
}

function selectQuestion(data, index) {
	let thisQ = Object.keys(QandA)[index];
	options = d3.group(data, (d) => d[thisQ]);
	options = Array.from(options).sort((a, b) => {
		let choices = QandA[thisQ];
		if (choices.indexOf(a[0]) > choices.indexOf(b[0])) {
			return 1;
		} else {
			return -1;
		}
	});
	return options;
}

function drawNodes(data, index, options) {
	// create scale
	xScale = d3
		.scaleBand()
		.domain(options.map((el) => el[0]))
		.range([margin.left, width - margin.right]);

	xAxis = containerG
		.append("g")
		.call(d3.axisBottom(xScale))
		.attr("transform", `translate(0, ${height - margin.bottom + 20})`);

	let thisQ = Object.keys(QandA)[index];

	let simulation = d3
		.forceSimulation(data)
		// .force('center', )
		.force("collide", d3.forceCollide().radius(5.5))
		.force("charge", d3.forceManyBody().strength(0.3))
		.force(
			"x",
			d3.forceX().x((d) => xScale(d[thisQ]))
		)
		.force("y", d3.forceY().y(height / 2));

	if (typeof node === "undefined") {
		node = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, 0)`)
			.attr("stroke", "lightgray")
			.attr("stroke-width", 1)
			.selectAll("circle")
			.data(data, (d) => d.index)
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

	// .call(drag(simulation));
}
