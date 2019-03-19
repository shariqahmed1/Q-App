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
import { Divider,Icon } from 'react-native-elements';


class SeeBookedAppointmentDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.navigation.state.params })
    }

    componentDidMount() {
        const { data } = this.state;
        console.log(data);
        this.props.navigation.setParams({ myTitle: data.apptNum })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Appointment No. {navigation.state.params.myTitle}</Text>,
        }
    }

    render() {
        const { data } = this.state;
        var img = data.picture ? { uri: data.picture.imagePath } : require('../images/Loader.gif');

        return (
            <ScrollView style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => data.picture ? this.props.navigation.navigate('ViewImage', { name: "Your Recognized Picture", img: data.picture.imagePath }) : console.log("NO")}>
                            <Image source={img} style={{ width: 150, height: 150, borderRadius: 100, padding: 0 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>{data.name}</Text>
                    <Text style={{ textAlign: 'center', marginTop: 8 }}>{data.email}</Text>

                    <Divider style={{ backgroundColor: '#DCDCDC', marginTop: 25, marginLeft: 10, marginRight: 10 }} />
                    {
                        data.checkAppointmentTime ?
                            <View style={styles.viewContainer}>
                                <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 16 }}>Estimated Time</Text>
                                <Text style={{ marginTop: 5 }}>Your Appointment will come {data.estimatedTime}</Text>
                            </View>
                            :
                            <View style={styles.viewContainer}>
                                <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 16 }}>Start Time</Text>
                                <Text style={{ marginTop: 5 }}>Today's Appointments will start at {moment(data.companyDetails.timings.startTime, "hh:mm").format('LT')}</Text>
                            </View>
                    }


                    <Divider style={{ backgroundColor: '#DCDCDC', marginTop: 15, marginLeft: 10, marginRight: 10 }} />

                    <View style={styles.viewContainer}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{fontWeight:'bold', color:'#005068', fontSize:16}}>Company Name</Text>
                            </View>
                            <View style={{ paddingTop: 0, paddingRight: 15 }}>
                                <Icon
                                    name='chevron-right'
                                    type='material-community'
                                    color='#2E8B57'
                                    size={25}
                                    onPress={()=>this.props.navigation.navigate('UserCompanyDetails', data.companyDetails)}
                                />
                            </View>
                        </View>
                        <Text style={{marginTop:0}}>{data.companyDetails.companyName}</Text>
                    </View>

                    <Divider style={{ backgroundColor: '#DCDCDC', marginTop: 15, marginLeft: 10, marginRight: 10 }} />

                    <View style={styles.viewContainer}>
                        <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 16 }}>Timings</Text>
                        <Text style={{ marginTop: 5 }}>{moment(data.companyDetails.timings.startTime, "hh:mm").format('LT')} to {moment(data.companyDetails.timings.endTime, "hh:mm").format('LT')}</Text>
                    </View>

                    <Divider style={{ backgroundColor: '#DCDCDC', marginTop: 15, marginLeft: 10, marginRight: 10 }} />

                    <View style={styles.viewContainer}>
                        <Text style={{ fontWeight: 'bold', color: '#005068', fontSize: 16 }}>Appointment Booked Date</Text>
                        <Text style={{ marginTop: 5 }}>{data.time}</Text>
                    </View>


                </View>
            </ScrollView>
        );
    }
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    innerContainer: {
        marginBottom: 20,
    },
    viewContainer: {
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 10,
    },
    certificates: {
        flex: 1,
        marginBottom: 20,
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    btnContainer: {
        marginTop: 20,
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


export default connect(mapStateToProps, mapDispatchToProps)(SeeBookedAppointmentDetails);
