const reportsService = require('../services/reports.service');

async function getTasksSummary(req, res) {
  const recentDays = req.query.recentDays ? parseInt(req.query.recentDays, 10) : undefined;
  const summary = await reportsService.getTasksSummary({ recentDays });
  res.status(200).json(summary);
}

module.exports = {
  getTasksSummary,
};
