var express = require('express');
var router = express.Router();
const dbo = require("../db.util");

router.get('/', async function(req, res, next) {
  // console.log('query', req.query)
  // remember all query params are strings
  // have to worry about converting coordinates to a number

  // didn't pass dist to the query but saved to a variable and passed it to leaflet view to create circle on leaflet map
  // has to been in meters?

  const radius = parseInt(req.query.dist);

  let query = {}

  req.query.fav_color ? query['properties.user_fav_color'] = req.query.fav_color : '';
  req.query.origin ? query['geometry.coordinates'] = req.query.origin.split(',').map(el => parseFloat(el)) : '';
  req.query.min_age ? query['properties.user_age'] = {$gte: parseInt(req.query.min_age) }: '';
  req.query.max_age ? query['properties.user_age'] = {$lte: parseInt(req.query.max_age) } : '';

  console.log('query', query); //need to remove empty strings so find works correctly need for in loop ?

  /*
  [{"_id":"637bdac0711b591ab7c9672d","geometry":{"type":"Point","coordinates":[-122.419416,37.774929]},
  "properties":{"user_id":1,"user_name":"Taylor Swift","user_age":32,"user_fav_color":"red","last_location":"San Francisco"}}]
  */
  let db_connect = dbo.getDb("rithm");

  /* query to test max_age 
  db_connect
    .collection("users")
    .find({"properties.user_age": {$lt: 40}}).toArray().then(data => console.log('d', data))
  */

  db_connect
    .collection("users")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      //res.json(result); // pass the result to the leaflet view 

      const locations = result.map(item => item.geometry.coordinates);

      const names = result.map(item => item.properties.user_name);

      const start =  locations[0];

      // better to parse the return data here and return what you need to the view
      // it is tricky to manipulate data in ejs - much more error prone and less stack overflow examples to help you if you get stuck
      res.render('leaflet', { names: names, locations: locations, start: start, radius: radius });
    });
});

module.exports = router;
