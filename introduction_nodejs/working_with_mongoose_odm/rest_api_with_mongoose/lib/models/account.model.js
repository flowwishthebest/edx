const mongoose = require('mongoose');
const { AccountSchema } = require('./schemas');

mongoose.model('Account', AccountSchema);
