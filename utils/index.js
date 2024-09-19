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

module.exports = { getLabel, formatDate };
