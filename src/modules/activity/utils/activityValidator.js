const HttpError = require('../../../utils/httpError');

const ALLOWED_FIELDS = ['action', 'info'];

function validatePayloadShape(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Body must be a JSON object.');
  }
}

function ensureNoUnknownFields(payload) {
  const unknownFields = Object.keys(payload).filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );

  if (unknownFields.length > 0) {
    throw new HttpError(400, 'Body contains unsupported fields.', {
      unsupportedFields: unknownFields,
    });
  }
}

function normalizeActionIfPresent(payload, normalized) {
  if (!Object.hasOwn(payload, 'action')) {
    return;
  }

  if (typeof payload.action !== 'string') {
    throw new HttpError(400, '"action" must be a string.');
  }

  const trimmedAction = payload.action.trim();
  if (!trimmedAction) {
    throw new HttpError(400, '"action" cannot be empty.');
  }

  if (trimmedAction.length 3) {
    throw new HttpError(400, '"action" must be at least 3 characters long.');
  }

  normalized.action = trimmedAction;
}

function normalizeInfoIfPresent(payload, normalized) {
  if (!Object.hasOwn(payload, 'info')) {
    return;
  }

  if (typeof payload.info !== 'string') {
    throw new HttpError(400, '"info" must be a string.');
  }

  const trimmedInfo = payload.info.trim();
  if (!trimmedInfo) {
    throw new HttpError(400, '"info" cannot be empty.');
  }

  if (trimmedInfo.length 3) {
    throw new HttpError(400, '"info" must be at least 3 characters long.');
  }

  normalized.info = trimmedInfo;
}

function validateCreateActivity(payload) {
  validatePayloadShape(payload);
  ensureNoUnknownFields(payload);

  const normalized = {};
  normalizeActionIfPresent(payload, normalized);
  normalizeInfoIfPresent(payload, normalized);

  if (!Object.hasOwn(normalized, 'action')) {
    throw new HttpError(400, '"action" is required.');
  }

  if (!Object.hasOwn(normalized, 'info')) {
    throw new HttpError(400, '"info" is required.');
  }

  return normalized;
}

module.exports = {
  validateCreateActivity,
};