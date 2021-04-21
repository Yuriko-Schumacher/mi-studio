function BubbleChart() {
	this.index = function (index) {
		this._index = index;
		return this;
	};

	this.selection = function (selection) {
		this._selection = selection;
		return this;
	};

	this.size = function (size) {
		this._size = size;
		return this;
	};

	this.margins = function (margins) {
		this._margins = margins;

		if (!this._size) {
			console.error("Setup size before margins");
			return;
		}
		if (!this._selection) {
			console.error("Setup selection before margins");
			return;
		}
		return this;
	};

	this.data = function (data) {
		this._data = data;
		return this;
	};

	this.setOptions = function () {
		let thisQ = Object.keys(QandA)[this._index];
		this._options = d3.group(this._data, (d) => d[thisQ]);
		this._options = Array.from(this._options);
		let choices = QandA[thisQ];
		this._options.sort((a, b) => {
			return choices.indexOf(a[0]) > choices.indexOf(b[0]) ? 1 : -1;
		});
		return this;
	};

	this.changeQuestion = function () {
		let questionSel = d3.select(`#question__${this._index}`).select("p");
		questionSel.text(questions[this._index]);
	};

	this.draw = function () {
		let xScale = d3
			.scaleBand()
			.domain(this._options.map((el) => el[0]))
			.range([this._margins.left, this._size.w - this._margins.right]);

		let thisKey = Object.keys(QandA)[this._index];
		let colorScale = d3
			.scaleOrdinal()
			.domain(this._options.map((el) => el[0]))
			.range(colors[thisKey]);

		let simulation = d3
			.forceSimulation(this._data)
			.force(
				"collide",
				d3
					.forceCollide()
					.radius(
						windowSize.w >= 800 ? 5.5 : (windowSize.w / 800) * 5.5
					)
			)
			.force("charge", d3.forceManyBody().strength(0.3))
			.force(
				"x",
				d3
					.forceX()
					.x(
						(d) =>
							xScale(d[thisKey]) +
							this._size.w / this._options.length / 2
					)
			)
			.force("y", d3.forceY().y(this._size.h / 2));
		console.log(windowSize);
		let circles = this._selection
			.append("g")
			.classed("circles", true)
			.attr("stroke", "lightgray")
			.attr(
				"stroke-width",
				windowSize.w >= 800 ? 1 : (windowSize.w / 800) * 1
			)
			.selectAll("circle")
			.data(this._data)
			.join("circle")
			.attr("yy", (d) => d[0])
			.attr("r", windowSize.w >= 800 ? 5 : (windowSize.w / 800) * 5)
			.attr("fill", (d) => colorScale(d[thisKey]));

		simulation.on("tick", () => {
			circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		});

		this.drawAxisX(xScale);
	};

	this.drawAxisX = function (xScale) {
		let xAxis = this._selection
			.append("g")
			.classed("x-axis", true)
			.call(d3.axisBottom(xScale))
			.attr("transform", `translate(0, ${this._size.h - 35})`);

		let xAxis2 = this._selection
			.append("g")
			.classed("x-axis", true)
			.call(
				d3.axisBottom(xScale).tickFormat((d, i) => {
					let num = this._options[i][1].length;
					let percentage = Math.round((num / 204) * 100 * 10) / 10;
					return `${num} (${percentage}%)`;
				})
			)
			.attr("transform", `translate(0, ${this._size.h - 20})`);
	};
}
