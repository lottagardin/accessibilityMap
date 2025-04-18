import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Link } from "expo-router";
import { Pressable } from "react-native";


export default function Registration() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const signIn = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const CurrentUser = userCredential.user;
                setUser(CurrentUser);
                Alert.alert("sign-in successful");
                router.replace('/profilePage')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                Alert.alert("Error", errorMessage)
            });

    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 11, width: "100%", alignItems: 'center' }}>
                <View style={{ flex: 1, width: "80%" }} >
                    <Text style={{ fontSize: 30, fontStyle: 'bold', textAlign: 'center' }}>Sign In with your e-mail and a password.</Text>
                </View>

                <View style={{ flex: 1, width: "100%", alignItems: 'center' }}>
                    <Text style={{ fontSize: 18 }}>Email:</Text>
                    <View style={styles.input}>

                        <TextInput
                            onChangeText={text => setEmail(text)}
                            value={email}
                        />

                    </View>
                    <Text style={{ fontSize: 18 }}>Password:</Text>
                    <View style={styles.input}>

                        <TextInput
                            onChangeText={text => setPassword(text)}
                            value={password}
                        />

                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Button onPress={signIn} title="Sign In" />
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
        width: "50%",
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