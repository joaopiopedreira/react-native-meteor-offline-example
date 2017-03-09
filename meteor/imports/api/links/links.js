// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const Links = new Mongo.Collection('links');

// Allow all client-side updates
Links.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});