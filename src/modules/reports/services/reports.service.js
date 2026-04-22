const path = require('node:path');

const { readJsonArray } = require('../../../utils/jsonStore');
const HttpError = require('../../../utils/httpError');
const { th } = require('framer-motion/client');

const TASKS_FILE_PATH = path.join(process.cwd(), 'data', 'tasks.json');
const ACTIVITY_FILE_PATH = path.join(process.cwd(), 'data', 'activity.json');


async function getTasksSummary({ recentDays = 30 } = {}) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const activities = await readJsonArray(ACTIVITY_FILE_PATH);

  if (!Array.isArray(tasks)) {
    throw new HttpError(500, 'Failed to load tasks data.');
  }

  if (!Array.isArray(activities)) {
    throw new HttpError(500, 'Failed to load activity data.');
  }

  const byStatus = {
    todo: 0,
    'in-progress': 0,
    done: 0,
  };

  if(tasks.length === 0 && activities.length === 0) {
    throw new HttpError(404, 'No tasks or activity found.');
  }
  const total = tasks.length;

  for (const task of tasks) {
    const raw = typeof task.status === 'string' ? task.status : null;
    const status = raw ? raw.trim().toLowerCase() : null;

    if (status === 'done') byStatus.done += 1;
    else if (status === 'in-progress' || status === 'inprogress') byStatus['in-progress'] += 1;
    else if (status === 'todo') byStatus.todo += 1;
    else {
      if (task.completed) byStatus.done += 1;
      else byStatus.todo += 1;
    }
  }

  let recentActivityCount = 0;
  const days = Number(recentDays);

  if (Number.isFinite(days) && days > 0) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    for (const a of activities) {
      const when = a && a.when ? Date.parse(a.when) : NaN;
      if (!Number.isNaN(when) && when >= cutoff) recentActivityCount += 1;
    }
  } else {
    recentActivityCount = activities.length;
  }
  
  return {
    total,
    byStatus,
    recentActivityCount,
  };
}

module.exports = {
  getTasksSummary,
};
