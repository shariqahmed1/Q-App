import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux';

class HomeScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      isLogin:this.props.isLogin,
    }
  }

  static navigationOptions = {
    header: null,
  };

  
  componentWillReceiveProps(nextProps){
    this.setState({isLogin:nextProps.isLogin})
  }

  render() {
    const {isLogin} = this.state;
    return (
      isLogin ?
      <ImageBackground source={require('./images/homeback.jpg')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
                <TouchableOpacity style={styles.pad}>
                    <Button
                      onPress={() => this.props.navigation.navigate('Company')} 
                      raised
                      backgroundColor="#3b579d"
                      title='Are you a company?' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.pad}>
                    <Button
                      onPress={() => this.props.navigation.navigate('User')} 
                      raised
                      backgroundColor="#3b579d"
                      title='Are you finding/waiting for tokens?' />
                </TouchableOpacity>
        </View>
    </ImageBackground>
     : this.props.navigation.navigate('Login')
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
  },
  pad:{
    marginTop:10,
    marginBottom:10,
  },
});


const mapStateToProps = (state) => {
  return {
      isLogin: state.AuthReducer.isLogin,
  }
 }

 const mapDispatchToProps = (dispatch) => {
  return {
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);