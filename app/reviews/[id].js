import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { app } from '../../components/firebaseConfig';
import { router } from 'expo-router';

const database = getDatabase(app);

export default function addReview() {
    new Date(Date.now()).toLocaleDateString();
    const { id } = useLocalSearchParams();
    const [review, setReview] = useState({
        author: "anonymous",
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


            push(reviewsRef, review);
            Alert.alert('Review was added successfully!')
            router.replace('/restaurantList')
        }
    }



    return (
        <View style={styles.container}>
            <View style={{ flex: 11, width: "80%", alignItems: 'center' }}>
                <View style={{ flex: 2 }} >
                    <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}> Leave a new review</Text>
                </View>
                <View style={{ flex: 4, width: "100%", alignItems: 'center' }}></View>
                <Text style={{ fontSize: 18 }}>Your username:</Text>
                <View style={styles.input}>

                    <TextInput
                        placeholder='anonymous'
                        onChangeText={text => setReview({ ...review, author: text })}
                        value={review.author}
                    />
                </View>
                <Text style={{ fontSize: 18 }}>Your review:</Text>
                <View style={styles.textbox}>

                    <TextInput
                        onChangeText={text => setReview({ ...review, text: text })}
                        value={review.text}
                    />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>Your rating 1-5:</Text>


                    <View style={styles.ratingButtons}>


                        {[1, 2, 3, 4, 5].map((rating) => (
                            <Pressable
                                key={rating}
                                style={[
                                    styles.button,
                                    review.userRating === rating && styles.selectedButton,
                                ]}
                                onPress={() => setReview({ ...review, userRating: rating })}
                            >
                                <Text
                                    style={[
                                        styles.text,
                                        review.userRating === rating && styles.selectedText,
                                    ]}
                                >{rating}</Text>
                            </Pressable>
                        ))}


                    </View>
                </View>
                <View>
                    <Button onPress={add} title="Add your review" />

                </View>
            </View>
            <View style={styles.bottomNavigation}>
                <Link href="/" asChild>
                    <Pressable style={styles.bottomButton}>
                        <Text>Map</Text>
                    </Pressable>
                </Link>
                <Link href="/restaurantList" asChild>
                    <Pressable style={styles.bottomButton}>
                        <Text>List of restaurants</Text>
                    </Pressable>
                </Link>
                <Link href="/profilePage" asChild>
                    <Pressable style={styles.bottomButton}>
                        <Text>Profile page</Text>
                    </Pressable>
                </Link>

            </View>
        </View>

    )

}


const styles = StyleSheet.create({
    ratingButtons: {
        height: 40,
        margin: 12,
        width: "80%",
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
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
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'grey',
        width: 20
    },
    bottomButton: {
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

    textbox: {
        backgroundColor: 'white',
        height: 300,
        margin: 12,
        width: "100%",
        borderWidth: 4,
        borderColor: 'grey',
        textAlign: 'center',
        textAlignVertical: 'top'
    },

    text: {
        color: 'black',
    },

    selectedText: {
        color: 'white',
    },

    selectedButton: {
        backgroundColor: 'grey',
        color: 'white',
    },
})
