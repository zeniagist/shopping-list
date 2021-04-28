import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
// Firebase
const firebase = require('firebase');
require('firebase/firestore');
require('firebase/auth')


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
    };

    // config Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAJZpCY0YUMpDATBkibWG5glyKen_svPww",
      authDomain: "test-b0672.firebaseapp.com",
      projectId: "test-b0672",
      storageBucket: "test-b0672.appspot.com",
      messagingSenderId: "82820309108",
      appId: "1:82820309108:web:25aad00bf01b2e95d2f121",
      measurementId: "G-0LH3RN6XB0"
    };

    //Connect to Firebase
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    // Initialize Firebase
    this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);
  }

  // update Firebase collection data
  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  }

  addList() {
    // add a new list to the collection
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid,
    });
  }

  // load Firebase collection data onload
  componentDidMount() {
    // creating a references to shoppinglists collection
    this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });

      // create a reference to the active user's documents (shopping lists)
      this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);
      // listen for collection changes for current user 
      this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);



    });
  }

  // stop receiving Firebase collection data
  componentWillUnmount() {
    this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)
    // listen for collection changes for current user
    this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        <Text style={styles.text} >All Shopping Lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) =>
            <Text style={styles.item} >{item.name}: {item.items}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ backgroundColor: 'blue' }}>
          <Button
            onPress={() => this.addList()}
            title='Add Something'
            color='white'
          ></Button>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  },
});
