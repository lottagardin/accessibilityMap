import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Link } from "expo-router";


export default function Registration() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const register = () => {
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
            <View style={styles.input}>
                <Text>Email:</Text>
                <TextInput
                    onChangeText={text => setEmail(text)}
                    value={email} />
            </View>
            <View style={styles.input}>
                <Text>Password:</Text>
                <TextInput
                    onChangeText={text => setPassword(text)}
                    value={password} />
            </View>
            <Button onPress={register} title="Sign in" />
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                <Link href="/" asChild>
                    <Pressable>
                        <Text>Map</Text>
                    </Pressable>
                </Link>
                <Link href="/restaurantList" asChild>
                    <Pressable>
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