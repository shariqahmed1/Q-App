import React from 'react';
import {FIREBASE_DATABASE} from '../../constants/Functions';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    Alert,
    ToastAndroid,
    Modal,
} from 'react-native';
import _ from 'lodash';
import {validateEmail} from '../../constants/Functions';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import { updateUser } from '../../Redux/Action/Action';
import { Button, Icon } from 'react-native-elements';
import {Item, Input } from 'native-base';

class SettingsForUsers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.myData,
            btnDisbale:true,
            coordinate:this.props.myData.coordinate,
            loader: false,
            modalVisible:false,
            name:this.props.myData.name,
            email:this.props.myData.email,
        }
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ userData: nextProps.myData })
    }

    static navigationOptions = {
        title: "Settings",
    };

    componentDidMount() {
        console.log(this.state.userData);
    }

    setModalVisible(flag){
        this.setState({ modalVisible: flag })        
    }

    updateInfo(){
        const {userData,coordinate,email,name} = this.state;
        if(name === ""){
            ToastAndroid.show('Please Enter Your Email Address', ToastAndroid.SHORT);
        }
        else if(email === ""){
            ToastAndroid.show('Please Enter Your Name', ToastAndroid.SHORT);
        }
        else{
            this.setState({loader:true,btnDisbale:true})
            if (!validateEmail(email)) {
                ToastAndroid.show('Enter valid email', ToastAndroid.SHORT);
            }
            else{
                FIREBASE_DATABASE.ref('users').child(`${userData.id}`).update({
                    coordinate:coordinate,
                    name:name,
                    email:email,
                })
                .then(()=>{
                    this.props.updateUser(userData.id);
                    this.setState({loader:false})
                    this.props.navigation.navigate('Main');
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            }
        }
    }

    nameFunc(text){
        const {email,userData} = this.state;
        this.setState({name: text, btnDisbale: text !== userData.name || email !== userData.email ? false : true})
    }

    emailFunc(text){
        const {name,userData} = this.state;
        this.setState({email: text, btnDisbale: text !== userData.email || name !== userData.name ? false : true})
    }

    setMarker(e){
        this.setState({coordinate:e.nativeEvent.coordinate});
    }

    render() {
        const { userData, coordinate, loader, btnDisbale, name,email} = this.state;
        let makeDisabled = btnDisbale ? true : false;
        let setLocation = JSON.stringify({latitude:userData.coordinate.latitude, longitude:userData.coordinate.longitude}) === JSON.stringify({latitude:coordinate.latitude,longitude:coordinate.longitude});

        return (
            <View style={styles.container}>
                <View style={styles.viewContainer}>
                    <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 18,paddingTop: 10 }}>Account Info</Text>
                </View>
                <View style={styles.viewContainer}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ paddingLeft:3 }}>
                            <Text>Your Name <Text style={{fontSize:13,color:'#2E8B57'}}>*</Text></Text>
                        </View>
                    </View>
                    <Item style={styles.label}>
                        <Input style={styles.fields}  value={name} onChangeText={this.nameFunc.bind(this)}  placeholder="Enter Your Name"/>
                    </Item>
                </View>
                <View style={styles.viewContainer}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ paddingLeft:3 }}>
                            <Text>Your Email Address <Text style={{fontSize:13,color:'#2E8B57'}}>*</Text></Text>
                        </View>
                    </View>
                    <Item style={styles.label}>
                        <Input style={styles.fields} value={email} onChangeText={this.emailFunc.bind(this)}  placeholder="Enter Your Email Address"/>
                    </Item>
                </View>
                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop:40}}>
                    <View style={{position:'absolute', left:10}}>
                        <Button
                            onPress={() => this.setModalVisible(!this.state.modalVisible)}
                            title="See and Update Location"
                            buttonStyle={{
                                backgroundColor: "#005068",
                                width: 250,
                                height: 45,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 2
                            }}
                        />
                    </View>
                </View>
                <View style={{flex:1, flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{position:'absolute',bottom:50}}>
                        <Button
                            onPress={() => this.updateInfo()}
                            title="Update Info"
                            disabled={makeDisabled}
                            buttonStyle={{
                                backgroundColor: "#4D243D",
                                width: 160,
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
                            {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'Yes', onPress: () => {
                                    this.setModalVisible(false)
                                    this.setState({coordinate:userData.coordinate})
                                }
                            },
                        ],
                        { cancelable: false }
                        )
                    }}>
                    <View style={styles.modalNavigation}>
                        <TouchableOpacity
                            style={{
                                paddingLeft:10,
                                paddingTop:3,
                            }}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                                this.setState({coordinate:userData.coordinate})
                            }}
                            >
                            <Icon
                                name='arrow-left'
                                type='material-community'
                                color='#000'
                                size={28}
                            />
                        </TouchableOpacity>
                        <Text style={{paddingLeft:25,fontSize:17,paddingTop:7,width:300}}>Your Selected Location</Text>
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
                        </MapView>
                       }
                       <View style={{position:'absolute',bottom:40,right:25}}>
                            <Icon
                                raised
                                name='bookmark-check'
                                type='material-community'
                                color={setLocation ?  '#ddd': '#005068'}
                                size={30}
                                disabled={setLocation}
                                onPress={()=>{
                                    this.setState({btnDisbale:false})
                                    this.setModalVisible(!this.state.modalVisible);
                                }} 
                            />
                        </View>
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
    viewContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        marginBottom: 10,
    },
    label:{
        paddingTop:20,
      },
    fields:{
      fontSize:15
    },
    modalNavigation:{
        height:55,
        flexDirection:'row',
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        padding:10,
        backgroundColor:"#fff",
      },
    map:{
        flex:1,
        alignItems:'center',
        flexDirection:'column',
        height:300,
        width:'100%',
        justifyContent:'center'
    },
    mapView:{
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
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


export default connect(mapStateToProps, mapDispatchToProps)(SettingsForUsers);