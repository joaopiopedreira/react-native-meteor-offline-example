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

    // Meteor.call('links.insert', item.title, item.url, (error) => {
    //   if (error) {
    //     console.log('Insert error', error.error);
    //   }
    // });

    // insert works only in disconnected mode
    // Meteor.collection('links').insert({
    //   url: item.url,
    //   title: item.title,
    //   createdAt: new Date(),
    // });
    Links.insert({
      url: item.url,
      title: item.title,
      createdAt: new Date(),
    });

  };

  pressItem = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.log('Linking error: ', err));
  };

  longPressItem = (linkId) => {
    // update createdAt at long press
    Links.update(linkId, {
      $set: { createdAt: new Date() },
    });
  };

  render() {
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
            {this.props.links.map((link) => {
              return (
                <ListItem
                  key={link._id}
                  title={link.title}
                  subtitle={link.url}
                  rightTitle={"created at: " + new Date(link.createdAt).toUTCString()}
                  onPress={() => this.pressItem(link.url)}
                  onLongPress={() => this.longPressItem(link._id)}
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
  Meteor.subscribe('links.all');

  return {
    links: Meteor.collection('links').find(),
    status: Meteor.status(),
  };
}, RNDemo);
