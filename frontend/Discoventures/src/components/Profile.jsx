import React from 'react';
import { StyleSheet, ScrollView, Text, View} from 'react-native';
import colors from '../style/colors'
import { Divider } from "@react-native-material/core";
import LogoutButton from './LogoutButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux'
import { userToken } from '../app/slices/userSlice';
import MapCard from './MapCard';

export default function Profile(props) {
  const username = "louis";

  // TODO: Appel GET de la route /routes/users/:id

  const data = {
    id: 1,
    title: 'Seaside',
    coordinates: {
      data: {
        latitude: [
          5.767569, 
          5.767596, 
          5.767611, 
          5.767625, 
          5.76763, 
          5.767361, 
          5.767005,
          5.766801,
          5.766772,
          5.766724,
          5.766723,
          5.766722,
          5.766716,
          5.766713,
          5.766712,
          5.766704,
          5.76664,
          5.766626,
          5.766603,
          5.766629,
          5.766072,
          5.7661,
          5.766053,
          5.76533,
          5.765333,
          5.76533,
          5.765067,
          5.765014,
          5.765011,
          5.764894,
          5.764725,
          5.764697,
          5.764663,
          5.763993,
          5.763975,
          5.763972,
          5.763969,
          5.763967,
          5.76377,
          5.763748,
          5.76374,
          5.763663,
          5.763658,
          5.763606,
          5.763599,
          5.763581,
          5.763574,
          5.763594,
          5.763574,
          5.763581,
          5.763599,
          5.763606,
          5.763655,
          5.763675,
          5.763897,
          5.765853,
          5.765834,
          5.766238,
          5.766769,
          5.767008,
          5.767383,
          5.767424,
          5.767434,
          5.767441,
          5.767494,
          5.767527,
          5.767569
        ],
        longitude: [
          45.193456, 
          45.193261,
          45.193149,
          45.193042,
          45.193007,
          45.192918,
          45.192748,
          45.192642,
          45.192624,
          45.192523,
          45.192517,
          45.192506,
          45.192472,
          45.192447,
          45.192442,
          45.192377,
          45.192379,
          45.192361,
          45.192333,
          45.192142,
          45.192106,
          45.191891,
          45.191888,
          45.191846,
          45.191806,
          45.191846,
          45.191833,
          45.19183,
          45.191858,
          45.192004,
          45.192218,
          45.192216,
          45.192214,
          45.19216,
          45.192232,
          45.192254,
          45.19228,
          45.192297,
          45.19229,
          45.192457,
          45.19253,
          45.193203,
          45.193255,
          45.193671,
          45.193769,
          45.194004,
          45.194109,
          45.194184,
          45.194109,
          45.194004,
          45.193769,
          45.193671,
          45.193674,
          45.193675,
          45.193691,
          45.193828,
          45.194034,
          45.194059,
          45.194093,
          45.194108,
          45.194124,
          45.194126,
          45.194034,
          45.193983,
          45.193985,
          45.193759,
          45.193456
        ]
      }
    },
    estimatedDistance: 10000,
    estimatedTime: 4000000,
    activityType: 'bike',
    userId: 2,
    score: 4.0,
    nbVoters: 10.0,
    isPrivate: false
  }
  
  const places=[
    {
      "title":"Lieu 1",
      "description":"beautiful",
      "latitude": "5.763574",
      "longitude": "45.194109"
    },
    {
      "title":"Lieu 2",
      "description":"beautiful",
      "latitude": "5.766603",
      "longitude": "45.192142,"
    },
  ]
    const dispatch = useDispatch();

    function logout(){
        dispatch(userToken(null))
        props.navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
            
          <View style={styles.box}>
          <Icon name={'account'} size={70} color={'black'}/>
            <Text nativeID='usernameProfile'>{ username }</Text>
            <LogoutButton nativeID="logoutButton" onPress={()=>logout()}/>
          </View>
          <ScrollView>
            <Divider/>
            <MapCard nativeID="mapCard" title={data.title} activityType={data.activityType} distance={data.estimatedDistance/1000} estimatedTime={data.estimatedTime} isPrivate={data.isPrivate} nbVoters={data.nbVoters} score={data.score} gps={data.coordinates.data} places={places}/>
            </ScrollView>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection: 'column',
      padding:20,
      justifyContent:'center'
    },
    box:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    innerText: {
      color: colors.colorPrimary500.color
    },
    input : {
      height:40,
      marginTop: 12,
      marginBottom: 12
    },
    errorMsg:{
      color: "black",
    }
  })