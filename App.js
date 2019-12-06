/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

const App: () => React$Node = () => {
  useEffect(() => {
    checkPermission();
  });
  useEffect(() => {
    messageListener();
  });
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('before fcmToken: ', fcmToken);
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('after fcmToken: ', fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
};

const requestPermission = async () => {
  firebase
    .messaging()
    .requestPermission()
    .then(() => {
      getToken();
    })
    .catch(error => {
      console.log('permission rejected');
    });
};

const checkPermission = async () => {
  firebase
    .messaging()
    .hasPermission()
    .then(enabled => {
      if (enabled) {
        console.log('Permission granted');
        getToken();
      } else {
        console.log('Request Permission');
        requestPermission();
      }
    });
};

const messageListener = async () => {
  this.notificationListener = firebase
    .notifications()
    .onNotification(notification => {
      console.log('On notification:', notification);

      const {title, body} = notification;
      showAlert(title, body);
    });

  this.notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(notificationOpen => {
      console.log(' notification open', notificationOpen);

      const {title, body} = notificationOpen.notification;
      showAlert(title, body);
    });
  this.topicListener = firebase.messaging().subscribeToTopic('News');
  this.messageListener = firebase.messaging().onMessage(message => {
    console.log(JSON.stringify(message));
  });
};

const showAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
};
