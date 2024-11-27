import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../components/firebaseConfig';

export default function restaurantPage() {

    const database = getDatabase(app);

    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState({});
    const [restaurants, setRestaurants] = useState([]);



    useEffect(() => {
        const restaurantsRef = ref(database, 'restaurants/');
        onValue(restaurantsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRestaurants(Object.values(data)); // Populate restaurants
            } else {
                setRestaurants([]);
            }
        });
    }, []);

    useEffect(() => {
        console.log("ID:", id);
        console.log("Restaurants:", restaurants);
        if (id && restaurants.length > 0) {
            const foundRestaurant = restaurants.find(
                (item) => item.placeId === id
            );
            setRestaurant(foundRestaurant);
            console.log("Found restaurant:", foundRestaurant);
        }
    }, [id, restaurants]);



    return (
        <View style={styles.container}>
            <Text>Name: {restaurant.name}</Text>
            <Text>Address: {restaurant.address}</Text>
            <Text>Rating: {restaurant.overallRating}</Text>
            <Link href={{
                pathname: './restaurants/[id]',
                params: { id: restaurant.placeId }
            }}> <Text>Leave a review for the restaurant</Text>
            </Link>
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
});