var util = require('util');
require('shelljs/global');

var output;
var env = require('../.env.js');

// Used for local development with webpack-dev-server
output = util.inspect(env, {depth: null});
output = 'window.__env = ' + output + ';\n';
output.to('__/env.js');

// Used to test build with divshot server
output = JSON.stringify(env, null, 2);
output = output + '\n';
output.to('.env.json');
