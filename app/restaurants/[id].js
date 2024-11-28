import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../components/firebaseConfig';
import MapView, { Marker } from 'react-native-maps';


export default function restaurantPage() {

    const database = getDatabase(app);

    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState({});
    const [restaurants, setRestaurants] = useState([]);
    const [userAverage, setUserAverage] = useState("No user reviews yet");
    const [reviews, setReviews] = useState([]);



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

    useEffect(() => {
        console.log(restaurants);
        if (id && restaurants.length > 0) {
            const foundRestaurant = restaurants.find(
                (item) => item.placeId === id
            );
            setRestaurant(foundRestaurant);
        }
    }, [id, restaurants]);




    useEffect(() => {



        if (restaurant.reviews) {
            setReviews(Object.values(restaurant.reviews));

        }

    }, [restaurant]);


    useEffect(() => {
        let totalRatings = 0;

        if (reviews.length > 0) {

            for (let i = 0; i < reviews.length; i++) {
                const review = reviews[i];
                totalRatings += review.userRating;
            }
            let averageRating = totalRatings / reviews.length;
            setUserAverage(averageRating.toString());
        }
    }, [reviews]);

    if (restaurant.reviews) {
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
                    </View>

                    <Text style={{ fontSize: 25, textAlign: 'center' }}>User reviews:</Text>
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <FlatList
                            renderItem={({ item }) => <View style={{ flex: 1, paddingTop: 20 }}>
                                <Text style={{ fontSize: 18, fontStyle: 'bold', textAlign: 'center' }}>{item.text}</Text>
                                <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.author}</Text>
                                <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.timestamp}</Text>
                                <Text style={{ fontSize: 18, textAlign: 'center' }}>Rating:{item.userRating}</Text>

                            </View>}
                            data={reviews} />
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

