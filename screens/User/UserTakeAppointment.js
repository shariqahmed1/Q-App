import React from 'react';
import {FIREBASE_DATABASE,FIREBASE_STORAGE} from '../../constants/Functions';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  Modal,
  ToastAndroid,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import {validateEmail} from '../../constants/Functions';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Item, Input } from 'native-base';
import { Camera, Permissions, FaceDetector } from 'expo';
import { updateUser } from '../../Redux/Action/Action';


class UserTakeAppointment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      companyDetials: this.props.navigation.state.params,
      myData: this.props.myData,
      hasCameraPermission: null,
      face: false,
      type: Camera.Constants.Type.front,
      takePicture: false,
      picture: '',
      name: this.props.myData.name,
      email: this.props.myData.email,
      pictureName: '',
      picturePath: '',
      loader: false,
      modalVisible: false,
      isTakeRender: false,
      showMessage: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ myData: nextProps.myData, companyDetials: nextProps.navigation.state.params });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      [navigation.state.params.isPictureTaken ? 'headerTitle' : 'header']: navigation.state.params.isPictureTaken ? <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Appointment No. {navigation.state.params.myTitle}</Text> : null,
    }
  }

  componentDidUpdate() {
    const { isTakeRender, takePicture } = this.state;
    if (isTakeRender) {
      this.props.navigation.setParams({ myTitle: this.props.navigation.state.params.item.key, isPictureTaken: takePicture })
      this.setState({ isTakeRender: false })
    }
  }

  async componentDidMount() {
    this.props.navigation.setParams({ myTitle: this.props.navigation.state.params.item.key, isPictureTaken: this.state.takePicture })
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  async snapPhoto() {
    if (this.camera) {
      const options = {
        quality: 1, base64: true, fixOrientation: true,
        exif: true
      };
      await this.camera.takePictureAsync(options).then(photo => {
        photo.exif.Orientation = 1;
        this.setState({ takePicture: true, picture: photo.uri, showMessage: false });
      });
    }
  }

  handleFacesDetected = async ({ faces }) => {
    if (faces.length === 1) {
      this.setState({ face: true, isTakeRender: true });
    }
    else {
      this.setState({ takePicture: false, showMessage: true });
    }
  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  uploadImage = async (uri) => {
    let randomnmbr = Math.floor(Math.random() * 900000000000000) + 100000000000000;
    const imgName = `${randomnmbr}.jpg`;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const ref = FIREBASE_STORAGE.ref('appointments').child(imgName);
    const snapshot = await ref.put(blob);
    const remoteUri = await snapshot.ref.getDownloadURL();
    blob.close();
    this.setState({ pictureName: imgName })
    return remoteUri;
  }

  async takeAppointment() {
    const { picture, companyDetials, myData, name, email } = this.state;
    if (picture === "") {
      Alert.alert(
        'Error !',
        'Something went wrong re-take picture',
        [
          { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Yes', onPress: () => this.setState({ face: false, isTakeRender: true, takePicture: false }) },
        ],
        { cancelable: false }
      )
    }
    else {
      ToastAndroid.show("Please wait until it is done", ToastAndroid.SHORT);
      var time = moment().format('llll');
      this.setState({ loader: true })
      await this.uploadImage(picture)
        .then((url) => {
          FIREBASE_DATABASE.ref('token/').child(companyDetials.item.companyKey + '/registeredToken/' + companyDetials.item.key).set({
            name: name,
            picture: {
              imageName: this.state.pictureName,
              imagePath: url,
            },
            email: email,
            id: myData.id,
            time: time,
            tokenNumber: companyDetials.item.key,
            companyKey: companyDetials.item.companyKey,
          })
          this.props.navigation.navigate('Main');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }


  editDetails() {
    const { name, email, myData } = this.state;
    if (name === "") {
      ToastAndroid.show('Please Enter Name', ToastAndroid.SHORT);
    }
    else if (email === "") {
      ToastAndroid.show('Please Enter email', ToastAndroid.SHORT);
    }
    else if (!validateEmail(email)) {
      ToastAndroid.show('Enter valid email', ToastAndroid.SHORT);
    }
    else {
      FIREBASE_DATABASE.ref('users/').child(myData.id).update({
        name: name,
        email: email,
      })
        .then(() => {
          this.props.updateUser(myData.id);
        })
        .then(() => {
          this.setModalVisible(false);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  render() {
    const { hasCameraPermission, takePicture, showMessage, face, picture, loader, name, email } = this.state;
    let makeDisable = loader ? true : false;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {!face ? <Camera style={{ flex: 1 }}
            onFacesDetected={takePicture && this.handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Mode.none,
              runClassifications: FaceDetector.Constants.Mode.none,
            }}
            flashMode={Camera.Constants.FlashMode.auto}
            autoFocus={Camera.Constants.AutoFocus.on}
            ref={(ref) => this.camera = ref}
            type={this.state.type}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
              <View style={{
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: 150, backgroundColor: '#fff'
              }}>
                {showMessage && <Text style={{ position: 'absolute', textAlign: 'center', bottom: 10, color: 'red', width: '100%' }}>No Face Found</Text>}

                <TouchableOpacity
                  onPress={() => {
                    this.snapPhoto()
                  }}>
                  <Image style={{ width: 80, height: 80, borderRadius: 100 }} source={require('../images/captureIcon.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </Camera> :
            <ScrollView style={styles.container}>
              <View style={styles.imageWrapper}>
                <TouchableOpacity onPress={() => picture !== "" ? this.props.navigation.navigate('ViewImage', { name: "Your Picture", img: picture }) : console.log("NO")}>
                  <Image source={{ uri: picture }} style={{ height: 150, width: 150, marginTop: 25, marginBottom: 20 }} />
                </TouchableOpacity>
                <Button
                  onPress={() => this.setState({ face: false, isTakeRender: true, takePicture: false })}
                  title="Re-Take"
                  buttonStyle={{
                    backgroundColor: "#005068",
                    width: 100,
                    height: 42,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 2
                  }}
                />
              </View>
              <View style={styles.textBoxWrapper}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.label}>Your Name</Text>
                  </View>
                  <View style={{ paddingTop: 20, paddingRight: 10 }}>
                    <Icon
                      name='square-edit-outline'
                      type='material-community'
                      color='#A9A9A9'
                      size={20}
                      onPress={() => this.setModalVisible(true)}
                    />
                  </View>
                </View>

                <Item>
                  <Input style={styles.fields} value={name} disabled placeholder="Enter Name" />
                </Item>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.label}>Your Email Address</Text>
                  </View>
                  <View style={{ paddingTop: 20, paddingRight: 10 }}>
                    <Icon
                      name='square-edit-outline'
                      type='material-community'
                      color='#A9A9A9'
                      size={20}
                      onPress={() => this.setModalVisible(true)}
                    />
                  </View>
                </View>
                <Item>
                  <Input style={styles.fields} value={email} disabled placeholder="Enter Email address" />
                </Item>

              </View>

              <View style={[styles.textBoxWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                <Button
                  onPress={() => this.takeAppointment()}
                  title="Take Appointment"
                  disabled={makeDisable}
                  buttonStyle={{
                    backgroundColor: "#4D243D",
                    width: 200,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 2
                  }}
                />

                {
                  loader &&
                  <View style={{ marginTop: 20 }}>
                    <ActivityIndicator size="large" color="#005068" />
                  </View>
                }

              </View>
            </ScrollView>
          }

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(false);
            }}
          >
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
              <Text style={{ paddingLeft: 25, fontSize: 17, fontWeight: 'bold', paddingTop: 7 }}>Edit Details</Text>
            </View>

            <View style={[styles.textBoxWrapper, { marginTop: 30 }]}>
              <Text style={styles.label}>Your Name</Text>
              <Item>
                <Input style={styles.fields} value={name} onChangeText={(text) => this.setState({ name: text })} placeholder="Enter Name" />
              </Item>
              <Text style={styles.label}>Your Email Address</Text>
              <Item>
                <Input style={styles.fields} value={email} onChangeText={(text) => this.setState({ email: text })} placeholder="Enter Email address" />
              </Item>

              <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Button
                  onPress={() => {
                    this.editDetails();
                  }}
                  title="Update Details"
                  buttonStyle={{
                    backgroundColor: "#2F4F4F",
                    width: 150,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 2
                  }}
                />
              </View>

            </View>

          </Modal>

        </View>
      );
    }
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
  textBoxWrapper: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
    padding: 20
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
    marginTop: 5,
    padding: 10,
  },
  label: {
    paddingLeft: 6,
    paddingTop: 20,
    fontSize: 15,
    color: '#2E8B57',
  },
  fields: {
    fontSize: 15
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


export default connect(mapStateToProps, mapDispatchToProps)(UserTakeAppointment);