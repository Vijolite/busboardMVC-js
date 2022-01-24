const Test = require('../models/Test');
const fetch = require("node-fetch");
const Disruption = require("../models/Disruption");
const Bus = require("../models/Bus");

exports.getTestData = (req, res) => {
	let data = [
		new Test('Test name', 12),
		new Test('Second name', 13)
	];
	res.render('testView', {
		data : data,
	});
};

exports.getSecondTestData = (req, res) => {
	let data = [
		new Test('other name', 15),
		new Test('other second name', 16)
	];
	res.render('testView', {
		data : data,
	});
};

exports.getAllBusDisruptions = async (req, res) => {
	const url = "https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption";

	const response = await fetch(url);
	const disruptionsResponse = await response.json();

	const disruptions = disruptionsResponse.map(
		dis => new Disruption(
			dis.commonName,
			dis.description,
			dis.fromDate,
			dis.toDate
		)
	);

	res.render('disruptionListView', {
		data: disruptions,
	});
};


exports.getbusBoard = async (req, res) => {
	
	const API_KEY="4c2ec6355dc441148aedf4a24a48bb8"; 
	const busStopCode="490008660N";
    const url = "https://api.tfl.gov.uk/StopPoint/"+busStopCode+"/Arrivals"; //?app_key="+API_KEY;

	const response = await fetch(url);
	const data = await response.json();
	data.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation );
	console.log(data);
	const busBoard = data.map (
		b => new Bus (
			b.destinationName,
			Math.floor(b.timeToStation/60)
		)
	);

	res.render('busListView', {
		data: busBoard,
	});
}
