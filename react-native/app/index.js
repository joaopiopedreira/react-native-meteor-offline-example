import { AsyncStorage, Linking, ScrollView, Text, View } from 'react-native';
import { Icon, List, ListItem } from 'react-native-elements'
import Meteor, { createContainer } from 'react-native-meteor';
import React, { Component } from 'react';

import Links from './config/offlineCollections/Links';
import OfflineCollectionVersions from './config/offlineCollections/OfflineCollectionVersions';
import config from './config/config';

Meteor.connect(config.SERVER_URL);

const data = [
  {
    title: 'Meteor',
    url: 'https://www.meteor.com',
  },
  {
    title: 'Learn React Native + Meteor',
    url: 'http://learn.handlebarlabs.com/p/react-native-meteor',
  },
  {
    title: 'React Native',
    url: 'http://facebook.github.io/react-native/',
  }
];

class RNDemo extends Component {
  addItem = () => {
    const item = data[Math.floor(Math.random() * data.length)];
    try {
      Links.insert({
        url: item.url,
        title: item.title,
        createdAt: new Date(),
      });
    } catch (err) {
      this.props.navigator.showLocalAlert(err.message, config.errorStyles);
    }

  };

  pressItem = (linkId) => {
    console.log("Long press! " + linkId);
    try {
      Links.update(linkId, {
        $set: {
          createdAt: new Date()
        },
      });
    } catch (err) {
      this.props.navigator.showLocalAlert(err.message, config.errorStyles);
    }
  };

  render() {
    const links = Links.find();
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView>
          <List containerStyle={{ marginTop: 40 }}>
            <ListItem
              title="Connection Status"
              rightTitle={this.props.status.status}
              hideChevron
            />
          </List>
          <List containerStyle={{ marginBottom: 40 }}>
            {links.map((link) => {
              console.log(link.title);
              return (
                <ListItem
                  key={link._id}
                  title={link.title}
                  subtitle={link.url}
                  rightTitle={"created at: " + new Date(link.createdAt).toUTCString()}
                  onPress={() => this.pressItem(link._id)}
                />
              );
            })}
          </List>
        </ScrollView>
        <Icon
          raised
          name='plus'
          type='font-awesome'
          color='#00aced'
          onPress={this.addItem}
          containerStyle={{ position: 'absolute', bottom: 30, right: 20 }}
          disabled
        />
      </View>
    );
  }
}

export default createContainer(() => {

  const subscribe = (query) => {
    console.log("test")

    // Store the collection "OfflineCollectionVersions" for offline use
    Meteor.subscribe('offlineCollectionVersions', (err) => {
      const items = OfflineCollectionVersions.find();

      if (items.length > 0) {
        OfflineCollectionVersions.store(items);
      }
    });

    // When offline, this collection will be emptied. Seed it with the values stored in AsyncStorage.
    if (OfflineCollectionVersions.find().length === 0) {
      OfflineCollectionVersions.seed();
    }

    // Sync the Links collection
    if (Links.find().length === 0) {
      !Links.syncing && Links.sync({
        query: query,
        syncCallback: (links) => {
          console.log('synced Links in index.js');
          console.log(`Number of links: ${links && links.length}`);
        }
      });
    }

    Meteor.ddp.on('added', (payload) => {
      //console.log('Doc added', payload);

      // Sync the Links collection
      if (payload && payload.collection === 'offlineCollectionVersions') {
        if (payload.fields && payload.fields.collection === 'locations') {
          !Links.syncing && Links.sync({
            query: query,
            syncCallback: (links) => {
              console.log('synced Links in index.js');
              console.log(`Number of links: ${links && links.length}`);
            }
          });
        }
      }
    });


    Meteor.ddp.on('changed', (payload) => {
      //console.log('Doc changed', payload);

      const linksOfflineVersionId = OfflineCollectionVersions.findOne({ collection: 'links' })._id;

      // Sync the Links collection
      if (payload && payload.collection === 'offlineCollectionVersions') {
        const newLinksOfflineVersion = payload.fields && (payload.id === linksOfflineVersionId) && payload.fields.offlineVersion;
        const oldLinksOfflineVersion = OfflineCollectionVersions.findOne(linksOfflineVersionId).offlineVersion;

        // Sync the Links collection
        if (newLinksOfflineVersion && newLinksOfflineVersion !== oldLinksOfflineVersion && changedEventIds.indexOf(newLinksOfflineVersion) === -1) {
          //console.log(`newLinksOfflineVersion: ${newLinksOfflineVersion}; oldLinksOfflineVersion: ${oldLinksOfflineVersion}`);

          // TODO: prevent the same 'changed' event to trigger a sync. See react-native-meteor internals
          changedEventIds.push(newLinksOfflineVersion);

          !Links.syncing && Links.sync({
            query: query,
            syncCallback: (links) => {
              console.log('synced Links in index.js');
              console.log(`Number of links: ${links && links.length}`);
            }
          });
        }

      }
    });

  }
  const query = {};
  subscribe({ query });

  return {
    status: Meteor.status()
  };
}, RNDemo);
