import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { app } from '../../components/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from '../../components/authProvider';
import { router } from 'expo-router';



export default function restaurantPage() {


    const user = AuthProvider();
    const database = getDatabase(app);

    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState({});
    const [restaurants, setRestaurants] = useState([]);
    const [userAverage, setUserAverage] = useState("No user reviews yet");
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);


    //Hakee ravintolat tietokannasta (vain ekalla renderöinnillä)
    useEffect(() => {
        const restaurantsRef = ref(database, 'restaurants/');
        onValue(restaurantsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRestaurants(Object.values(data));
            } else {
                setRestaurants([]);
            }
        });
    }, []);


    // Hakee kyseisen ravintolan tiedot parametrina passatun id:n perusteella 
    //aina kun id-numero tai ravintolat -lista muuttuu (eli kun edellinen useEffect on tapahtunut)
    useEffect(() => {
        if (id && restaurants.length > 0) {
            const foundRestaurant = restaurants.find(
                (item) => item.placeId === id
            );
            setRestaurant(foundRestaurant);
        }
    }, [id, restaurants]);



    //Jos yksittäisellä ravintolalla on arvosteluja, täyttää arvostelut -usestaten niillä 
    //Renderöidään aina ravintolan päivittyessä
    useEffect(() => {
        if (restaurant.reviews) {
            setReviews(restaurant.reviews);
        }
    }, [restaurant]);


    //Jos ravintolalla on arvosteluja, laskee käyttäjien antamien arvosanojen keskiarvon
    //Renderöityy aina, kun arvostelut -usestate päivittyy
    useEffect(() => {
        let totalRatings = 0;

        const reviewsArray = Object.values(reviews);

        if (reviewsArray.length > 0) {
            for (let i = 0; i < reviewsArray.length; i++) {
                const review = reviewsArray[i];
                totalRatings += review.userRating;
            }
            let averageRating = totalRatings / reviewsArray.length;
            setUserAverage(averageRating.toString());
        }
    }, [reviews]);

    //Hakee käyttäjät tietokannasta, renderöidään vain kerran
    useEffect(() => {
        const usersRef = ref(database, 'users/');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const usersArray = Object.keys(data).map(key => ({
                    ...data[key],
                    key: key
                }));

                setUsers(usersArray);
            } else {
                setUsers([]);
            }
        });
    }, []);

    //Lisää kyseisen ravintolan kirjautuneen käyttäjän suosikkeihin tietokantaan
    const addToFavorites = () => {

        // Check if restaurant data is available
        if (!restaurant || Object.keys(restaurant).length === 0) {
            Alert.alert("Restaurant data is missing.");
            return;
        }


        if (user) {
            // Ensure user data is present
            const existingUser = users.find((existing) => existing.email === user.email);

            if (existingUser) {
                // Push to favorites only if restaurant exists

                console.log("käyttäjäavain", user.key);
                const favoriteRef = ref(database, `users/${existingUser.key}/favorites`);
                push(favoriteRef, restaurant)
                    .then(() => {
                        Alert.alert("Restaurant added to your favorites!");
                    })
                    .catch((error) => {
                        Alert.alert("Error adding to favorites:", error.message);
                    });
            } else {
                Alert.alert("User not found in the database.");
            }
        } else {
            Alert.alert("You need to sign in or register to add restaurants to your favorites");
            router.replace('/profilePage');
        }
    };





    if (reviews) {
        return (
            <View style={styles.container}>
                {restaurant.location ? (
                    <MapView
                        style={{ width: '100%', height: '20%' }}
                        region={{
                            latitude: restaurant.location.latitude,
                            longitude: restaurant.location.longitude,
                            latitudeDelta: 0.0322,
                            longitudeDelta: 0.0221,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: restaurant.location.latitude,
                                longitude: restaurant.location.longitude
                            }}
                            title={restaurant.name}
                        />
                    </MapView>
                ) : (
                    <Text>Location not available</Text>
                )}


                <View style={{ flex: 11, width: "100%" }}>
                    <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>{restaurant.name}</Text>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{restaurant.address}</Text>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Rating: {restaurant.overallRating}</Text>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Average user rating: {userAverage}</Text>

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Link href={{
                            pathname: '/reviews/[id]',
                            params: { id: restaurant.placeId }
                        }}> <Text style={{ fontSize: 15, textAlign: 'center', color: '#717171' }}>Leave a review for the restaurant</Text>
                        </Link>
                        <Pressable onPress={addToFavorites}><Text>Add to favorites</Text></Pressable>
                    </View>

                    <Text style={{ fontSize: 25, textAlign: 'center', paddingTop: 25 }}>User reviews:</Text>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, paddingTop: 20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{item.text}</Text>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.author}</Text>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.timestamp}</Text>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Rating: {item.userRating}</Text>
                                </View>
                            )}
                            data={Object.values(reviews)} // Convert object to array
                        />


                    </View>


                </View>



                <View style={styles.bottomNavigation}>
                    <Link href="/" asChild>
                        <Pressable style={styles.button}>
                            <Text>Map</Text>
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
    } else {
        return (
            <View style={styles.container}>
                {restaurant.location ? (
                    <MapView
                        style={{ width: '100%', height: '20%' }}
                        region={{
                            latitude: restaurant.location.latitude,
                            longitude: restaurant.location.longitude,
                            latitudeDelta: 0.0322,
                            longitudeDelta: 0.0221,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: restaurant.location.latitude,
                                longitude: restaurant.location.longitude
                            }}
                            title={restaurant.name}
                        />
                    </MapView>
                ) : (
                    <Text>Location not available</Text>
                )}

                <View style={{ flex: 11, width: "100%" }}>
                    <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>{restaurant.name}</Text>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{restaurant.address}</Text>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Rating: {restaurant.overallRating}</Text>
                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Link href={{
                            pathname: '/reviews/[id]',
                            params: { id: restaurant.placeId }
                        }}> <Text style={{ fontSize: 15, textAlign: 'center', color: '#717171' }}>Leave a review for the restaurant</Text>
                        </Link>
                        <Pressable onPress={addToFavorites}><Text>Add to favorites</Text></Pressable>
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
        width: "100%",
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

