// All links-related publications

import { Links } from '../links.js';
import { Meteor } from 'meteor/meteor';

Meteor.publish('links.all', function () {
  return Links.find();
});
