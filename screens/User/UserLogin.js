import React from 'react';
import {FIREBASE_DATABASE} from '../../constants/Functions';
import {
  StyleSheet,
  Alert,
  Image,
  Text,
  ActivityIndicator, 
  ToastAndroid,
  View,
} from 'react-native';
import _ from 'lodash';
import { Button  } from 'react-native-elements'
import {validateEmail} from '../../constants/Functions';
import {Item, Input } from 'native-base';
import { connect } from 'react-redux';
import { updateUser, isAccountCreate } from '../../Redux/Action/Action';
import { Location, Permissions } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';


class UserLogin extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      isLogin:true,
      email:'',
      location: {},
      dataEnterloader:false,
      errorMessage: null,
      isLoader:false,
      myData:this.props.myData,
    }
  }

  static navigationOptions = {
    title: "Finding / Waiting for tokens",
  };

  
  componentWillReceiveProps(nextProps){
    this.setState({myData:nextProps.myData,isLogin:nextProps.isLogin})
  }

  async _getLocationAsync (){
    this.setState({isLoader:true,errorMessage:''})
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
        isLoader:false,
      });
    }
    await Location.getProviderStatusAsync()
    .then(async res=>{
      if(res.locationServicesEnabled){
        if(status === 'granted'){
          this._location();
        }
      }
      else{
        Alert.alert(
          'Error',
          'Please enable mobile location !',
        )
        this.setState({
          isLoader:false,
        }); 
      }
    })
  };


  async _location(){
    ToastAndroid.show('Please wait it will take a little time', ToastAndroid.SHORT);
    let locat = await Location.getCurrentPositionAsync({enableHighAccuracy :false});
    this.setState({ location:locat.coords,isLoader:false, errorMessage:'' });
  }

  addDetails(){
    const {location,email,myData} = this.state;
    let cond1 = email !== "";
    let cond2 = _.isEmpty(location);
    if(cond1 && !cond2){
      if (!validateEmail(email)) {
        ToastAndroid.show('Enter valid email', ToastAndroid.SHORT);
      } 
      else {
        this.setState({dataEnterloader:true})
        FIREBASE_DATABASE.ref('users').child(myData.uid).update({
          email:email,
          accType:'user',
          coordinate:location,
          isAccountCreate:true,
        })
        .then(()=>{
          this.setState({dataEnterloader:false,email:''})
          this.props.onPressIsAccountCreate(true);
          this.props.updateUser(myData.uid);
        })
        .then(()=>{
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          });
          this.props.navigation.dispatch(resetAction);
        })
        .catch(err=>{
          console.log(err.message)
        })
      }      
    }
    else{
      Alert.alert(
        'Error',
        'Please enter email address',
      )
    }
  }


  render() {
    const {isLogin, email,location,errorMessage,isLoader,dataEnterloader} = this.state;
    let checkLocation = _.isEmpty(location);
    let disableBtn =  isLoader ? true : false;

    return (
      isLogin ? 
        <View style={styles.container}>
        {dataEnterloader ? 
          <View  style={{width: '100%', backgroundColor:'#000', opacity:0.5, height: '100%', position:'absolute', flex:1, flexDirection:'column',justifyContent:'center',alignItems:'center', zIndex: 1}}>
            <Image
              style={{width: 100, height: 100}}
              source={require('../images/loading.gif')}
            />
          </View> : <View />
        }
          <Text style={{fontSize:18,textAlign:'center',marginTop:35, fontWeight:'bold'}}>Add Details</Text>
          <View style={styles.inputs}>
            <Text style={styles.label}>Email Address <Text style={{fontSize:13,color:'#2E8B57'}}>*</Text></Text>
              <Item>
                <Input style={styles.fields} value={email} onChangeText={(text) => this.setState({email:text})}  placeholder="Enter email address"/>
              </Item>
          </View>
          <View style={{marginTop:25,justifyContent:'center',alignItems:'center'}}>
                {checkLocation ? <Button
                  onPress={() => this._getLocationAsync()}
                  title="Click here to pick up the location"
                  disabled={disableBtn}
                  buttonStyle={{
                    backgroundColor: "#005068",
                    width: 300,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 2
                  }}
                /> : <Button
                      onPress={() => this.addDetails()}
                      title="Create Account"
                      disabled={disableBtn}
                      buttonStyle={{
                        backgroundColor: "#2F4F4F",
                        width: 250,
                        height: 45,
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 2
                      }}
                    />
                }
          </View>
          <Text style={{fontSize:15,textAlign:'center',marginTop:20,color:'red'}}>{errorMessage}</Text>
          {
            isLoader && 
            <View style={{marginTop:15,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator size="large" color="#005068" />
            </View> 
          }
        </View> : this.props.navigation.navigate('Login')
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
  }
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
    onPressIsAccountCreate:(flag) => dispatch(isAccountCreate(flag)),
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);