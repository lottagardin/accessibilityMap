import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, push } from 'firebase/database';
import { app } from '../../components/firebaseConfig';
import { router } from 'expo-router';

const database = getDatabase(app);

export default function addReview() {
    new Date(Date.now()).toLocaleDateString();
    const { id } = useLocalSearchParams();
    const [review, setReview] = useState({
        author: "",
        text: "",
        userRating: 0,
        timestamp: new Date(Date.now()).toLocaleDateString()
    })


    const [restaurant, setRestaurant] = useState({})
    const [restaurants, setRestaurants] = useState([]);


    useEffect(() => {
        const restaurantsRef = ref(database, 'restaurants/');
        onValue(restaurantsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const restaurantsArray = Object.keys(data).map(key => ({
                    ...data[key],
                    key: key
                }));

                setRestaurants(restaurantsArray);
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


    const add = () => {

        if (review.userRating < 1) {
            Alert.alert("You need to rate the restaurant with a number bigger than 0!")
            return;
        }
        else {
            const reviewsRef = ref(database, `restaurants/${restaurant.key}/reviews`);

            console.log('Id:', id);
            push(reviewsRef, review);
            Alert.alert('Review was added successfully!')
            router.replace('/restaurantList')
        }
    }



    return (
        <View style={styles.container}>
            <Text> Leave a new review</Text>
            <View style={styles.input}>
                <Text>Your username:</Text>
                <TextInput
                    placeholder='anonymous'
                    onChangeText={text => setReview({ ...review, author: text })}
                    value={review.author}
                />
            </View>
            <View style={styles.input}>
                <Text>Your review:</Text>
                <TextInput
                    onChangeText={text => setReview({ ...review, text: text })}
                    value={review.text}
                />
            </View>
            <View style={styles.input}>
                <Text>Your rating 1-5: {review.userRating}</Text>
                <View style={styles.ratingButtons}>
                    <Pressable
                        onPress={() => {
                            setReview({ ...review, userRating: 1 });
                        }}>
                        <Text>1</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setReview({ ...review, userRating: 2 });
                        }}>
                        <Text>2</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setReview({ ...review, userRating: 3 });
                        }}>
                        <Text>3</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setReview({ ...review, userRating: 4 });
                        }}>
                        <Text>4</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setReview({ ...review, userRating: 5 });
                        }}>
                        <Text>5</Text>
                    </Pressable>
                </View>
            </View>
            <View>
                <Button onPress={add} title="Add your review" />
            </View>
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

    },
    ratingButtons: {
        height: 40,
        margin: 12,
        width: 200,
        borderWidth: 1,
        padding: 10,
        marginTop: 200,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})
