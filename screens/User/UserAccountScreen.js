import React from 'react';
import {FIREBASE_DATABASE} from '../../constants/Functions';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  DrawerLayoutAndroid,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { capitalize, sliceString, searchQuery } from '../../constants/Functions';
import moment from 'moment';
import { Item, Input, Icon as NativebaseIcon } from 'native-base';
import { isLogin } from '../../Redux/Action/Action';
import { Icon, ListItem } from 'react-native-elements';
import { List, ListItem as NativebaseListItem, Left, Body, Right, Thumbnail, Text as NativebaseText } from 'native-base';

class UserAccountScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.myData,
      search: '',
      companiesData: [],
      searchingData: [],
      isSearchData: false,
      searchLoading:false,
    }
    this._openDrawer = this._openDrawer.bind(this);
    this._closeDrawer = this._closeDrawer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ userData: nextProps.myData })
  }

  _openDrawer() {
    this.drawer.openDrawer()
  }

  _closeDrawer() {
    this.drawer.closeDrawer()
    ToastAndroid.show("Now it's still working, it will be available soon", ToastAndroid.SHORT);
  }



  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    FIREBASE_DATABASE.ref('users').orderByChild('accType').equalTo('company').on('value', snap => {
      let arr = [];
      snap.forEach(snapshot => {
        if (snapshot.val().isAccountCreate) {
          arr.push(snapshot.val());
        }
      })
      this.setState({ companiesData: arr })
    })
  }

  search(val) {
    let { searchingData } = this.state;
    var s = val !== "" && capitalize(val);
    if (s !== "") {
      this.setState({ isSearchData: true, searchLoading:true })
      FIREBASE_DATABASE.ref('users').orderByChild('companyName').startAt(s).endAt(s + '\uf8ff').on('value', snap => {
        searchingData = [];
        snap.forEach(snapshot => {
          if (snapshot.val().isAccountCreate && snapshot.val().accType === "company") {
            searchingData.push(snapshot.val());
          }
        })
        this.setState({ searchingData,searchLoading:false })
      })
    }
    else {
      ToastAndroid.show('Require Text for searching', ToastAndroid.SHORT)
    }
  }

  renderList(companiesData) {
    return (
      <View style={companiesData.length > 0 ? { marginTop: 20, marginLeft: 5, marginRight: 5 } : { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <List>
          {companiesData.length > 0 ?
            <ScrollView>
              {companiesData.map((val, index) => {
                return (
                  <NativebaseListItem onPress={() => this.props.navigation.navigate('UserCompanyDetails', val)} key={index} avatar>
                    <Left>
                      <Thumbnail source={{ uri: val.profilePhoto.imagePath }} />
                    </Left>
                    <Body>
                      <NativebaseText>{val.companyName}</NativebaseText>
                      <NativebaseText note>{val.tag}</NativebaseText>
                    </Body>
                    <Right>
                      <NativebaseText note>{moment(val.timings.startTime, "hh:mm").format('LT')}</NativebaseText>
                    </Right>
                  </NativebaseListItem>
                )
              })}
            </ScrollView>
            : <ActivityIndicator size="large" color="#005068" />
          }
        </List>
      </View>
    );
  }
  
  renderSearchList(searchingData,searchLoading) {
    return (
      <View style={searchingData.length > 0 ? { marginTop: 20, marginLeft: 5, marginRight: 5 } : { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <List>
          {!searchLoading ? 
            searchingData.length > 0 ?
            <ScrollView>
              {searchingData.map((val, index) => {
                return (
                  <NativebaseListItem onPress={() => this.props.navigation.navigate('UserCompanyDetails', val)} key={index} avatar>
                    <Left>
                      <Thumbnail source={{ uri: val.profilePhoto.imagePath }} />
                    </Left>
                    <Body>
                      <NativebaseText>{val.companyName}</NativebaseText>
                      <NativebaseText note>{val.tag}</NativebaseText>
                    </Body>
                    <Right>
                      <NativebaseText note>{moment(val.timings.startTime, "hh:mm").format('LT')}</NativebaseText>
                    </Right>
                  </NativebaseListItem>
                )
              })}
            </ScrollView>
            :
            <Text style={{fontSize:17, fontWeight:'bold'}}>No Search found</Text>
            :
            <ActivityIndicator size="large" color="#005068" />
          }
        </List>
      </View>
    );
  }

  _logout() {
    this.props.onPressClickIsLogin(false);
    this.props.navigation.navigate('Login')
  }

  render() {
    const { userData, search, companiesData, searchingData,searchLoading, isSearchData } = this.state;
    var navigationView = (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Image source={require('../images/og.jpg')} style={{ position: 'absolute', height: 200 }} />
        <View style={{ marginTop: 70, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={{ uri: userData.photo }} style={{ width: 50, height: 50, borderRadius: 100 }} />
          <Text style={{ fontSize: 17, paddingTop: 15, fontWeight: '200', color: '#fff' }}>{userData.name}</Text>
        </View>
        <View style={{ marginTop: 60 }}>
          <TouchableOpacity>
            <ListItem
              leftIcon={
                <Icon name='bookmark'
                  type='material-community'
                  color='#000'
                  size={23}
                />
              }
              title={`Booked Appointments`}
              onPress={() => this.props.navigation.navigate('UserBookedAppointments')}
              titleStyle={{ fontSize: 15, paddingLeft: 25, fontWeight: 'bold' }}
              containerStyle={{ borderBottomColor: 'transparent', marginLeft: 10 }}
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
                <Icon name='history'
                  type='material-community'
                  color='#000'
                  size={23}
                />
              }
              title={`Last Appointments`}
              onPress={this._closeDrawer}
              titleStyle={{ fontSize: 15, paddingLeft: 25, fontWeight: 'bold' }}
              containerStyle={{ borderBottomColor: 'transparent', marginLeft: 10 }}
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
                <Icon name='account-edit'
                  type='material-community'
                  color='#000'
                  size={23}
                />
              }
              title={`Edit Account Info`}
              onPress={() => this.props.navigation.navigate('SettingsForUsers')}
              titleStyle={{ fontSize: 15, paddingLeft: 25, fontWeight: 'bold' }}
              containerStyle={{ borderBottomColor: 'transparent', marginLeft: 10 }}
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
              titleStyle={{ fontSize: 15, paddingLeft: 25, fontWeight: 'bold' }}
              containerStyle={{ borderBottomColor: 'transparent', marginLeft: 10 }}
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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.modalNavigation}>
            {isSearchData ?
              <View style={{ marginTop: 25, flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    paddingLeft: 15,
                    paddingTop: 2,
                  }}
                  onPress={() => this.setState({ isSearchData: false, search: "" })}
                >
                  <Icon
                    name='arrow-left'
                    type='material-community'
                    color='#000'
                    size={28}
                  />
                </TouchableOpacity>
                <Text style={{ paddingLeft: 20, paddingTop: 5, fontSize: 17, fontWeight: 'bold', textAlign: 'left' }}>Search Results for "{search}"</Text>
              </View>
              :
              <View style={{ marginTop: 25, flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    paddingLeft: 15,
                    paddingTop: 2,
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
                <Text style={{ paddingLeft: 20, paddingTop: 5, fontSize: 17, fontWeight: 'bold', textAlign: 'left' }}>Home</Text>
              </View>
            }
          </View>
          <View style={{ marginTop: 20, marginLeft: 10, marginRight: 10, paddingLeft: 10, paddingRight: 10 }}>
            <Item>
              <NativebaseIcon active name='search' />

              <Input style={styles.fields} value={search} onSubmitEditing={() => this.search(search)} onChangeText={(text) => this.setState({ search: text })} placeholder="Search here...." />

              {search !== "" && <NativebaseIcon onPress={() => this.setState({ search: '' })} active name='close' />}

            </Item>
          </View>
            {
              isSearchData ? this.renderSearchList(searchingData,searchLoading) : this.renderList(companiesData)
            }
        </View>
      </DrawerLayoutAndroid>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalNavigation: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputs: {
    marginTop: 10,
    padding: 10,
  },
  label: {
    paddingLeft: 6,
    paddingTop: 20,
    marginBottom: 1,
    fontSize: 15
  },
  fields: {
    fontSize: 15
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
    onPressClickIsLogin: (flag) => dispatch(isLogin(flag)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserAccountScreen);