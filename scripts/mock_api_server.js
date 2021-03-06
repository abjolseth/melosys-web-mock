/* eslint-disable */
const express = require('express');
var PouchDB = require('pouchdb');

// Add "upsert" and "putIfNotExists" plugin from https://github.com/pouchdb/upsert
PouchDB.plugin(require('pouchdb-upsert'));

var LevelDB = PouchDB.defaults({
  prefix: `${process.cwd()}/scripts/db/`
});


var db = new LevelDB('melosys');
db.putIfNotExists('mydoc', {
  _id: 'mydoc',
  title: 'Heroes'
}).then(function (response) {
  // handle response
}).catch(function (err) {
  console.log(err);
});

const _ = require('underscore');
const app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
//const path = require('path');
const os = require('os');
const moment = require('moment');

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 3002;
const router = express.Router();

router.get('/', function(req, res) {
	db.get('mydoc').then(function (doc) {
    return res.json(doc);
  }).catch(function (err) {
    console.log(err);
  });
});

app.use(allowCrossDomain);
app.use('/melosys/api', router);
app.use('/api', router);

app.listen(port);

function platformNIC() {
  const interfaces = os.networkInterfaces();
  switch (process.platform) {
    case 'darwin':
      return interfaces.lo0;
    case 'linux':
      return interfaces.eno16780032;
    default: // win32
      return interfaces.Ethernet0
  }
}

function getIpAdress() {
  const nic = platformNIC();
  const ipv4 = _.find(nic, function(item){
    return item.family === 'IPv4';
  });
  return ipv4.address;
}


console.log('Test MeloSys mock API server running on http://'+getIpAdress()+':' + port+'/api');