import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import {Button,Divider} from 'react-native-elements';

class UserCompanyDetails extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      companyDetials:this.props.navigation.state.params,
      myData:this.props.myData,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({companyDetials:nextProps.navigation.state.params,myData:nextProps.myData})
  }

  


  static navigationOptions = ({navigation}) => { 
    return { 
        headerTitle: navigation.state.params.companyName, 
    } 
  }




  componentDidMount(){
    // console.log(this.state.myData);
  }


  render() {
    const {companyDetials,myData} = this.state;
    var makeProfileImg = companyDetials.profilePhoto ? {uri : companyDetials.profilePhoto} : require('../images/Loader.gif'); 
    return (
        <ScrollView style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={{marginTop:30,alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={()=> companyDetials.profilePhoto ? this.props.navigation.navigate('ViewImage',{name:companyDetials.companyName,img:companyDetials.profilePhoto}) : console.log("NO") }>
              <Image source={makeProfileImg} style={{width:150,height:150,borderRadius:100,padding:0}}/>
            </TouchableOpacity>
            </View>
              <Text style={{marginTop:10,textAlign:'center',fontSize:16,fontWeight:'bold'}}>{companyDetials.companyName}</Text>
              <Text style={{marginTop:8,textAlign:'center',fontSize:15}}>Doing what you like will always keep you happy</Text>
              
              <View style={styles.btnContainer}>
                  <Button
                    onPress={() => this.props.navigation.navigate('MapView',{companyCoordinate:companyDetials.coordinate,myCoordinate:myData.coordinate,name:companyDetials.companyName})}
                    title="See Location"
                    buttonStyle={{
                      backgroundColor: "#2F4F4F",
                      width: 200,
                      height: 45,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 2
                    }}
                  />
              </View>

              <Divider style={{ backgroundColor: '#DCDCDC', marginTop:15, marginLeft:10, marginRight:10 }} />
              
              <View style={styles.viewContainer}>
                <Text style={{fontWeight:'bold', color:'#005068', fontSize:16}}>Timings</Text>
                <Text style={{marginTop:5}}>{moment(companyDetials.timings.startTime, "hh:mm",).format('LT')} to {moment(companyDetials.timings.endTime, "hh:mm",).format('LT')}</Text>
              </View>

              <Divider style={{ backgroundColor: '#DCDCDC', marginTop:10, marginLeft:10, marginRight:10 }} />

              <View style={styles.viewContainer}>
                <Text style={{fontWeight:'bold', color:'#005068', fontSize:16}}>Certificates</Text>
              </View>
              
              <View style={styles.certificates}>
                  {companyDetials.certificates.map((val,index)=>{
                    var img = val.imagePath ? {uri:val.imagePath} :  require('../images/Loader.gif');
                    return(
                      <View key={index} style={{paddingTop:10}}>
                        <TouchableOpacity onPress={()=> val.imagePath ? this.props.navigation.navigate('ViewImage',{name:"Certificate",img:val.imagePath}) : console.log("NO") }>
                          <Image source={img} style={{ width: 100, borderRadius:100, height: 100 }} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </View>

              <Divider style={{ backgroundColor: '#DCDCDC', marginTop:15, marginLeft:10, marginRight:10 }} />
              
              <View style={styles.viewContainer}>
                <Text style={{fontWeight:'bold', color:'#005068', fontSize:16}}>Address</Text>
                <Text style={{marginTop:5}}>{companyDetials.address}</Text>
              </View>

              <Divider style={{ backgroundColor: '#DCDCDC', marginTop:15, marginLeft:10, marginRight:10 }} />
              
              {
                companyDetials.isAllowToken ? 
                <View style={styles.btnContainer}>
                  <Button
                    onPress={()=> this.props.navigation.navigate('UserShowAppointments',companyDetials) }
                    title="Take an Appointment"
                    buttonStyle={{
                      backgroundColor: "#005068",
                      width: 220,
                      height: 45,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 2
                    }}
                  />
                </View> : <Text style={{textAlign:'center',marginTop:20,color:'red',fontSize:16}}>No Appointments Available</Text>
              }
          </View>
        </ScrollView>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
  },
  innerContainer: {
    marginBottom:20,
  },
  viewContainer:{
    marginLeft:20,
    marginTop:20,
    marginBottom:10,
  },
  certificates:{
    flex:1,
    marginBottom:20,
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  btnContainer:{
    marginTop:20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
  }
}
 

export default connect(mapStateToProps, mapDispatchToProps)(UserCompanyDetails);