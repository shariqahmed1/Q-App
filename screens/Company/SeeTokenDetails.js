import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';


class SeeTokenDetails extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userData:this.props.myData,
      data:this.props.navigation.state.params,
    }
  }

  componentWillReceiveProps(nextProps,nextState){
    this.setState({userData:nextProps.myData})
  }

    componentDidMount(){
      this.props.navigation.setParams({myTitle: this.props.navigation.state.params.data.key})
    }

    static navigationOptions = ({navigation}) => ({
        title: `Token No. ${navigation.state.params.myTitle}`,
    });

  render() {
    const {userData,data} = this.state;
    return (
        <View style={styles.container}>
            <View style={{marginTop:50,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewImage',data)}>
                    <Image source={{uri:'https://amp.businessinsider.com/images/592f4169b74af41b008b5977-750-563.jpg'}} style={{width:200,height:200,borderRadius:100,padding:0}}/>
                </TouchableOpacity>
            </View>
            <Text style={{marginTop:20,textAlign:'center',fontSize:17,fontWeight:'bold'}}>Shariq Ahmed</Text>
            <Text style={{marginTop:10,textAlign:'center',fontSize:15}}>shariq.ahmed525@gmail.com</Text>
        </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
  },
  tokenMessage:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
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
 

export default connect(mapStateToProps, mapDispatchToProps)(SeeTokenDetails);