const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');
const { createId } = require('../../../utils/id');
const HttpError = require('../../../utils/httpError');
const path = require('node:path');
const { validateCreateActivity } = require('../utils/activityValidator');

const filePath = path.join(process.cwd(), 'data', 'activity.json');

async function loadActivityData() {
  const data = await readJsonArray(filePath);

  if (!Array.isArray(data)) {
    throw new HttpError(500, 'Activity data must be an array');
  }

  return data;
}

async function getAllActivity() {
  const arr = await loadActivityData();
  if (!arr) {
    throw new HttpError(500, 'Failed to load activity data');
  }
  return arr;
}

async function createNewActivity(bodyData) {
  const normalized = validateCreateActivity(bodyData);

  const list = await loadActivityData();
  const newActivity = {
    id: createId(),
    action: normalized.action,
    info: normalized.info,
    when: new Date().toISOString(),
  };

  list.push(newActivity);
  await writeJsonArray(filePath, list);
  return newActivity;
}

module.exports = {
  getAllActivity,
  createNewActivity,
};
