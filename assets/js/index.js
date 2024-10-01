/* eslint-disable no-var, vars-on-top */
'use strict';

require('hof/frontend/themes/gov-uk/client-js');

const accessibleAutocomplete = require('accessible-autocomplete');

document.querySelectorAll('.typeahead').forEach(function applyTypeahead(element) {
  accessibleAutocomplete.enhanceSelectElement({
    defaultValue: '',
    selectElement: element
  });
});

document.querySelectorAll('.autocomplete__input').forEach(function(element) {
  element.setAttribute('name', element.id + '-auto');
})
