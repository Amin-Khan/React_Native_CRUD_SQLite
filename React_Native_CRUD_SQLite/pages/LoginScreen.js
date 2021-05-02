// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to register the user

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'MyDatabase.db' });

const LoginScreen = ({ navigation }) => {
  let [userName, setUserName] = useState('');
  let [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tbl_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_password VARCHAR(20), user_address VARCHAR(255))',
              []
            );
          }
        }
      );
    });
  }, []);

  let register_user = () => {
    console.log(userName, userPassword);

    if (!userName) {
      alert('Please fill name');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM tbl_user WHERE user_name = ? and user_password = ?',
        [userName, userPassword],
        function (tx, res) {
          console.log('Results', res.rows.length);
          if (res.rows.length > 0) {
            navigation.navigate('View', {
              user: userName
            });
            // Alert.alert(
            //   'Success',
            //   'You are Registered Successfully',
            //   [
            //     {
            //       text: 'Ok',
            //       onPress: () => navigation.navigate('HomeScreen'),
            //     },
            //   ],
            //   { cancelable: false }
            // );
          } else alert('User does not exist');
        }
      );
    });
  };

  
  return (
    
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Enter Name"
                onChangeText={
                  (userName) => setUserName(userName)
                }
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Enter Password"
                onChangeText={
                  (userPassword) => setUserPassword(userPassword)
                }
                maxLength={10}
                style={{ padding: 10 }}
              />
              <Mybutton title="Login" customClick={register_user} />
              <Mybutton
            title="Register"
            customClick={() => navigation.navigate('Register')}
          />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
    
  );
};


export default LoginScreen;