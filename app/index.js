import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';



export default function Index() {

  const [location, setLocation] = useState(null);

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
      <View style={{ flex: 1 }}>
        <Link href="/restaurantList" asChild>
          <Pressable>
            <Text>a list of the restaurants</Text>
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
  },
});