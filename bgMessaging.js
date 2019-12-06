// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type {RemoteMessage} from 'react-native-firebase';

export default async (message: RemoteMessage) => {
  console.log(message);

  return Promise.resolve();
};
