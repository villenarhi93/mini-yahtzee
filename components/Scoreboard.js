import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { DataTable } from 'react-native-paper';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../style/style';

export default Scoreboard = ({ navigation }) => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
            }
        }
        catch (e) {
            console.log('Read error: ' + e);
        }
    }

    const clearScoreboard = async() => {
        try {
            await AsyncStorage.clear();
            setScores([]);
        }   
        catch(e) {
            console.log('Clear error: ' + e);
        }
    }

    return (
        <>
            <Header />
            <View>
                <Text>Scoreboard</Text>
            </View>
            <Footer />
        </>
    )
}