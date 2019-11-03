//Require Express for handling HTTP requests
const express = require('express')
const app = express();
//Use an environment variable to externally set PORT or else default to 3000
const port = process.env.PORT || 3000;

//Require proj4 model to perform coordinate system reprojections
var proj4 = require("proj4")

//Require performance-now to measure transformation speed
var now = require("performance-now")

//Testing
//Variable for longitude/eastings 
//var x = -0.1276307;
//Variable for latitude/northings
//var y = 51.5077118;

//Variables for monitoring performance
var t0;
var t1;

//Variable for handling output
var output_coords;

//OGC WKT Projection strings via spatialreference.org
//WGS84 (EPSG:4326)
WGS84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
//British National Grid (EPSG:27700) 
OSGB = 'PROJCS["OSGB 1936 / British National Grid",GEOGCS["OSGB 1936",DATUM["OSGB_1936",SPHEROID["Airy 1830",6377563.396,299.3249646,AUTHORITY["EPSG","7001"]],AUTHORITY["EPSG","6277"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4277"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",49],PARAMETER["central_meridian",-2],PARAMETER["scale_factor",0.9996012717],PARAMETER["false_easting",400000],PARAMETER["false_northing",-100000],AUTHORITY["EPSG","27700"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]';
//Irish Transverse Mercator (EPSG:2157)
IRENET = 'PROJCS["IRENET95 / Irish Transverse Mercator",GEOGCS["IRENET95",DATUM["IRENET95",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6173"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4173"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",0.99982],PARAMETER["false_easting",600000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","2157"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]';
//Irish Grid (EPSG:29903)
TM75 = 'PROJCS["TM75 / Irish Grid",GEOGCS["TM75",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],AUTHORITY["EPSG","29903"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]';

/////////Server execution/////////

//Create the api routes, code blocks and responses
app.get('/', (req, res) => res.send('Proj4js Server'))

app.get('/WGS84_OSGB/:lon/:lat', (req, res) => {
	console.log('Call Received to WGS84_OSGB endpoint'),
	
	t0 = now(),
	WGS84_OSGB(Number(req.params.lon),Number(req.params.lat)),
	t1 = now(),
	
	console.log('Input Coordinates: ', req.params.lon, ',', req.params.lat),
	console.log('Output Coordinates: ', output_coords),
	console.log('Coordinate Tranformation took ' + (t1 - t0) + ' milliseconds.'),
	
	res.send(output_coords);
});

app.get('/WGS84_IRENET/:lon/:lat', (req, res) => {
  	console.log('Call Received to WGS84_IRENET endpoint'),
  	
	t0 = now(),
	WGS84_IRENET(Number(req.params.lon),Number(req.params.lat)),
	t1 = now(),
	
	console.log('Input Coordinates: ', req.params.lon, ',', req.params.lat),
	console.log('Output Coordinates: ', output_coords),
	console.log('Coordinate Tranformation took ' + (t1 - t0) + ' milliseconds.'),
	
	res.send(output_coords);
});

app.get('/WGS84_TM75/:lon/:lat', (req, res) => {
	console.log('Call Received to WGS84_TM75 endpoint'),
	
	t0 = now(),
	WGS84_TM75(Number(req.params.lon),Number(req.params.lat)),
	t1 = now(),
	
	console.log('Input Coordinates: ', req.params.lon, ',', req.params.lat),
	console.log('Output Coordinates: ', output_coords),
	console.log('Coordinate Tranformation took ' + (t1 - t0) + ' milliseconds.'),
	
	res.send(output_coords);
});

//Create the server and listen on selected port
app.listen(port, () => console.log(`Proj4js server listening on port ${port}...`));

/////////Functions/////////

function WGS84_OSGB(x,y)
{
	//Transform FROM first projection
	var firstProjection = WGS84;
	//Transform TO second projection
	var secondProjection = OSGB; 
	output_coords = proj4(firstProjection,secondProjection,[x,y]);
	return output_coords;
}

function WGS84_IRENET(x,y)
{
	//Transform FROM first projection
	var firstProjection = WGS84;
	//Transform TO second projection
	var secondProjection = IRENET; 
	output_coords = proj4(firstProjection,secondProjection,[x,y]);
	return output_coords;
}

function WGS84_TM75(x,y)
{
	//Transform FROM first projection
	var firstProjection = WGS84;
	//Transform TO second projection
	var secondProjection = TM75; 
	output_coords = proj4(firstProjection,secondProjection,[x,y]);
	return output_coords;
}