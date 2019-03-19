import React from 'react';
import { FIREBASE_DATABASE, newImageUpload } from '../../constants/Functions';
import {
  Modal,
  StyleSheet,
  TimePickerAndroid,
  ActivityIndicator,
  ToastAndroid,
  DatePickerAndroid,
  Alert,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImagePicker } from 'expo';
import { CLIENT_ID, CLIENT_SECRET } from '../../Helper/helper';
import _ from 'lodash';
import moment from 'moment';
import { Icon, Button } from 'react-native-elements'
import { ListItem, Divider } from 'react-native-elements'
import MapView from 'react-native-maps';
import {
  Item,
  Input,
  ListItem as NativeBaseListItem,
  Radio,
  Right,
  Left,
  Icon as NativeBaseIcon
} from 'native-base';
import { connect } from 'react-redux';
import { isAccountCreate, updateUser } from '../../Redux/Action/Action';
import { StackActions, NavigationActions } from 'react-navigation';

var arr = [];

class CompanyLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: this.props.isLogin,
      modalVisible: false,
      modalVisible2: false,
      loader: false,
      startTime: '',
      endTime: '',
      selectedVenue: null,
      timings: '',
      address: '',
      name: '',
      formattedAddress: '',
      coordinate: {},
      listShow: false,
      queryPlaces: [],
      dataEnterloader: false,
      logo: '',
      image1: '',
      image2: '',
      image3: '',
      logoName: '',
      imageOriginalName1: '',
      imageOriginalName2: '',
      imageOriginalName3: '',
      logoUpload: false,
      image1Upload: false,
      image2Upload: false,
      image3Upload: false,
      logoUploading: false,
      image1Uploading: false,
      image2Uploading: false,
      image3Uploading: false,
      since: '',
      tagDesc: '',
      itemSelected: 'Doing what you like will always keep you happy',
      myData: this.props.myData,
    }
    this.setDate = this.setDate.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setDate(newDate) {
    this.setState({ since: newDate });
  }

  static navigationOptions = {
    title: "Details",
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      myData: nextProps.myData,
      isLogin: nextProps.isLogin
    })
  }

  companyAddress(e) {
    this.setState({ address: e })
  }


  setModalVisible2(visible) {
    this.setState({ modalVisible2: visible });
  }

  _pickImage = async (uploadName, uploadingName, pic) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ [pic]: result.uri, [uploadingName]: false, [uploadName]: true })
    }
  };

  searchAddress() {
    let { address } = this.state;
    let queryPlaces = [];
    if (address !== "") {
      this.setState({ loader: true })
      fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=10&near=Karachi,%20PK&query=${address}`)
        .then(res => res.json())
        .then(res => {
          queryPlaces.push(res.response.venues);
        })
        .then(() => {
          this.setState({ queryPlaces, loader: false })
        })
        .catch(err => {
          console.log(err.message);
        })
    }
    else {
      ToastAndroid.show("Please enter area name", ToastAndroid.SHORT);
      this.setState({ loader: false })
    }
  }

  setLocation() {
    this.setState({ modalVisible2: false, queryPlaces: [] })
  }

  openMap(lat, lng, venue) {
    this.setState({
      coordinate: {
        latitude: lat,
        longitude: lng
      },
      selectedVenue: venue,
      modalVisible2: true
    })
  }

  setMarker(e) {
    this.setState({ coordinate: e.nativeEvent.coordinate });
  }

  async timePicker(time) {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.setState({
          [time]: `${hour}:${minute}`,
        })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  }

  async datePicker() {
    let { since } = this.state;
    let check = since !== "" ? since.split('/') : '';
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: check ? new Date(check[2], check[1], check[0]) : new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ since: `${day}/${month + 1}/${year}` })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  cancel() {
    this.setState({
      image1: '',
      image2: '',
      image3: '',
      logo: '',
      imageOriginalName1: '',
      imageOriginalName2: '',
      imageOriginalName3: '',
      logoName,
      name: '',
      coordinate: {},
      queryPlaces: [],
      since: '',
      startTime: '',
      endTime: '',
      formattedAddress: '',
      address: '',
      modalVisible: false,
      modalVisible2: false,
    })
  }

  async addDetails() {
    const {
      image1,
      image2,
      image3,
      logo,
      name,
      since,
      startTime,
      endTime,
      formattedAddress,
      coordinate,
      myData,
      itemSelected,
      tagDesc,

    } = this.state;

    let cond1 = (name !== "" || since !== "" || formattedAddress !== "" || startTime !== "" || endTime !== "" || logo !== "") && (image1 !== "" || image2 !== "" || image3 !== "");

    let cond2 = _.isEmpty(coordinate);
    let arr = [];
    let companyLogo = undefined;
    // let companyLogo = { imageName: logoName, imagePath: logo }
    let makeDesc = itemSelected;

    if (makeDesc === "Other") {
      if (tagDesc.length > 50) {
        makeDesc = tagDesc;
      }
      else {
        ToastAndroid.show("Please write description minimum 50 characters or choose from the provided option", ToastAndroid.SHORT);
        return false;
      }
    }

    // if (image1 !== "") {
    //   arr.push({ imageName: imageOriginalName1, imagePath: image1 })
    // }

    // if (image2 !== "") {
    //   arr.push({ imageName: imageOriginalName2, imagePath: image2 })
    // }

    // if (image3 !== "") {
    //   arr.push({ imageName: imageOriginalName3, imagePath: image3 })
    // }

    if (cond1 && !cond2) {

      this.setState({ dataEnterloader: true })

      ToastAndroid.show('Updating...', ToastAndroid.LONG);

      if (logo !== "") {
        await newImageUpload(logo)
          .then((res) => {
            companyLogo = res;
          })
          .catch((err) => {
            console.log(err.message)
          });
      }

      if (image1 !== "") {
        await newImageUpload(image1)
          .then((res) => {
            arr.push(res);
          })
          .catch((err) => {
            console.log(err.message)
          });
      }

      if (image2 !== "") {
        await newImageUpload(image2)
          .then((res) => {
            arr.push(res);
          })
          .catch((err) => {
            console.log(err.message)
          });
      }

      if (image3 !== "") {
        await newImageUpload(image3)
          .then((res) => {
            arr.push(res);
          })
          .catch((err) => {
            console.log(err.message)
          });
      }

      FIREBASE_DATABASE.ref('users/').child(myData.uid).update({
        certificates: arr,
        accType: 'company',
        companyName: name,
        coordinate: coordinate,
        since: since,
        profilePhoto: companyLogo,
        isAccountCreate: true,
        isAllowToken: true,
        tag: makeDesc,
        timings: {
          startTime: startTime,
          endTime: endTime
        },
        address: formattedAddress
      })
        .then(() => {
          this.cancel()
          this.setState({ dataEnterloader: false })
          this.props.onPressIsAccountCreate(true);
          this.props.updateUser(myData.uid);
          ToastAndroid.show('Welcome', ToastAndroid.LONG);
        })
        .then(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          });
          this.props.navigation.dispatch(resetAction);
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    else {
      Alert.alert(
        'Error',
        'Please fill all fields',
      )
    }
  }

  render() {
    const {
      image1Upload,
      image2Upload,
      image3Upload,
      image1,
      image2,
      image3,
      name,
      startTime,
      endTime,
      address,
      queryPlaces,
      loader,
      coordinate,
      selectedVenue,
      formattedAddress,
      dataEnterloader,
      image1Uploading,
      image2Uploading,
      image3Uploading,
      logo,
      logoUpload,
      logoUploading,
      tagDesc,
      since
    } = this.state;

    let logoImg = logoUpload ? { uri: logo } : logoUploading ? require('../images/Loader.gif') : require('../images/imageUploader.png');

    let img1 = image1Upload ? { uri: image1 } : image1Uploading ? require('../images/Loader.gif') :
      require('../images/imageUploader.png');

    let img2 = image2Upload ? { uri: image2 } : image2Uploading ? require('../images/Loader.gif') : require('../images/imageUploader.png');

    let img3 = image3Upload ? { uri: image3 } : image3Uploading ? require('../images/Loader.gif') : require('../images/imageUploader.png');

    let logoDisable = logoUploading ? true : false;
    let imgDisable1 = image1Uploading ? true : false;
    let imgDisable2 = image2Uploading ? true : false;
    let imgDisable3 = image3Uploading ? true : false;

    return (
      isLogin &&

      <View style={styles.container}>

        <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>

          <Image source={{ uri: myData ? myData.photoURL : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV-loVsz1ujlVhsYLSPi6j3HsfAVBhVtO33Oikm1KJ33M2FKTA' }} style={{ width: 70, height: 70, borderRadius: 100, padding: 0 }} />

        </View>

        <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>Hi {myData ? myData.displayName : 'Friend'}</Text>

        <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 15 }}>Press plus icon and add company details</Text>

        <View style={styles.icon}>
          <TouchableOpacity>
            <Icon
              raised
              name='plus'
              type='material-community'
              color='#005068'
              size={28}
              onPress={() => {
                this.setModalVisible(true);
              }} />
          </TouchableOpacity>
        </View>


        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert(
              'Confirm',
              'Are you sure for leave this page?',
              [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.cancel() },
              ],
              { cancelable: false }
            )
          }}>

          {dataEnterloader ?
            <View style={{ width: '100%', backgroundColor: '#fff', opacity: 0.5, height: '100%', position: 'absolute', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('../images/loading.gif')}
              />
            </View> : <View />
          }

          <View style={styles.modalNavigation}>
            <TouchableOpacity
              style={{
                paddingLeft: 10,
                paddingTop: 3,
              }}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Icon
                name='arrow-left'
                type='material-community'
                color='#000'
                size={28}
              />
            </TouchableOpacity>
            <Text style={{ paddingLeft: 25, fontSize: 17, fontWeight: 'bold', paddingTop: 7 }}>Add Company Details</Text>
          </View>

          <ScrollView>

            <View style={styles.inputs}>
              
              <Text style={styles.label}>Company Name <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>
              <Item>
                <Input style={styles.fields} value={name} onChangeText={(text) => this.setState({ name: text })} placeholder="Enter company name" />
              </Item>

              {/* Logo */}

              <Text style={styles.label}>Company Logo <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>

              <View style={[styles.certificates, { justifyContent: 'flex-start', marginLeft: 10 }]}>

                <View style={{ paddingTop: 10 }}>

                  <TouchableOpacity disabled={logoDisable} style={{ width: 100, height: 100 }} onPress={this._pickImage.bind(this, "logoUpload", "logoUploading", "logo", "logoUpdate")}>

                    <Image source={logoImg} style={{ width: 100, height: 100 }} />

                  </TouchableOpacity>

                  <Text style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 20 }}>{logoDisable ? 'Uploading...' : logo !== "" ? 'Uploaded' : 'Upload'}</Text>

                </View>

              </View>

              <Item></Item>

              {/* Since */}

              <Text style={styles.label}>Since <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>
              <Item>
                <Input style={styles.fields} value={since} onFocus={() => this.datePicker()} placeholder="Enter Startup Date" />
              </Item>

              {/* Certificates */}

              <Text style={styles.label}>Certificates Images <Text style={{ fontSize: 13, color: '#2E8B57' }}>* (at least 1)</Text></Text>

              <View style={[styles.certificates, { justifyContent: 'space-evenly' }]}>

                <View style={{ paddingTop: 10 }}>

                  <TouchableOpacity style={{ width: 100, height: 100 }} onPress={this._pickImage.bind(this, "image1Upload", "image1Uploading", "image1")} disabled={imgDisable1}>

                    <Image source={img1} style={{ width: 100, height: 100 }} />

                  </TouchableOpacity>

                  <Text style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 20 }}>{imgDisable1 ? 'Uploading...' : logo !== "" ? 'Uploaded' : 'Image 1'}</Text>

                </View>

                <View style={{ paddingTop: 10 }}>

                  <TouchableOpacity disabled={imgDisable2} style={{ width: 100, height: 100 }} onPress={this._pickImage.bind(this, "image2Upload", "image2Uploading", "image2")}>

                    <Image source={img2} style={{ width: 100, height: 100 }} />

                  </TouchableOpacity>

                  <Text style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 20 }}>{imgDisable2 ? 'Uploading...' : logo !== "" ? 'Uploaded' : 'Image 2'}</Text>

                </View>

                <View style={{ paddingTop: 10 }}>

                  <TouchableOpacity disabled={imgDisable3} style={{ width: 100, height: 100 }} onPress={this._pickImage.bind(this, "image3Upload", "image3Uploading", "image3")}>

                    <Image source={img3} style={{ width: 100, height: 100 }} />

                  </TouchableOpacity>

                  <Text style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 20 }}>{imgDisable3 ? 'Uploading...' : logo !== "" ? 'Uploaded' : 'Image 3'}</Text>

                </View>
              
              </View>

              <Item></Item>

              {/* Timings */}

              <View>

                <Text style={styles.label}>Formatted Address <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>
                <Item>
                  <Input style={styles.fields} value={formattedAddress} onChangeText={(text) => this.setState({ formattedAddress: text })} placeholder="Enter company formatted address" />
                </Item>
                
                <Text style={styles.label}>Location <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>
                <Item>
                  <Input style={styles.fields} value={address} onChangeText={this.companyAddress.bind(this)} placeholder="Search location by the name of area" />
                  <NativeBaseIcon active style={{ fontSize: 30 }} name='chevron-right' type="MaterialCommunityIcons" onPress={() => this.openMap(coordinate.latitude, coordinate.longitude, "value")} />
                </Item>

                <View style={styles.searchBtn}>
                  <Button
                    onPress={() => { this.searchAddress() }}
                    title="Search Location"
                    buttonStyle={{
                      backgroundColor: "#005068",
                      width: 160,
                      height: 45,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 2
                    }}
                  />
                </View>

                <View style={styles.locationList}>
                  {queryPlaces.length > 0 ?
                    queryPlaces.map((v, i) => {
                      return (
                        v !== undefined ?
                          v.map((value, index) => {
                            return (
                              <View key={index}>
                                <ListItem
                                  leftIcon={
                                    <Icon name='location-on'
                                      type='material'
                                      color='#ccc'
                                      size={28}
                                    />
                                  }
                                  title={value.name}
                                  subtitle={value.location.address ? value.location.address : 'Location not given'}
                                  onPress={() => this.openMap(value.location.lat, value.location.lng, value)}
                                  rightIcon={
                                    <Icon name='my-location'
                                      type='material'
                                      color='#000'
                                      size={28}
                                    />
                                  }
                                  subtitleContainerStyle={{ fontWeight: '100' }}
                                  containerStyle={{ fontSize: 13 }}
                                />
                                <Divider style={{ backgroundColor: '#ddd' }} />
                              </View>
                            )
                          })
                          : Alert.alert(
                            'Error',
                            'Sorry no area found!',
                            [
                              { text: 'Ok', onPress: () => this.setState({ queryPlaces: [] }) },
                            ],
                            { cancelable: false }
                          )
                      )
                    })
                    :
                    loader ? <ActivityIndicator size="large" color="#005068" /> : <View />
                  }
                </View>

                <View>
                  <Text style={styles.label}>Company Timings <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>
                  <Item>
                    <Input style={styles.fields} value={startTime !== "" ? moment(startTime, "hh:mm").format('LT') : ""} onFocus={() => this.timePicker('startTime')} placeholder="Start Time" />
                  </Item>
                  <Item>
                    <Input style={styles.fields} value={endTime !== "" ? moment(endTime, "hh:mm").format('LT') : ""} onFocus={() => this.timePicker('endTime')} placeholder="End Time" />
                  </Item>
                </View>

                <View>
                  <Text style={styles.label}>Company Short Description <Text style={{ fontSize: 13, color: '#2E8B57' }}>*</Text></Text>
                  <NativeBaseListItem>
                    <Left>
                      <Text>Doing what you like will always keep you happy</Text>
                    </Left>
                    <Right>
                      <Radio
                        color={"#325F6C"}
                        selectedColor={"#005068"}
                        onPress={() => this.setState({ itemSelected: 'Doing what you like will always keep you happy' })}
                        selected={this.state.itemSelected == 'Doing what you like will always keep you happy'}
                      />
                    </Right>
                  </NativeBaseListItem>
                  <NativeBaseListItem>
                    <Left>
                      <Text>Other</Text>
                    </Left>
                    <Right>
                      <Radio
                        color={"#325F6C"}
                        selectedColor={"#005068"}
                        onPress={() => this.setState({ itemSelected: 'Other' })}
                        selected={this.state.itemSelected == 'Other'}
                      />
                    </Right>
                  </NativeBaseListItem>

                  {this.state.itemSelected == 'Other' &&
                    <View>

                      <Text style={styles.label}>Description
                            <Text style={{ fontSize: 13, color: '#2E8B57' }}> *
                              <Text style={{ color: this.state.tagDesc.length > 50 ? '#008000' : '#FF0000' }}> {
                            this.state.tagDesc.length === 0 ? '(at least 50 characters)' : this.state.tagDesc.length >= 50 ? `${' '}\u2713 ${' '}` : `(${50 - this.state.tagDesc.length} characters remaining)`
                          }</Text>
                        </Text>
                      </Text>

                      <Item>
                        <Input style={styles.fields} value={tagDesc} onChangeText={(text) => this.setState({ tagDesc: text })} placeholder="Write a description more than 50 characters" />
                      </Item>
                    </View>
                  }
                </View>

                <View style={{ marginTop: 20, marginBottom: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <Button
                    onPress={() => { this.cancel() }}
                    title="Cancel"
                    buttonStyle={{
                      backgroundColor: "rgba(47,79,79,1)",
                      width: 100,
                      height: 45,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 2
                    }}
                  />
                  <Button
                    onPress={() => { this.addDetails() }}
                    title="Create Account"
                    buttonStyle={{
                      backgroundColor: "#325F6C",
                      width: 170,
                      height: 45,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 2
                    }}
                  />
                </View>

              </View>
            </View>
          </ScrollView>
        </Modal>

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible2}
          onRequestClose={() => {
            Alert.alert(
              'Confirm',
              'Are you sure for leave this page?',
              [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.setModalVisible2(false) },
              ],
              { cancelable: false }
            )
          }}>
          <View style={styles.modalNavigation}>
            <TouchableOpacity
              style={{
                paddingLeft: 10,
                paddingTop: 3,
              }}
              onPress={() => {
                this.setModalVisible2(!this.state.modalVisible2);
              }}
            >
              <Icon
                name='arrow-left'
                type='material-community'
                color='#000'
                size={28}
              />
            </TouchableOpacity>
            <Text style={{ paddingLeft: 25, fontSize: 18, fontWeight: 'bold', paddingTop: 7, width: 120 }}>{selectedVenue !== null ? selectedVenue.name : ''}</Text>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 3,
                alignItems: 'center',
              }}
            >
              <Button
                onPress={() => { this.setLocation() }}
                title="Set Location"
                buttonStyle={{
                  backgroundColor: "#2e5864",
                  width: 125,
                  height: 40,
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 2
                }}
              />

            </TouchableOpacity>
          </View>
          <View style={styles.map}>
            {_.isEmpty(coordinate) ? <View /> : <MapView style={styles.mapView}
              initialRegion={{
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <MapView.Marker draggable
                coordinate={coordinate}
                title={'Your Location'}
                description={'Drag marker and set your location'}
                onDragEnd={(e) => this.setMarker(e)}
              />
            </MapView>}
          </View>
        </Modal>

      </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  icon: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 20,
    marginBottom: 20,
  },
  modalNavigation: {
    height: 55,
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
    marginTop: 15,
    padding: 10,
  },
  label: {
    paddingLeft: 6,
    paddingTop: 20,
    marginBottom: 1,
    fontSize: 15
  },
  certificates: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
  },
  fields: {
    fontSize: 15
  },
  locationList: {
    marginTop: 15
  },
  searchBtn: {
    marginTop: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#005068',
    padding: 10,
    width: 150
  },
  text: {
    color: '#fff'
  },
  map: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: 300,
    width: '100%',
    justifyContent: 'center'
  },
  mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  alignAvatar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    padding: 0,
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
    onPressIsAccountCreate: (flag) => dispatch(isAccountCreate(flag)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CompanyLogin);