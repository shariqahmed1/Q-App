import React from 'react';
import {
  StyleSheet,
  View,
  Switch,
  TouchableOpacity,
  Text,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import {Item} from 'native-base';
import moment from 'moment';
import {ListItem,Icon} from 'react-native-elements';
import {checkAppointmentTimeIsStartOrNot,FIREBASE_DATABASE} from '../../constants/Functions';
import {updateUser } from '../../Redux/Action/Action';

class SettingsForCompany extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userData:this.props.myData,
      SwitchValue:this.props.myData.isAllowToken,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({userData:nextProps.myData})
  }

  static navigationOptions = {
    title: "Settings",
  };

  tokenHandle(flag){
    const {userData} = this.state;
    this.setState({SwitchValue:flag});
    FIREBASE_DATABASE.ref('users').child(userData.id).update({isAllowToken:flag,AppointmentCloseDate:moment().format("M/D/YYYY, h:mm:ss a")})
    .then(() =>{
        this.props.updateUser(userData.id);
    })
    .catch((err)=>{
        console.log(err.message);
    })
  }

  // c >= d
  // var a = data.AppointmentCloseDate;
  // var b = a.split(",");
  // Date.parse(b[0]) - Date.parse(new Date().toLocaleDateString()) < 0

  render() {
    const {userData} = this.state;
    let checkTodayOrTommorow = checkAppointmentTimeIsStartOrNot(userData.timings.startTime);

    return (
        <View style={styles.container}>
            <View style={styles.viewContainer}>
                
                <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 15, paddingTop: 10, paddingBottom: 13 }}>Account Info</Text>
                
                <Item></Item>
                
                <TouchableOpacity
                >
                    <ListItem
                        title={`Edit Account Details`}
                        titleStyle={{fontSize:14}}
                        containerStyle={{borderBottomColor:'transparent'}}
                        onPress={()=>this.props.navigation.navigate('CompanyEditDetails')}
                        rightIcon={
                            <Icon name='plus'
                                type='material-community'
                                color='transparent'
                                size={28}
                            />
                        }
                    />
                </TouchableOpacity>

                <Item></Item>

                <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 15, paddingTop: 15, paddingBottom: 13 }}>Appointments</Text>

                <Item></Item>

                <ListItem
                    title={`${userData.isAllowToken ?  "Deny" : "Allow"} ${checkTodayOrTommorow ?  "Tomorrow's" : "Today's"} Appointments`}
                    titleStyle={{fontSize:14, fontWeight:'bold'}}
                    containerStyle={{borderBottomColor:'transparent', paddingLeft:0, marginLeft:0, marginHorizontal:0}}
                    rightIcon={
                        <Switch
                            onValueChange={(value) => this.tokenHandle(value)}
                            value={this.state.SwitchValue} 
                        />
                    }
                />

            </View>
      </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
  },
  listStyle:{
    marginTop: 15,
    marginBottom: 10,
  },
  viewContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 15,
      marginBottom: 10,
  },
});


const mapStateToProps = (state) => {
  return {
      myData: state.AuthReducer.user,
  }
 }

 const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (data) => dispatch(updateUser(data)),
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(SettingsForCompany);