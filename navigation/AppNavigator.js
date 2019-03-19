import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import ViewImage from '../screens/ViewImage';
import MapView from '../screens/MapView';
// Company
import CompanyLogin from '../screens/Company/CompanyLogin';
import TokenDetails from '../screens/Company/TokenDetails';
import SeeTokens from '../screens/Company/SeeTokens';
import SeeTokenDetails from '../screens/Company/SeeTokenDetails';
import SettingsForCompany from '../screens/Company/SettingsForCompany';
import CompanyEditDetails from '../screens/Company/CompanyEditDetails';
// User
import UserLogin from '../screens/User/UserLogin';
import UserCompanyDetails from '../screens/User/UserCompanyDetails';
import UserShowAppointments from '../screens/User/UserShowAppointments';
import UserTakeAppointment from '../screens/User/UserTakeAppointment';
import UserBookedAppointments from '../screens/User/UserBookedAppointments';
import SeeBookedAppointmentDetails from '../screens/User/SeeBookedAppointmentDetails';
import SettingsForUsers from '../screens/User/SettingsForUsers';

export const AppNavigator = createStackNavigator({
  Home: {
    screen : HomeScreen
  },
  Login: {
    screen :  LoginScreen
  },
  Company: {
    screen : CompanyLogin
  }, 
  User: {
    screen : UserLogin
  },
  Main: {
    screen : MainScreen
  },
  TokenDetails: {
    screen : TokenDetails
  },
  SeeTokens: {
    screen : SeeTokens
  },
  SeeTokenDetails: {
    screen : SeeTokenDetails
  },
  CompanyEditDetails:{
    screen: CompanyEditDetails
  },
  ViewImage: {
    screen : ViewImage
  },
  MapView: {
    screen : MapView
  },
  SettingsForCompany: {
    screen : SettingsForCompany
  },
  UserCompanyDetails :{
    screen : UserCompanyDetails
  },
  UserShowAppointments:{
    screen:UserShowAppointments
  },
  UserTakeAppointment:{
    screen:UserTakeAppointment
  },
  UserBookedAppointments:{
    screen:UserBookedAppointments
  },
  SeeBookedAppointmentDetails:{
    screen:SeeBookedAppointmentDetails
  },
  SettingsForUsers:{
    screen:SettingsForUsers
  }
},{
  initialRouteName:"Login"
});
