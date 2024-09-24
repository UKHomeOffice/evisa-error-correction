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
  return new Intl.DateTimeFormat(config.dateLocales).format(dateObj);
};

const genErrorMsg = error => {
  const errorDetails = error.response?.data ? `Cause: ${JSON.stringify(error.response.data)}` : '';
  const errorCode = error.code ? `${error.code} -` : '';
  return `${errorCode} ${error.message}; ${errorDetails}`;
};

module.exports = { getLabel, formatDate, genErrorMsg };
