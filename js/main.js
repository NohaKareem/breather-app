// self executing anonymous function
(function () {
	"use strict";
	console.log("SEAF has fired");

	// variables
	var settingsButton = document.querySelector("#settingsButton");
	var playButton = document.querySelector("#playButton");
	var circle = document.querySelector("#circle");

	// animation variables 
	var scaleFactor = 3;
	var scaleUnit = "px";
	var originalRadius = circle.offsetWidth;

	// indexes 0: inhale, 1: hold, 2: exhale, 3: minutes
	var inputFields = document.querySelectorAll("input");

	////// Breath object (class) definition //////
	// Breath constructor
	function Breath(inhale, hold, exhale, minutes) {

		// Set properties. Need to parse data attributes to base - 10 integers first
		this.inhale = parseInt(inhale, 10);
		this.hold = parseInt(hold, 10);
		this.exhale = parseInt(exhale, 10);
		this.minutes = parseInt(minutes, 10);

		// compute breath counts for breath exercise
		// (given  total seconds for the entire exercise (of multiple breaths) and total seconds for one breathing iteration) 
		this.count = Math.floor(this.returnTotalExerciseSeconds() / this.returnTotalBreathSeconds());
	}

	// animates circle for guided breathing exercise
	Breath.prototype.animateCircle = function () {
		var initialDelay = .5;

		// use TimeLineMax to sequence circle scaling animations (for inhale, followed by exhale, after a hold),
		// and to repeat (count - 1 times, for a complete breathing exercise)
		// Power0 used for smoother animations
		var tl = new TimelineMax({ repeat: this.count - 1, delay: initialDelay });
		tl.to(circle, this.inhale,
			{
				delay: initialDelay,

				// scale circle by scale factor using width and height
				width: (scaleFactor * originalRadius) + scaleUnit, height: (scaleFactor * originalRadius) + scaleUnit,
				ease: Power0.easeIn
			})
			.to(circle, this.exhale,
				{
					width: originalRadius + scaleUnit, height: originalRadius + scaleUnit,
					ease: Power0.easeOut

					// wait for hold
				}, "+=" + this.hold);
	}

	// provides text (in circle) for guided breathing exercise
	Breath.prototype.animateText = function () {
		var tl = new TimelineMax({ repeat: (this.count - 1) });

		// using space delimter to replace word by word (as opposed to char by char)
		// inhale
		tl.to(circle, this.inhale,
			{
				text: {
					value: "inhale",
					delimiter: " ",
				}, ease: Power0.easeIn
			})

			// hold
			.to(circle, this.hold,
				{
					text: {
						value: "hold",
						delimiter: " ",
					}, ease: Power0.linear
				})

			// exhale
			.to(circle, this.exhale,
				{
					text: {
						value: "exhale",
						delimiter: " ",
					}, ease: Power0.easeOut
				})

			// reset text
			.to(circle, 0.01, { text: { value: " ", delimiter: " " }, ease: Power0.easeIn });
	}

	// returns total seconds per breath iteration 
	Breath.prototype.returnTotalBreathSeconds = function () {
		return this.inhale + this.hold + this.exhale;
	}

	// returns breath exercise time in seconds
	Breath.prototype.returnTotalExerciseSeconds = function () {
		return this.minutes * 60;
	}

	// debugging method to print to console object's properties' values
	Breath.prototype.printBreathProfile = function () {
		console.log("Inhale:\t\t" + this.inhale
			+ "\nHold:\t\t" + this.hold
			+ "\nExhale:\t\t" + this.exhale
			+ "\nMinutes:\t" + this.minutes
		);
	}
	////// end of Breath object (class) definition //////

	////// event listeners //////
	// settings button click event listener, to enable/disable editing breath settings
	function toggleSettings() {
		for (var i = 0; i < inputFields.length; i++) {
			inputFields[i].disabled = !inputFields[i].disabled;
		}

		// update settings button styling to indicate editing mode is enabled
		settingsButton.classList.toggle("editMode");
	}

	// play button click event listener, to start guided breathing circle animation
	function startCircleAnimation() {
		breath.animateCircle();
	}

	// play button click event listener, to start guided breathing text animation
	function startTextAnimation() {
		breath.animateText();
	}

	// input fields' change event listener, to update breath object with input values on change of values
	function updateBreathSettings() {
		breath.inhale = parseInt(inputFields[0].value, 10);
		breath.hold = parseInt(inputFields[1].value, 10);
		breath.exhale = parseInt(inputFields[2].value, 10);
		breath.minutes = parseInt(inputFields[3].value, 10);
		// breath.printBreathProfile(); // for debugging
	}

	////// event listeners' registration //////	
	settingsButton.addEventListener("click", toggleSettings, false);

	// two listeners on playButton for simultaneous animations (circle scale and text) 
	playButton.addEventListener("click", startCircleAnimation, false);
	playButton.addEventListener("click", startTextAnimation, false);

	// register event handler updateBreathSettings (on all input fields) 
	// to update breath object with input values on change of values
	for (var i = 0; i < inputFields.length; i++) {
		inputFields[i].addEventListener("change", updateBreathSettings, false)
	}

	// instantiate a Breath obejct using default values set in html input fields
	var breath = new Breath(inputFields[0].value, inputFields[1].value, inputFields[2].value, inputFields[3].value);
})();