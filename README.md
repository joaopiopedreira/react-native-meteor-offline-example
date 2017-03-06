Demo app to go along with this blog post, which covers a potential implementation on making an offline first React Native + Meteor app.

## Problem description

There are two problems:

1. The insert in `app/index.js` only works in disconnected mode, but the items are rejected in connected mode,
2. the update on longPress in `app/index.js` does not work.

## Installation

- Install Meteor
- Install React Native
- Clone repository

## Running Meteor App

- `cd meteor/`
- `meteor npm install`
- `meteor`

## Running React Native App

- `cd react-native/`
- `react-native run-ios` OR `react-native run-android`
