import { Text, View, StyleSheet, FlatList, Pressable } from "react-native";
import { useState, useEffect } from 'react';
import { Link } from "expo-router";
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from "../components/firebaseConfig";




export default function RavintolaListaus() {

    const database = getDatabase(app)


    const [restaurants, setRestaurants] = useState([]);

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


    return (
        <View style={styles.container}>
            <View style={{ flex: 11 }}>
                <Link href="/addRestaurant" asChild>
                    <Pressable>
                        <Text>Add a restaurant to the list</Text>
                    </Pressable>
                </Link>
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <FlatList
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, paddingTop: 20 }}>
                                <Text style={{ fontSize: 18, fontStyle: 'bold' }}>{item.name}</Text>
                                <Text style={{ fontSize: 18 }}>{item.address}</Text>

                                <Link href={{
                                    pathname: './restaurants/[id]',
                                    params: { id: item.placeId }
                                }}> <Text>See full irformation or leave a review</Text>
                                </Link>
                            </View>}
                        data={restaurants} />
                </View>
            </View>

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
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
});