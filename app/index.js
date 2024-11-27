import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { app } from '../../components/firebaseConfig';

//1) Hae ravintolat firebasesta
//2) Vertaa ravintoloiden koordinaatteja käyttäjän koordinaatteihin
//3) Laita ravintolat uuteen arrayhin etäisyyden mukaan käyttäjästä
//4) Näytä ravintolat Flaslistana (koodin voi kopioida restaurantlistista)

export default function Index() {

  const database = getDatabase(app)
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const restaurantsRef = ref(database, 'restaurants/');
    onValue(restaurantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRestaurants(Object.values(data));
      } else {
        setRestaurants([]);
      }
    })
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ei lupaa käyttää sijaintia')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <MapView
        style={{ width: '100%', height: '55%' }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
      >
        <Marker
          followsUserLocation={true}
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }}
          title='teiikäläinen'
        />
      </MapView>


      <View style={{ flex: 5 }}>
        <Text> this will list the nearby restaurants </Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
        <Link href="/restaurantList" asChild>
          <Pressable>
            <Text>A list of the restaurants</Text>
          </Pressable>
        </Link>
        <Link href="/profilePage" asChild>
          <Pressable>
            <Text>Profile page</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  }
});

