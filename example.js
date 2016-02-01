var remark = require('remark');
var marker = require('./index.js');

// A simple marker:
var result = marker({
    'type': 'html',
    'value': '<!--foo-->'
});

// Yields:
console.log('json', JSON.stringify(result, 0, 2));

// Parameters:
result = marker({
    'type': 'html',
    'value': '<!--foo bar baz=12.4 qux="test test" quux=\'false\'-->'
});

// Yields:
console.log('json', JSON.stringify(result, 0, 2));

// Non-markers:
result = marker({
    'type': 'html',
    'value': '<!doctype html>'
});

// Yields:
console.log('json', JSON.stringify(result, 0, 2));
