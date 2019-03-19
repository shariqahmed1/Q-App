import React from 'react';
import {FIREBASE_DATABASE} from '../../constants/Functions';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import { updateUser } from '../../Redux/Action/Action';
import {checkAppointmentTimeIsStartOrNot} from '../../constants/Functions';
import { Content, Card, CardItem, Thumbnail, Left, Body } from 'native-base';


const numColumns = 1; 

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

class UserBookedAppointments extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        myData:this.props.myData,
        fetchAppointments:[],
        companyData:null,
        isLoading:true,
        isToken:false,
        refreshing:false,
        tokens:[],
        bookedAppt:[],
    }
  }

     
    componentWillReceiveProps(nextProps){
        this.setState({myData:nextProps.myData})
    }
    
    componentDidMount(){
      this.fetchAllAppointments();
    }

  calculateMilliSeconds(t){
    var time = t;
    var timeParts = time.split(":");
    var sumMilli = (+timeParts[0] * (60000 * 60)) + (+timeParts[1] * 60000);
    var makeMilli = sumMilli - 195;
    return makeMilli;
  }


  fetchAllAppointments(){
    let {fetchAppointments, myData} = this.state;
    FIREBASE_DATABASE.ref('token').orderByChild('registeredToken').on('value',snap=>{
      fetchAppointments = [];
      snap.forEach(snapshot=>{
          snapshot.forEach(doubleSnapshot=>{
              doubleSnapshot.forEach(trippleSnapshot=>{
                  let data = trippleSnapshot.val();
                  if(data.id === myData.id){
                    FIREBASE_DATABASE.ref('users').child(data.companyKey).on('value',newD=>{
                      data.companyDetails = newD.val();
                      data.calculateMilliSeconds = this.calculateMilliSeconds(newD.val().timings.startTime);
                      data.estimatedTime = moment.duration((data.tokenNumber * newD.val().tokenDetails.estimatedTime), 'minutes').humanize(true);
                      fetchAppointments.push(data);
                    })
                  }
              })
          })
      })
      this.sortData(fetchAppointments);
    })
  }

  static navigationOptions = {
    title:"Booked Appointments"
  }

    
  sortData(fetchAppointments){
    let sort = _.sortBy(fetchAppointments, [function(o) { return o.calculateMilliSeconds; }]);
    this.setState({fetchAppointments:sort, isLoading:false, refreshing:false,});
  }

  handleRefresh = () =>{
    this.setState({
      refreshing:true,
    },() =>{
      this.fetchAllAppointments();
    })
  }
    
  renderItem = ({ item, index }) => {
    let checkAppointmentTime = checkAppointmentTimeIsStartOrNot(item.companyDetails.timings.startTime);
    item.apptNum = index + 1;
    item.checkAppointmentTime = checkAppointmentTime;
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
          <Content key={index} style={{marginBottom:15}}>
            <Card style={{flex: 0}}>
                <CardItem button onPress={() => this.props.navigation.navigate('SeeBookedAppointmentDetails', item)}>
                  <Left>
                    <Thumbnail source={{uri: item.companyDetails.profilePhoto}} />
                    <Body>
                      <Text>{item.companyDetails.companyName}</Text>
                      <Text style={{fontSize:12,color:'#808080'}}>{moment(item.time).fromNow()}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem button onPress={() => this.props.navigation.navigate('SeeBookedAppointmentDetails', item)}>
                  {
                    checkAppointmentTime ? 
                    <Body style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <View>
                          <Text style={{fontSize:18, color:'#005068', paddingBottom:10}}>
                            Estimated Time
                          </Text>
                        </View>
                        <View>
                          <Text style={{textAlign:'center',paddingBottom:25}}>
                            Your Appointment will come {item.estimatedTime}
                          </Text>
                        </View>
                    </Body>
                    :
                    <Body style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <View>
                          <Text style={{fontSize:17, color:'#005068', paddingBottom:10}}>
                            Start Time
                          </Text>
                        </View>
                        <View>
                          <Text style={{textAlign:'center',paddingBottom:25}}>
                            Today's Appointments will start at {moment(item.companyDetails.timings.startTime, "hh:mm").format('LT')}
                          </Text>
                        </View>
                    </Body>
                  }
                </CardItem>
            </Card>
          </Content>
    );
  };

  render() {
    const {fetchAppointments,isLoading} = this.state;
    return (
        <View style={styles.container}>
            {isLoading ? 
                <View style={styles.tokenMessage}>
                    <ActivityIndicator size="large" color="#005068" />
                </View> :
                    fetchAppointments.length > 0 ?
                        <View style={{marginLeft:15, height:'100%'}}>
                            <FlatList
                              onRefresh={this.handleRefresh}
                              refreshing={this.state.refreshing}
                              extraData={this.state.fetchAppointments}
                              data={formatData(fetchAppointments, numColumns)}
                              style={styles.listContainer}
                              renderItem={this.renderItem}
                              numColumns={numColumns}
                          />
                        </View>
                        :
                        <View style={styles.tokenMessage}>
                            <Text style={{fontSize:17, fontWeight:'bold'}}>No today's token found</Text>
                        </View>
            }
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
    listContainer: {
      flex: 1,
      backgroundColor:"#fff",
      marginVertical: 20,
      paddingTop:10,
      paddingBottom:10,
      paddingRight:8,
      paddingLeft:8,
    },
    item: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      margin: 1,
      height: Dimensions.get('window').width / numColumns, // approximate a square
    },
    isDataNotExist:{
      backgroundColor: '#4D243D',
    },
    itemInvisible: {
      backgroundColor: 'transparent',
    },
    itemText: {
      color: '#fff',
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
   
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserBookedAppointments);
