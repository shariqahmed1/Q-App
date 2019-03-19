import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';


class ViewImage extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        data:this.props.navigation.state.params
    }
  }

    componentDidMount(){
      const {data} = this.state;
      this.props.navigation.setParams({myTitle: data.name})
    }

    static navigationOptions = ({navigation}) => { 
        return { 
            headerTitle: <Text style={{color: 'white', fontSize: 18}}>{navigation.state.params.myTitle}</Text>, headerTransparent: true, 
            headerStyle: { borderBottomWidth: 0, },
            headerTintColor: 'white' 
        } 
    }

  render() {
    const {data} = this.state;
    return (
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <Image source={{uri:data.img}} style={{width:'100%',height:300}}/>
            </View>
        </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#000",
  }
});


export default ViewImage;