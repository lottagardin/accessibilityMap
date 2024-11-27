import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../components/firebaseConfig';


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

                <Text>Name: {restaurant.name}</Text>
                <Text>Address: {restaurant.address}</Text>
                <Text>Rating: {restaurant.overallRating}</Text>
                <Text>Average user rating: {userAverage}</Text>
                <Text>User reviews:</Text>
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <FlatList
                        renderItem={({ item }) => <View style={{ flex: 1, paddingTop: 20 }}>
                            <Text style={{ fontSize: 18, fontStyle: 'bold' }}>{item.text}</Text>
                            <Text style={{ fontSize: 18 }}>{item.author}</Text>
                            <Text style={{ fontSize: 18 }}>{item.timestamp}</Text>
                            <Text style={{ fontSize: 18 }}>{item.userRating}</Text>

                        </View>}
                        data={reviews} />
                </View>
                <Link href={{
                    pathname: '/reviews/[id]',
                    params: { id: restaurant.placeId }
                }}> <Text>Leave a review for the restaurant</Text>
                </Link>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                    <Link href="/" asChild>
                        <Pressable>
                            <Text>Map</Text>
                        </Pressable>
                    </Link>
                    <Link href="/profilePage" asChild>
                        <Pressable>
                            <Text>Profile page</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>





        )
    } else {
        return (
            <View style={styles.container}>

                <Text>Name: {restaurant.name}</Text>
                <Text>Address: {restaurant.address}</Text>
                <Text>Rating: {restaurant.overallRating}</Text>

                <Link href={{
                    pathname: '/reviews/[id]',
                    params: { id: restaurant.placeId }
                }}> <Text>Leave a review for the restaurant</Text>
                </Link>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                    <Link href="/" asChild>
                        <Pressable>
                            <Text>Map</Text>
                        </Pressable>
                    </Link>
                    <Link href="/profilePage" asChild>
                        <Pressable>
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
});