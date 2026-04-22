const express = require('express');

const c = require('../controllers/activity.controller');
const asyncHandler = require('../../../middleware/asyncHandler');

const activityRouter = express.Router();

activityRouter.get('/', asyncHandler(c.getActivity));
activityRouter.post('/', asyncHandler(c.addActivity));

module.exports = activityRouter;
