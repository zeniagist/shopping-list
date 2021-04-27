import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
// Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import '@firebase/firestore';


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
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
    this.referenceShoppingLists = firebase.firestore().collection("shoppinglist");
  }

  componentDidMount() {
    this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');
    this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text} >All Shoppling Lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) =>
            <Text style={styles.item} >{item.name}: {item.items}</Text>}
        />
        <StatusBar style="auto" />
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
