import { Text, View, StyleSheet, Pressable, FlatList, Alert } from "react-native";
import { Link } from "expo-router";
import { AuthProvider } from "../components/authProvider";
import { app } from "../components/firebaseConfig";
import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from "react";



//Tänne olin tekemässä funktiota, jonka avulla voidaan poistaa listasta ravintola, mutta en saanut sitä valmiiksi ajoissa. 

//<Pressable onPress={() => {remove(item.placeId)}}>
//<Text>Remove from favorites</Text>
//</Pressable>



export default function ProfilePage() {

    const user = AuthProvider();
    const database = getDatabase(app);
    const [users, setUsers] = useState([])
    const [favorites, setFavorites] = useState([]);
    const [favoriteObjects, setFavoriteObjects] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [usersWithKeys, setUsersWithKeys] = useState([])
    const [userKey, setUserKey] = useState("");

    //Hakee käyttäjät tietokannasta
    useEffect(() => {
        const usersRef = ref(database, 'users/');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsersWithKeys(data);
                setUsers(Object.values(data));
            } else {
                setUsers([]);
            }
        });
    }, []);

    //Etsii kirjautuneen käyttäjän käyttäjistä ja hakee sen lempiravintolat ja laittaa useStateen
    useEffect(() => {
        if (user) {
            const existingUser = users.find((existing) => existing.email === user.email);
            setFavoriteObjects(existingUser.favorites);

            setFavorites(Object.values(existingUser.favorites))
            setCurrentUser(existingUser);
        }
    }, [users, user])


    // Hakee kirjautuneen käyttäjän tietokannan id:n ja tallentaa sen useStateen
    useEffect(() => {
        if (user) {
            if (Object.keys(usersWithKeys).length > 0) {
                const keyUsersArray = Object.keys(usersWithKeys).map(key => ({
                    ...usersWithKeys[key],
                    key: key
                }));

                const keyUser = keyUsersArray.find((key) => key.email === user.email);

                setUserKey(keyUser.key);
            }
        }
    }, [usersWithKeys, users, user])



    const remove = (placeId) => {

        const favoritesArray = Object.keys(favoriteObjects).map(key => ({
            ...favoriteObjects[key],
            key: key
        }));


        const deletedRestaurant = favoritesArray.find(restaurant => restaurant.placeId === placeId);
        if (deletedRestaurant) {
            const deletedKey = deletedRestaurant.key;

            if (deletedKey, userKey) {

                remove(ref(database, `users/${userKey}/favorites/${deletedKey}`));
                Alert.alert("Restaurant removed from favorites!")
            } else if (!deletedKey) {
                Alert.alert("Couldn't find the restaurant to delete.")
            } else {
                Alert.alert("Couldn't find your user information.")
            }
        }
    }





    if (user) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 11, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>User: </Text>
                        <Text style={{ fontSize: 20, fontStyle: 'bold', textAlign: 'center' }}>{user.email}</Text>
                    </View>
                    <View style={{ flex: 4 }} >
                        <Text style={{ fontSize: 25, fontStyle: 'bold', textAlign: 'center' }}>My favorite restaurants:</Text>
                        <FlatList
                            renderItem={({ item }) =>
                                <View style={{ flex: 1, paddingTop: 20 }}>
                                    <Text style={{ fontSize: 18, fontStyle: 'bold', textAlign: 'center' }}>{item.name}</Text>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.address}</Text>
                                    <View style={{ alignItems: 'center', width: '100%' }}>

                                    </View>
                                </View>}
                            data={favorites} />
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
                </View>
            </View>

        )
    }
    else {
        return (
            <View style={styles.container}>
                <View style={{ flex: 11, width: "100%" }}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>Log in or sign up to see your profile.</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                        <Link href="/signInPage" asChild>
                            <Pressable>
                                <Text style={{ fontSize: 25, fontStyle: 'bold', textAlign: 'center' }}>Sign In</Text>
                            </Pressable>
                        </Link>
                        <Link href="/registrationPage" asChild>
                            <Pressable>
                                <Text style={{ fontSize: 25, fontStyle: 'bold', textAlign: 'center' }}> Register User</Text>
                            </Pressable>
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
        paddingTop: 200,

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
