import React from 'react';
import {
  FIREBASE_DATABASE,
  FIREBASE_AUTH,
  FIREBASE
} from '../constants/Functions';
import {
  ImageBackground,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  loginUser,
  isLogin,
  isAccountCreate
} from '../Redux/Action/Action';
import Icon from 'react-native-vector-icons/FontAwesome';
import Text from 'react-native-vector-icons/FontAwesome';
import {
  StackActions,
  NavigationActions
} from 'react-navigation';

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: this.props.isLogin,
      isAccountCreate: this.props.isAccountCreate,
      isLoginBtnClick: false,
    }
  }

  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    const {
      isLogin,
      isAccountCreate
    } = this.state;

    if (isLogin) {

      if (isAccountCreate) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        this.props.navigation.dispatch(resetAction);
      }

      else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
      }

    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isLogin: nextProps.isLogin,
      isAccountCreate: nextProps.isAccountCreate
    })
  }

  async logIn() {

    this.setState({
      isLoginBtnClick: true
    })

    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1941344369285792', {
      permissions: ['public_profile'],
    });

    if (type === 'success') {
      var credential = FIREBASE.auth.FacebookAuthProvider.credential(token);
      FIREBASE_AUTH.signInAndRetrieveDataWithCredential(credential)
        .then((res) => {
          var data = res.user.providerData[0];
          var id = res.user.providerData[0].uid;
          var arr = null;

          FIREBASE_DATABASE.ref('users').child(`${id}`).once('value', snap => {
            let result = snap.exists();
            arr = snap.val();
            console.log(arr);
            if (result) {

              if (arr.isAccountCreate) {
                this.props.onPressLoginUser(arr);
                this.props.onPressIsLogin(true);
                this.props.onPressIsAccountCreate(true);
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Main' })],
                });
                this.props.navigation.dispatch(resetAction);
              }
              else {
                this.props.onPressLoginUser(arr);
                this.props.onPressIsLogin(true);
                this.props.onPressIsAccountCreate(false);
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                this.props.navigation.dispatch(resetAction);
              }

            }
            else {
              FIREBASE_DATABASE.ref('users').child(`${id}`).set({
                name: data.displayName,
                id: id,
                photo: data.photoURL
              })
                .then(() => {
                  this.props.onPressLoginUser(data);
                  this.props.onPressIsLogin(true);
                  this.props.onPressIsAccountCreate(false);
                })
                .then(() => {
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                  });
                  this.props.navigation.dispatch(resetAction);
                })
                .catch(err => {
                  Alert.alert(
                    'Error!',
                    `Some thing went wrong`,
                  );
                })
            }
          })
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }

  render() {
    const {
      isLogin,
      isLoginBtnClick
    } = this.state;

    let dis = isLoginBtnClick ? true : false;

    return (
      !isLogin ?
        <ImageBackground source={require('./images/og.jpg')} style={{ width: '100%', height: '100%' }}>
          <View style={styles.container}>
            <Icon.Button disabled={dis} name="facebook" style={{ padding: 15 }} borderRadius={0} size={23} backgroundColor="#3b5998" onPress={() => this.logIn()}>
              <Text style={{ fontSize: 17, color: '#fff' }}>LOGIN WITH FACEBOOK</Text>
            </Icon.Button>
          </View>
        </ImageBackground> : <View />
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 100
  },
  developmentModeText: {
    marginTop: 150,
    fontSize: 14,
    textAlign: 'center',
  },
});


const mapStateToProps = (state) => {
  return {
    myData: state.AuthReducer.user,
    isLogin: state.AuthReducer.isLogin,
    isAccountCreate: state.AuthReducer.isAccountCreate,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPressLoginUser: (user) => dispatch(loginUser(user)),
    onPressIsLogin: (flag) => dispatch(isLogin(flag)),
    onPressIsAccountCreate: (flag) => dispatch(isAccountCreate(flag)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);