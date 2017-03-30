// Methods related to links

import { Links } from './links';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Meteor.methods({
//   'links.insert'(title, url) {
//     check(url, String);
//     check(title, String);

//     return Links.insert({
//       url,
//       title,
//       createdAt: new Date(),
//     });
//   },
// });

// export const insertLinks = new ValidatedMethod({
//   name: 'Links.insertLinks',
//   validate: Links.schema.validator(),
//   run(doc) {
//     return Links.insert(doc);
//   },
// });

export const insertLinks = new ValidatedMethod({
  name: 'Links.insertLinks',
  validate: new SimpleSchema({
    url: String,
    title: String,
    createdAt: Date,
  }).validator(),
  run(doc) {
    console.log(doc);
    return Links.insert(doc);
  },
});