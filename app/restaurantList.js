import { Text, View, StyleSheet, FlatList, Pressable } from "react-native";
import { useState, useEffect } from 'react';
import { Link } from "expo-router";
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from "../components/firebaseConfig";




export default function RavintolaListaus() {

    const database = getDatabase(app)


    const [restaurants, setRestaurants] = useState([]);

    //Hakee ravintolat tietokannasta
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
            <View style={{ backgroundColor: 'grey', width: "100%", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Link href="/addRestaurant" asChild>
                    <Pressable style={styles.button}>
                        <Text style={{ fontSize: 18, fontStyle: 'bold', textAlign: 'center' }}>Add a restaurant to the list</Text>
                    </Pressable>
                </Link>
            </View>
            <View style={{ flex: 11, width: "100%" }}>

                <View style={{ flex: 5, paddingTop: 20 }}>
                    <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>
                        Accessible restaurants in the database:
                    </Text>
                    <FlatList
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, paddingTop: 20 }}>
                                <Text style={{ fontSize: 18, fontStyle: 'bold', textAlign: 'center' }}>{item.name}</Text>
                                <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.address}</Text>
                                <View style={{ alignItems: 'center', width: '100%' }}>
                                    <Link href={{
                                        pathname: './restaurants/[id]',
                                        params: { id: item.placeId }
                                    }}> <Text style={{ fontSize: 15, textAlign: 'center', color: '#717171' }}>See full irformation or leave a review</Text>
                                    </Link>
                                </View>
                            </View>}
                        data={restaurants} />
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
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,

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

