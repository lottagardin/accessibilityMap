import { Text, View, StyleSheet, Pressable, FlatList, TextInput, KeyboardAvoidingView, Button, Platform } from "react-native";
import { Link } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import getDistance from 'geolib/es/getDistance';
import { app } from "../components/firebaseConfig";
import { getDatabase, ref, onValue } from 'firebase/database';


//5) Käyttäjälle textfield, johon voi syöttää kaupungin --> koordinaatit vaihtuu kaupungin koordinaateiksi

export default function Index() {

  const database = getDatabase(app)
  const api_key = "AIzaSyD4xAH3_BNsaVnV81xU5m428SgXBuqEDMU";

  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const [shownRestaurants, setShownRestaurants] = useState([]);
  const [distance, setDistance] = useState(30000);
  const [city, setCity] = useState("");
  const [mapLocation, setMapLocation] = useState({
    latitude: 0,
    longitude: 0
  })


  //Hakee ravintolat databasesta
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

  //Pyytää käyttäjältä luvan sijaintitietojen jakamiseen
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




  //Map through the restaurants and add every restaurant first to the ShownRestaurant usestate and then add it to the shownRestaurant array
  useEffect(() => {
    if (location) {
      const updatedRestaurants = restaurants
        .map((currentRestaurant) => {
          const distance = getDistance(
            {
              latitude: mapLocation.latitude,
              longitude: mapLocation.longitude,
            },
            {
              latitude: currentRestaurant.location.latitude,
              longitude: currentRestaurant.location.longitude,
            }
          );
          return {
            restaurantName: currentRestaurant.name,
            restaurantAddress: currentRestaurant.address,
            restaurantDistance: distance,
            restaurantId: currentRestaurant.placeId,
            latitude: currentRestaurant.location.latitude,
            longitude: currentRestaurant.location.longitude
          };
        })
        .filter((restaurant) => restaurant.restaurantDistance < distance)
        .sort((a, b) => a.restaurantDistance - b.restaurantDistance);

      setShownRestaurants(updatedRestaurants);

    }
  }, [location, restaurants, distance, mapLocation]);



  useEffect(() => {
    if (location) {
      setMapLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    }
  }, [location])

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const changeCity = () => {
    if (city.length > 0) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${api_key}`)
        .then(response => {
          if (!response.ok) {
            Alert.alert("Something went wrong:", response.statusText);
            return null;
          }
          return response.json();
        })
        .then(responseData => {
          if (responseData.results && responseData.results.length > 0) {
            const geometry = responseData.results[0].geometry;
            console.log(geometry);


            setMapLocation({
              latitude: geometry.location.lat,
              longitude: geometry.location.lng
            });
          } else {
            Alert.alert("No results found for this city");
          }
        })
    }
  }





  return (
    <View style={styles.container}>
      <MapView
        style={{ width: '100%', height: '40%' }}
        region={{
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
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
          title='Your location'
        />

        {shownRestaurants.map((restaurant) => (
          <Marker
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude
            }}
            title={restaurant.restaurantName}
          />
        ))}
      </MapView>

      <View style={{ flex: 2, paddingTop: 10 }}>
        <Text>Find accessible restaurants in another city: </Text>

        {/* Center the inputs and buttons */}
        <View style={{ alignItems: 'center' }}>
          <TextInput
            onChangeText={text => setCity(text)}
            value={city}
            style={styles.input} // Styling for the TextInput
            placeholder="Enter a city"
          />
          <Button
            onPress={changeCity}
            title="Search"
            color="#841584"
          />
        </View>
      </View>


      <View style={{ flex: 5 }}>
        <FlatList
          renderItem={({ item }) =>
            <View style={{ flex: 1, paddingTop: 20 }}>
              <Text style={{ fontSize: 18, fontStyle: 'bold' }}>{item.restaurantName}</Text>
              <Text style={{ fontSize: 18 }}>{item.restaurantAddress}</Text>

              <Link href={{
                pathname: './restaurants/[id]',
                params: { id: item.restaurantId }
              }}> <Text>See full information or leave a review</Text>
              </Link>
            </View>}
          data={shownRestaurants} />
      </View>



      <View style={styles.bottomNavigation}>
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
    </View >
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
  bottomNavigation: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    width: "100%",
    borderWidth: 1,
    padding: 20,
    flexDirection: "row",
    paddingTop: 10
  }
});

