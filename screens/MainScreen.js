import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import CompanyAccountScreen from './Company/CompanyAccountScreen';
import UserAccountScreen from './User/UserAccountScreen';
// import {Permissions, Notifications} from 'expo';

// async function registerForPushNotificationsAsync() {
//   const { status: existingStatus } = await Permissions.getAsync(
//     Permissions.NOTIFICATIONS
//   );
//   let finalStatus = existingStatus;
//   if (existingStatus !== 'granted') {
//     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//     finalStatus = status;
//   }
//   if (finalStatus !== 'granted') {
//     return;
//   }
//   let token = await Notifications.getExpoPushTokenAsync();
//   console.log(token);
// }


class MainScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userData:this.props.myData,
      isLogin:this.props.isLogin,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      userData:nextProps.myData,
      isLogin:nextProps.isLogin
    })
  }

  static navigationOptions = {
    header:null
  }
  

  pageRender(){
    const {userData} = this.state;
    if(userData.accType === "company"){
      return <CompanyAccountScreen {...this.props} />; 
    }
    else{
      return <UserAccountScreen {...this.props}  />;
    }
  }


  render() {
    const {isLogin} = this.state;
    return (
      isLogin ?
        <View style={styles.container}>
          {this.pageRender()}
        </View>
        : this.props.navigation.navigate('Login')
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
  },
});


const mapStateToProps = (state) => {
  return {
      myData: state.AuthReducer.user,
      isLogin: state.AuthReducer.isLogin,
  }
 }

 const mapDispatchToProps = (dispatch) => {
  return {
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);