const aSvc = require('../services/activity.service');

async function getActivity(req, res) {
  const x = await aSvc.getAllActivity();
  res.json(x);
}

async function addActivity(req, res) {
  const bodyData = req.body || {};
  const made = await aSvc.createNewActivity(bodyData);
  res.status(201).json(made);
}

module.exports = {
  getActivity,
  addActivity,
};
