import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import { Constants, MapView } from 'expo';
import { Icon} from 'react-native-elements'
import MapViewDirections from './MapViewDirection';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCYvMpmVhFc0ydILEuXGJNYNGFnBoKPCL8';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.navigation.state.params,
      showRoute:false,
      coordinates: [
        {
          latitude: this.props.navigation.state.params.companyCoordinate.latitude,
          longitude: this.props.navigation.state.params.companyCoordinate.longitude,
        },
        {
          latitude:this.props.navigation.state.params.myCoordinate.latitude,
          longitude:this.props.navigation.state.params.myCoordinate.longitude,
        },
      ],
    };

    this.mapView = null;
  }

  componentDidMount() {
    const { data } = this.state;
    this.props.navigation.setParams({ myTitle: data.name })
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{navigation.state.params.myTitle}'s{` `}Location</Text>,
    }
  }

  onMapPress = (e) => {
    if (this.state.coordinates.length == 2) {
      this.setState({
        coordinates: [
          e.nativeEvent.coordinate,
        ],
      });
    } else {
      this.setState({
        coordinates: [
          ...this.state.coordinates,
          e.nativeEvent.coordinate,
        ],
      });
    }
  }

  onReady = (result) => {
    this.mapView.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: (width / 20),
        bottom: (height / 20),
        left: (width / 20),
        top: (height / 20),
      }
    });
  }

  onError = (errorMessage) => {
    Alert.alert(errorMessage);
  }

  render() {
    const { data,showRoute } = this.state;
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: data.companyCoordinate.latitude,
            longitude: data.companyCoordinate.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={StyleSheet.absoluteFill}
          ref={c => this.mapView = c}
          onPress={this.onMapPress}
          loadingEnabled={true}
        >
          {this.state.coordinates.map((coordinate, index) =>
            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} /> 
          )}
          { showRoute &&
            (this.state.coordinates.length === 2) && (
            <MapViewDirections
              origin={this.state.coordinates[0]}
              destination={this.state.coordinates[1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="#00b3fd"
              onReady={this.onReady}
              onError={this.onError}
            />
          )}
        </MapView>
        <View style={{position:'absolute',bottom:40,right:25}}>
          <Icon
            raised
            name='directions'
            type='material'
            color='#005068'
            size={30}
            onPress={()=>this.setState({showRoute:!this.state.showRoute})} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});