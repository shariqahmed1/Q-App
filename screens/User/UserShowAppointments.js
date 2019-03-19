import React from 'react';
import {FIREBASE_DATABASE} from '../../constants/Functions';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { updateUser } from '../../Redux/Action/Action';

const numColumns = 5;

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

class UserShowAppointments extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        data:this.props.navigation.state.params,
        companyData:null,
        isLoading:true,
        isToken:false,
        tokens:[],
        bookedAppt:[],
    }
  }

     
    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.navigation.state.params})
    }

    componentDidMount(){
      const {data} = this.state;
      this.props.navigation.setParams({myTitle: data.companyName})
      this.getTokenDetails();
    }

    
  getTokenDetails(){
    const {data} = this.state;
    let isExist = _.isObject(data.tokenDetails);
    if(isExist){
        FIREBASE_DATABASE.ref('token').child(data.id).on('value',snap=>{
            let isRegisteredToken = _.isObject(snap.val().registeredToken);
            this.fetchDetails(isRegisteredToken,snap.val());
        })
    }
    else{
        this.setState({isLoading:false})
    }
  }
   

    static navigationOptions = ({navigation}) => { 
        return { 
            headerTitle: <Text style={{fontSize: 18, fontWeight: 'bold'}}>{navigation.state.params.myTitle}'s{` `}Appointments</Text>,
        } 
    }

    
  fetchDetails(flag,val){
    let {tokens,bookedAppt,data} = this.state;
    tokens = [];
    bookedAppt = [];
    if(flag){
        for(let i=1; i <= val.totalTokens; i++){
            let isTokenNumber = _.has(val.registeredToken, i);
            if(!isTokenNumber){
                tokens.push({key: i, companyName:data.companyName, companyKey:data.id})
            }
            else{
                bookedAppt.push({key: i, estimateTime:parseInt(val.estimatedTime)})
            }
        }
        this.setState({tokens,bookedAppt,isLoading:false,isToken:true})
    }
    else{
        for(let i=1; i <= val.totalTokens; i++){
            tokens.push({key: i, companyName:data.companyName, companyKey:data.id})
        }
        this.setState({tokens,bookedAppt,isLoading:false,isToken:true})
    }
  }
    
  renderItem = ({ item, index }) => {
    const {bookedAppt} = this.state;
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('UserTakeAppointment',{bookedAppt,item})}
            style={[styles.item, styles.isDataNotExist]}
        >
            <View>
                <Text style={styles.itemText}>{item.key}</Text>
            </View>
        </TouchableOpacity>
    );
  };


  render() {
    const {data,tokens,isLoading,isToken} = this.state;
    return (
        <View style={styles.container}>
            {isLoading ? 
                <View style={styles.tokenMessage}>
                    <ActivityIndicator size="large" color="#005068" />
                </View> :
                    isToken ?
                        <FlatList
                            refreshing={true}
                            extraData={this.state.tokens}
                            data={formatData(tokens, numColumns)}
                            style={styles.listContainer}
                            renderItem={this.renderItem}
                            numColumns={numColumns}
                        />
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
        isLogin: state.AuthReducer.isLogin,
    }
   }
  
   const mapDispatchToProps = (dispatch) => {
    return {
      updateUser: (data) => dispatch(updateUser(data)),
    }
  }
   
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserShowAppointments);
