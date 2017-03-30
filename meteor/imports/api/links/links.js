// Definition of the links collection

// import { Mongo } from 'meteor/mongo';
import OfflineCollectionVersions from '../../api/offlineCollections/offlineCollectionVersions';
import OfflineMongo from '../../api/offlineCollections/collectionTransformer';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const collectionName = 'links';

if (!OfflineCollectionVersions.findOne({ collection: collectionName })) {
  OfflineCollectionVersions.insert({
    collection: collectionName,
    offlineVersion: Random.id()
  });
}

let schema = new SimpleSchema({
  url: String,
  title: String,
  createdAt: Date,
});

export const Links = new OfflineMongo(collectionName);

// old style
// const Links = new OfflineMongo(collectionName);


// Links.attachSchema(Links.schema);

// Allow all client-side updates
Links.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// export default Links;