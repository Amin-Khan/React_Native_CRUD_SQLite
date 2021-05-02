// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to view single user

import React, { useState , useEffect } from 'react';
import { Text, View, SafeAreaView, Alert } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'MyDatabase.db' });

const ViewUser = ({route, navigation}) => {
  let paramUserName = route.params.user;
  console.log(paramUserName + " params");
  let [userData, setUserData] = useState({});

  useEffect(() => { 
    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM tbl_user WHERE user_name = ?',
        [route.params.user],
        function (tx, res) {
          console.log('Results on View ', res.rows.length);
          if (res.rows.length > 0) {
            setUserData(res.rows.item(0));
          } else alert('User does not exist');
        }
      );
    });
  }, []);

  let deleteUser = () => {
    Alert.alert(
      'Confirm',
      'Are you sure?',
      [
        {
          text: 'Ok',
          onPress: () => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM  tbl_user where user_id=?',
                [userData.user_id],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'User deleted successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('LoginScreen'),
                        },
                      ],
                      { cancelable: false }
                    );
                  } else {
                    alert('Please insert a valid User Id');
                  }
                }
              );
            });
            navigation.navigate('View')},
        },
      ],
      { cancelable: true }
    );
   
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginLeft: 35,
              marginRight: 35,
              marginTop: 10
            }}>
              <Text style={{marginBottom:20, fontSize:20}}>Welcome! Please find below your details.</Text>
            <Text style={{fontSize:16}}>User Id: {userData.user_id}</Text>
            <Text style={{fontSize:16}}>User Name: {userData.user_name}</Text>
            <Text style={{marginBottom:20, fontSize:16}}>User Address: {userData.user_address}</Text>
            <Mybutton
            title="Update"
            customClick={() => navigation.navigate('Update', {
              user: route.params.user,
              password: userData.user_password,
              address: userData.user_address,
              id:userData.user_id
            })}
          />
          <Mybutton
            title="Delete"
            customClick={deleteUser}
          />
          <Mybutton
            title="Logout"
            customClick={() => navigation.navigate('LoginScreen')}
          />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewUser;