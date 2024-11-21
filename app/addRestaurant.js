import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { getDatabase, push, remove, ref, onValue } from "firebase/database";
import { app } from '../components/firebaseConfig';

const database = getDatabase(app);

export default function AddRestaurant() {

    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const api_key = "AIzaSyDlkSAevhj2V6TDYcDDEQXbUMd-Vp3kCWU";

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

    const add = () => {
        let query = `${name} ${city}`

        if (name.length > 0 && city.length > 0) {
            fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${api_key}`)
                .then(response => {
                    if (!response.ok) {
                        Alert.alert("Something went wrong:", response.statusText);
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

        const handleSave = () => {
            push(ref(database, 'restaurants/'), restaurant);
        }


        return (
            <View style={styles.container}>
                <Text> Leave a new review</Text>
                <View style={styles.input}>
                    <Text>The name of the restaurant: </Text>
                    <TextInput
                        onChangeText={text => setName(text)}
                        value={name}
                    />
                </View>
                <View style={styles.input}>
                    <Text>The city where the restaurant is located: </Text>
                    <TextInput
                        onChangeText={text => setCity(text)}
                        value={city}
                    />
                </View>
                <Button onPress={add} title="Add restaurant" />
            </View>
        )

    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 100,
        },
        input: {
            height: 40,
            margin: 12,
            width: 200,
            borderWidth: 1,
            padding: 10,
            marginTop: 200
        }
    })
}