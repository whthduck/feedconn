const express = require('express');
const { Feedconn } = require('../dist');
const credential = require('../dist/cert/cert.json');
const database = require('../dist/cert/database.json');
const messageExample = require('../dist/cert/data.json');

process.on('uncaughtException', function (err) {
  console.info('*** DEBUG uncaughtException ***');
  console.error(err.stack);
});

const app = express();
const feedconnApp = new Feedconn().loadByConfig({
  app: 'app',
  credential: {
    ...credential,
    projectId: credential['projectId'] || credential.project_id,
    privateKey: credential['privateKey'] || credential.private_key,
    clientEmail: credential['clientEmail'] || credential.client_email,
  },
  databaseURL: database.url,
});

app.route('/:key').post(async function (req, res, next) {
  try {
    const result = await feedconnApp.send(
      'whthduck',
      messageExample[req.params.key],
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.code || 400).send({ ...err, message: err.message });
  }
});

app.listen(3000);
