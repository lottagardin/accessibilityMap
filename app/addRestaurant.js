import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { getDatabase, push, remove, ref, onValue } from "firebase/database";
import { app } from '../components/firebaseConfig';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

const database = getDatabase(app);

export default function AddRestaurant() {

    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const api_key = "AIzaSyD4xAH3_BNsaVnV81xU5m428SgXBuqEDMU";

    const [currentIndex, setCurrentIndex] = useState(0);

    const [restaurant, setRestaurant] = useState({
        name: "",
        address: "",
        overallRating: 0,
        location: {
            latitude: "",
            longitude: ""
        },
        placeId: "",
        reviews: {}
    },
    )

    const [restaurants, setRestaurants] = useState([]);

    const add = () => {
        let query = `${name} ${city}`

        if (name.length > 0 && city.length > 0) {
            fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${api_key}`)
                .then(response => {
                    if (!response.ok) {
                        Alert.alert("Something went wrong:", response.statusText);
                        return null;
                    }
                    return response.json();
                })
                .then(responseData => {

                    if (responseData.results.length > 0) {
                        const showRestaurant = (index) => {
                            const restaurant = responseData.results[index];
                            Alert.alert(
                                'Do you mean this restaurant?',
                                `${restaurant.name}\n${restaurant.formatted_address}`,
                                [
                                    {
                                        text: 'No',
                                        onPress: () => {
                                            if (index < responseData.results.length - 1) {
                                                setCurrentIndex(index + 1);
                                                showRestaurant(index + 1);
                                            } else {
                                                Alert.alert("No restaurant selected.");
                                            }
                                        },
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            setRestaurant({
                                                name: responseData.results[index].name,
                                                address: responseData.results[index].formatted_address,
                                                overallRating: responseData.results[index].rating,
                                                location: {
                                                    latitude: responseData.results[index].geometry.location.lat,
                                                    longitude: responseData.results[index].geometry.location.lng,
                                                },
                                                placeId: responseData.results[index].place_id
                                            })
                                            handleSave();
                                        },
                                    },
                                ]
                            );
                        };

                        showRestaurant(currentIndex);
                    } else {
                        Alert.alert("Couldn't find any restaurants with the given information.");
                    }
                })
                .catch(error => {
                    Alert.alert("Error fetching data:", error.message);
                })
        } else {
            Alert.alert("Please give both the name and the city of the restaurant")
        }
    }

    const handleSave = () => {


        const restaurantsRef = ref(database, 'restaurants/');
        onValue(restaurantsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRestaurants(Object.values(data));
            }
        })

        const existingRestaurant = restaurants.find(
            (existing) => existing.placeId === restaurant.placeId
        );

        if (existingRestaurant) {
            Alert.alert(
                'This restaurant is already in the database.',
                'Do you want to add another restaurant?',
                [
                    {
                        text: 'No',
                        onPress: () => {
                            router.replace('/restaurantList');
                        },
                    },
                    {
                        text: 'Yes',
                        onPress: () => console.log("Adding another restaurant")
                    },
                ]);
        } else {
            push(ref(database, 'restaurants/'), restaurant);
            Alert.alert(
                'Restaurant was added successfully!',
                'Do you want to add another restaurant?',
                [
                    {
                        text: 'No',
                        onPress: () => {
                            router.replace('/restaurantList');
                        },
                    },
                    {
                        text: 'Yes',
                        onPress: () => console.log("Adding another restaurant")
                    },
                ]);

        }
    }

















    return (

        <View style={styles.container}>
            <View style={{ flex: 11, width: "100%", alignItems: 'center' }}>
                <View style={{ flex: 1, width: "80%" }} >
                    <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>Add a new restaurant</Text>
                </View>

                <View style={{ flex: 1, width: "100%", alignItems: 'center' }}>
                    <Text style={{ fontSize: 18 }}>The name of the restaurant: </Text>
                    <View style={styles.input}>

                        <TextInput
                            onChangeText={text => setName(text)}
                            value={name}
                        />

                    </View>
                    <Text style={{ fontSize: 18 }}>The city where the restaurant is located: </Text>
                    <View style={styles.input}>

                        <TextInput
                            onChangeText={text => setCity(text)}
                            value={city}
                        />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Button onPress={add} title="Add restaurant" />
                </View>

            </View>
            <View style={styles.bottomNavigation}>
                <Link href="/" asChild>
                    <Pressable style={styles.button}>
                        <Text>Map</Text>
                    </Pressable>
                </Link>
                <Link href="/restaurantList" asChild>
                    <Pressable style={styles.button}>
                        <Text>List of restaurants</Text>
                    </Pressable>
                </Link>
                <Link href="/profilePage" asChild>
                    <Pressable style={styles.button}>
                        <Text>Profile page</Text>
                    </Pressable>
                </Link>

            </View>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,

    },
    bottomNavigation: {
        backgroundColor: 'grey',
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        alignItems: 'center'
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        margin: 12,
        width: "50%",
        borderWidth: 4,
        borderColor: 'grey',
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'grey',

    },

});



