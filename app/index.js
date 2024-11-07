import { Text, View, StyleSheet } from "react-native";


import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';


export default function Index() {

  const [sijainti, setSijainti] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ei lupaa käyttää sijaintia')
        return;
      }
      let sijainti = await Location.getCurrentPositionAsync({});
      setSijainti(sijainti);
    })();
  }, []);


  if (!sijainti) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }


  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitude: sijainti.coords.latitude,
        longitude: sijainti.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      }}
    >
      <Marker
        followsUserLocation={true}
        coordinate={{
          latitude: sijainti.coords.latitude,
          longitude: sijainti.coords.longitude
        }}
        title='teiikäläinen'
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});