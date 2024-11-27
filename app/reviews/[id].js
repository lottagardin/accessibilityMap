import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../components/firebaseConfig';

const database = getDatabase(app);

export default function addReview() {

    const api_key = "AIzaSyD4xAH3_BNsaVnV81xU5m428SgXBuqEDMU";


    const { id } = useLocalSearchParams();
    const [review, setReview] = useState({
        author: "",
        text: "",
        rating: 0,
        picture: {
            picId: (""),
            picUri: ("")
        }
    })

}