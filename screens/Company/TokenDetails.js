import React from 'react';
import {FIREBASE_DATABASE} from '../../constants/Functions';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import { CheckBox} from 'native-base';
import { Button  } from 'react-native-elements'
import { updateUser } from '../../Redux/Action/Action';
import {Item, Input } from 'native-base';

class AddTodaysToken extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userData:this.props.myData,
      todaysTotalToken:this.props.myData.tokenDetails ? this.props.myData.tokenDetails.todaysTotalToken :'',
      estimatedTime:this.props.myData.tokenDetails ? this.props.myData.tokenDetails.estimatedTime :'',
      checked:this.props.myData.tokenDetails ? this.props.myData.tokenDetails.dailySettings :false,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({userData:nextProps.myData})
  }

  static navigationOptions = {
    title: "Token Details",
  };

  updateDetails(){
    const {userData,todaysTotalToken,estimatedTime,checked} = this.state;
    if(todaysTotalToken === "" || estimatedTime === ""){
        ToastAndroid.show('All fields are required',ToastAndroid.SHORT);
    }
    else{
      ToastAndroid.show(`${userData.tokenDetails ? "Updating..." : "Adding..."}`,ToastAndroid.SHORT);
      FIREBASE_DATABASE.ref('users').child(userData.id).update({
            tokenDetails:{
                todaysTotalToken:todaysTotalToken,
                estimatedTime:estimatedTime,
                dailySettings:checked,
            }
        })
        .then(()=>{
          FIREBASE_DATABASE.ref('token').child(userData.id).update({
                totalTokens:todaysTotalToken,
                estimatedTime:estimatedTime,
            })  
        })
        .then(()=>{
            ToastAndroid.show(`${userData.tokenDetails ? "Successfully Updated !" : "Successfully Added !"}`,ToastAndroid.SHORT);
            this.props.updateUser(userData.id);
        })
        .catch((err)=>{
            console.log(err.message)
        })
    }
  }

  componentDidMount(){
    // console.log(this.state.userData);
  }

  render() {
    const {userData, todaysTotalToken,estimatedTime} = this.state;
    let checkDetails = userData.tokenDetails ? "Update" : "Add";
    
    return (
        <View style={styles.container}>
            <View style={styles.inputs}>
                <Text style={styles.label}>Tokens <Text style={{fontSize:13,color:'#2E8B57'}}>*</Text></Text>
                <Item>
                    <Input style={styles.fields} value={todaysTotalToken} keyboardType='numeric' onChangeText={(text) => this.setState({todaysTotalToken:text.replace(/[^0-9]/g, '')})}  placeholder="Enter number of tokens to allow in a day"/>
                </Item>
                <Text style={styles.label}>Estimated Time <Text style={{fontSize:13,color:'#2E8B57'}}>*</Text></Text>
                <Item>
                    <Input style={styles.fields} value={estimatedTime} keyboardType='numeric' onChangeText={(text) => this.setState({estimatedTime:text.replace(/[^0-9]/g, '')})}  placeholder="Enter estimated time of each token in minutes"/>
                </Item>
                <View style={{
                    flexDirection:'row',
                    paddingLeft:2,
                    paddingTop:20,
                    marginBottom:1,
                    fontSize:15
                }}>
                    <CheckBox checked={this.state.checked} onPress={() =>this.setState({checked:!this.state.checked})} color="#005068" />
                    <Text style={{marginLeft:20}} onPress={() => this.setState({checked:!this.state.checked})}>Apply these settings daily</Text>
                </View>
            </View>

            <View style={{marginTop:20,marginBottom:10,justifyContent:'center',alignItems:'center'}}>
                <Button
                  onPress={() => { this.updateDetails() }}
                  title={`${checkDetails} Details`}
                  buttonStyle={{
                    backgroundColor: "rgba(47,79,79,1)",
                    width: 185,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 2
                  }}
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
  inputs:{
    marginTop:10,
    padding:10,
  },
  label:{
    paddingLeft:6,
    paddingTop:20,
    marginBottom:1,
    fontSize:15
  },
  fields:{
    fontSize:15
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
    updateUser: (data) => dispatch(updateUser(data)),
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(AddTodaysToken);