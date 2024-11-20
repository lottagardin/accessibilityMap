import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from "firebase/database";
import { app } from '../components/firebaseConfig';

const database = getDatabase(app);

export default function AddRestaurant() {

    const [restaurant, setRestaurant] = useState({
        name: "",
        rating: 0,
        reviews: {
            author: "",
            text: "",
            rating: 0,
            picture: "" //Missä muodossa tää pittää olla? :-0
        },
        input: {
            height: 40,
            margin: 12,
            width: 200,
            borderWidth: 1,
            padding: 10,
            marginTop: 200
        }
    })

}