// ---------- DATA VIZ ----------
const width = document.querySelector("#survey").clientWidth;
const height = document.querySelector("#survey").clientHeight;
const margin = { top: 25, right: 25, bottom: 75, left: 75 };
const svg = d3
	.select("#survey")
	.append("svg")
	.attr("id", "surveySvg")
	.attr("width", width)
	.attr("height", height);

const containerG = svg.append("g").classed("container", true);

let node;

let questions = [
	"How much has the pandemic impacted your desire to connect with other people?",
	"As the pandemic has gone on, have you experienced increased loneliness or other negative emotions?",
	"When you feel lonely or experience other negative emotions, how important is it that people close to you acknowledge and recognize that feeling?",
	"As the pandemic has gone on, how has it impacted your ability to be comfortable or happy while alone?",
	"If you hadn't been using dating applications before the pandemic, how long did it take for you to begin using one when the pandemic hit?",
	"If you had been using dating applications before the pandemic, did you begin using them more regularly? How much more?",
	"Before the pandemic, how likely were you to overlook potential “deal breaking” aspects of a match for any reason? (attractiveness, personality quirks, job status, etc)?",
	"As the pandemic continues, how would you describe yourself when deciding if you want to match with someone?",
	"Before the pandemic, how important was it for you to know that your match was healthy? (STI Free, Communicable Disease Free, etc)",
	"How likely are you to trust a match who assures you that they are healthy without providing proof of a negative COVID test result?",
	"Before the pandemic, when you were in a relationship, how important was physical intimacy to you?",
	"If a potential match expresses a strong need for physical intimacy on their profile, how likely are you to try to match with them?",
	"When deciding on a date with a new match, do you prefer a virtual date or an in person date?",
	"How old are you?",
	"How would you describe your ethnic background?",
	"What is your sexual orientation?",
	"Are you an introvert or an extrovert?",
];

let QandA = {
	desireToConnect: [
		"Heavily increased",
		"Moderately increased",
		"Not at all",
		"Moderately decreased",
		"Heavily decreased",
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
	age: ["18-21", "22-26", "27-29"],
	ethnisity: [
		"White",
		"Black",
		"Asian",
		"East Asian",
		"South Asian",
		"Spanish",
		"Hispanic",
		"Islander",
		"Pacific Islander",
		"Middle Eastern",
		"African",
		"South American",
		"Other",
	],
	sexuality: ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Other"],
	personality: ["Introvert (less outgoing)", "Extrovert (more outgoing)"],
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
			"#0C94E8", // Sky Blue Crayola
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
			xAxis2.remove();
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
	options = Array.from(options);
	let choices = QandA[thisQ];
	options.sort((a, b) => {
		return choices.indexOf(a[0]) > choices.indexOf(b[0]) ? 1 : -1;
	});

	// // add default option to the actual answers
	let options2 = options.map((el) => el[0]);
	let options3 = options2.filter((el) => el !== "NA");
	let missingOption = choices.filter((i) => options3.indexOf(i) == -1);
	if (missingOption.length > 0) {
		options.push(missingOption);
	}

	// sort again
	if (options.length > choices.length) {
		choices.push("NA");
	}
	options.sort((a, b) => {
		return choices.indexOf(a[0]) > choices.indexOf(b[0]) ? 1 : -1;
	});

	return options;
}

function drawNodes(data, index, options) {
	// create scale
	let filteredOption = options.filter((el) => el.length >= 2);
	console.log(filteredOption.map((el) => el[1].length));

	xScale = d3
		.scaleBand()
		.domain(filteredOption.map((el) => el[0]))
		.range([margin.left, width - margin.right]);

	xAxis = containerG
		.append("g")
		.classed("x-axis", true)
		.call(d3.axisBottom(xScale))
		.attr("transform", `translate(0, ${height - margin.bottom + 10})`);

	// let xScale2 = d3
	// 	.scaleBand()
	// 	.domain(filteredOption.map((el) => String(el[1].length)))
	// 	.range([margin.left, width - margin.right]);

	xAxis2 = containerG
		.append("g")
		.classed("x-axis", true)
		.call(
			d3.axisTop(xScale).tickFormat((d, i) => {
				let num = filteredOption[i][1].length;
				let percentage = Math.round((num / 204) * 100 * 10) / 10;
				return `${num} (${percentage}%)`;
			})
		)
		.attr("transform", `translate(0, 60)`);

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
}
