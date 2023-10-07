import { Pressable, Text, View } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import styles from '../style/style';
import { useEffect, useState } from 'react';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let board = [];

export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [selectedDices, setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false));
    const [diceSpots, setDiceSpots] = 
        useState(new Array(NBR_OF_DICES).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] =
        useState(new Array(MAX_SPOT).fill(false));
    const [dicePointsTotal, setDicePointsTotal] = 
        useState(new Array(MAX_SPOT).fill(0));
    
    const dicesRow = [];
    for ( let dice = 0; dice < NBR_OF_DICES ; dice++ ) {
        dicesRow.push(
            <Col key={'dice' + dice}>
                <Pressable 
                    key={'dice' + dice}
                    onPress={() => selectDice(dice)}>
                    <MaterialCommunityIcons 
                        name={board[dice]}
                        key={'dice' + dice}
                        size={50}
                        color={getDiceColor(dice)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={'pointsRow' + spot}>
                <Text key={'pointsRow' + spot}>
                    {getSpotTotal(spot)}
                </Text>
            </Col>
        );
    }

    const pointsToSelectRow = [];
    for (let numberButton = 0; numberButton < NBR_OF_DICES; numberButton++) {
        pointsToSelectRow.push(
            <Col key={'buttonsRow' + numberButton}>
                <Pressable
                    key={'buttonsRow' + numberButton}
                    onPress={() => selectDicePoints(numberButton)}>
                    <MaterialCommunityIcons
                        name={'numeric-' + (numberButton + 1) + '-circle'}
                        key={'buttonsRow' + numberButton}
                        size={35}
                        color={getDicePointsColor(numberButton)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }
    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
        else {
            setStatus('You have to throw dices first')
        }
    }

    function getDiceColor(i) {
        return selectedDices[i] ? 'black' : 'steelblue';
    }

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, [])

    return (
        <>
            <Header />
            <View>
                <Text>Gameboard</Text>
                <Text>Player: {playerName}</Text>
            </View>
            <Footer />
        </>
    )
}