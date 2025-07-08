const config = require('../config');
const translations = require('../apps/eec/translations/src/en/fields.json');

const getLabel = (fieldKey, fieldValue) => {
  if ( Array.isArray(fieldValue)) {
    return fieldValue.map(option => translations[fieldKey]?.options[option]?.label).join(', ') || undefined;
  }
  return translations[fieldKey]?.options[fieldValue]?.label || undefined;
};

const formatDate = date => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(config.dateLocales, config.dateFormat).format(dateObj);
};

function truncate(str = '', maxLen = str.length + 1) {
  return str.length >= maxLen ? str.slice(0, maxLen).trimEnd() + '...' : str;
}

/**
 * Generates a useful error message from a typical GovUk Notify Node.js client error reponse object
 *
 * This function is relatively specific to Error objects created by notifications-node-client.
 * It will return at a minimum error.message from the Error object passed in.
 *
 * @param {object} error - An Error object.
 * @returns {string} - An error message for GovUK Notify containing key causal information.
 */
const genNotifyErrorMsg = error => {
  const errorDetails = error.response?.data ? `Cause: ${JSON.stringify(error.response.data)}` : '';
  const errorCode = error.code ? `${error.code} -` : '';
  return `${errorCode} ${error.message}; ${errorDetails}`;
};

module.exports = { getLabel, formatDate, genNotifyErrorMsg, truncate };
