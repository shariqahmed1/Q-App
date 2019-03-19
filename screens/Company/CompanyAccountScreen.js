import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  DrawerLayoutAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import {  isLogin } from '../../Redux/Action/Action';
import { Icon,ListItem } from 'react-native-elements';



class CompanyAccountScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userData:this.props.myData,
    }
    this._openDrawer = this._openDrawer.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({userData:nextProps.myData})
  }

  _openDrawer() {
    this.drawer.openDrawer()
  }

  static navigationOptions = {
    header:null
  }


  _logout(){
    this.props.onPressClickIsLogin(false);
    this.props.navigation.navigate('Login')
  }


  render() {
    const {userData} = this.state;
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image source={require('../images/og.jpg')} style={{position:'absolute',height:250}}/>
          
          <View style={{marginTop: 50, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <Image source={{uri:userData.profilePhoto.imagePath}} style={{width:120,height:120,borderRadius:100}}/>
            <Text style={{ fontSize: 17, paddingTop:15, fontWeight:'200', color:'#fff' }}>{userData.companyName}</Text>
          </View>

          <View style={{marginTop:60}}>
            <TouchableOpacity>
              <ListItem
                leftIcon={
                  <Icon name='format-list-bulleted'
                    type='material-community'
                    color='#000'
                    size={23}
                  />
                }
                title={`Token Details`}
                onPress={() => this.props.navigation.navigate('TokenDetails')}
                titleStyle={{fontSize:15,paddingLeft:25,fontWeight:'bold'}}
                containerStyle={{borderBottomColor:'transparent', marginLeft:10}}
                rightIcon={
                  <Icon name='plus'
                    type='material-community'
                    color='transparent'
                    size={28}
                  />
                }
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <ListItem
                leftIcon={
                  <Icon name='eye'
                    type='material-community'
                    color='#000'
                    size={23}
                  />
                }
                title={`See Tokens`}
                onPress={() => this.props.navigation.navigate('SeeTokens')}
                titleStyle={{fontSize:15,paddingLeft:25,fontWeight:'bold'}}
                containerStyle={{borderBottomColor:'transparent', marginLeft:10}}
                rightIcon={
                  <Icon name='logout'
                    type='material'
                    color='transparent'
                    size={28}
                  />
                }
              />
            </TouchableOpacity>
            <TouchableOpacity>            
              <ListItem
                leftIcon={
                  <Icon name='settings'
                    type='simple-line'
                    color='#000'
                    size={23}
                  />
                }
                title={`Settings`}
                onPress={() => this.props.navigation.navigate('SettingsForCompany')}
                titleStyle={{fontSize:15,paddingLeft:25,fontWeight:'bold'}}
                containerStyle={{borderBottomColor:'transparent', marginLeft:10}}
                rightIcon={
                  <Icon name='location-on'
                    type='material'
                    color='transparent'
                    size={28}
                  />
                }
              />
            </TouchableOpacity>
            <TouchableOpacity>            
              <ListItem
                leftIcon={
                  <Icon name='logout'
                    type='material-community'
                    color='#000'
                    size={23}
                  />
                }
                title={`Logout`}
                onPress={() => this._logout()}
                titleStyle={{fontSize:15,paddingLeft:25,fontWeight:'bold'}}
                containerStyle={{borderBottomColor:'transparent', marginLeft:10}}
                rightIcon={
                  <Icon name='logout'
                    type='material'
                    color='transparent'
                    size={28}
                  />
                }
              />
            </TouchableOpacity>
          </View>
      </View>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={(_drawer) => this.drawer = _drawer}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={{flex: 1,backgroundColor:'#fff'}}>
          <View style={styles.modalNavigation}>
            <View style={{marginTop:25,flex:1,flexDirection:'row'}}>
              <TouchableOpacity
                  style={{
                    paddingLeft:15,
                  }}
                  onPress={this._openDrawer}
                >
                  <Icon
                    name='menu'
                    type='material-community'
                    color='#000'
                    size={28}
                  />
              </TouchableOpacity>
              <Text style={{paddingLeft: 20, paddingTop:3, fontSize: 17, fontWeight:'bold', textAlign: 'left'}}>Home</Text>                  
            </View>
          </View>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Screen</Text>
        </View>
      </DrawerLayoutAndroid>
    );
    
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
  },
  modalNavigation:{
    height:78,
    flexDirection:'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
    padding:10,
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
    onPressClickIsLogin:(flag) => dispatch(isLogin(flag)),
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAccountScreen);