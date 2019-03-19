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

class SeeTokens extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      userData:this.props.myData,
      isLoading:true,
      isToken:false,
      isTokenEnable:false,
      tokens:[],
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({userData:nextProps.myData})
  }

  async componentDidMount(){
    const {userData} = this.state;
    if(userData.isAllowToken){
      this.props.updateUser(userData.id);
      this.getTokenDetails();
    }
    else{
      this.setState({
        isLoading:false,
        isTokenEnable:true,
      })
    }
  }

  getTokenDetails(){
    const {userData} = this.state;
    let isExist = _.isObject(userData.tokenDetails);
    if(isExist){
      FIREBASE_DATABASE.ref('token').child(userData.id).on('value',snap=>{
            let isRegisteredToken = _.isObject(snap.val().registeredToken);
            this.fetchDetails(isRegisteredToken,snap.val());
        })
    }
    else{
        this.setState({isLoading:false})
    }
  }
  
  fetchDetails(flag,val){
    let {tokens} = this.state;
    tokens = [];
    if(flag){
        for(let i=1; i <= val.totalTokens; i++){
            let isTokenNumber = _.has(val.registeredToken, i);
            if(isTokenNumber){
                tokens.push({key: i, tokenUserData:val.registeredToken[i]})
            }
            else{
                tokens.push({key: i})
            }
        }
        this.setState({tokens,isLoading:false,isToken:true})
    }
    else{
        for(let i=1; i <= val.totalTokens; i++){
            tokens.push({key: i})
        }
        this.setState({tokens,isLoading:false,isToken:true})
    }
  }

  static navigationOptions = {
    title: "See Tokens",
  };

  renderItem = ({ item, index }) => {
    let isTokenUserData = _.isObject(item.tokenUserData);
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SeeTokenDetails',{data:item})}
            style={[styles.item, isTokenUserData ? styles.isDataExist : styles.isDataNotExist]}
        >
            <View>
                <Text style={styles.itemText}>{item.key}</Text>
            </View>
        </TouchableOpacity>
    );
  };

  render() {
    const {isTokenEnable,tokens,isLoading,isToken} = this.state;
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
                        isTokenEnable ? 
                          <View style={styles.tokenMessage}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsForCompany')}>
                                <Text style={{fontSize:17, fontWeight:'bold', color:'#333'}}>Tokens were not allowed</Text>
                              </TouchableOpacity>
                          </View>
                          :
                          <View style={styles.tokenMessage}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('TokenDetails')}>
                                <Text style={{fontSize:17, fontWeight:'bold', color:'#333'}}>Token details were not added</Text>
                              </TouchableOpacity>
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
  isDataExist:{
    backgroundColor: '#2F4F4F',
    // backgroundColor: '#4D243D',
  },
  isDataNotExist:{
    backgroundColor: '#808080',

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
 

export default connect(mapStateToProps, mapDispatchToProps)(SeeTokens);