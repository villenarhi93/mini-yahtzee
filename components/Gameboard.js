import { Pressable, Text, View, ScrollView } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import styles from '../style/style';
import { useEffect, useState } from 'react';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

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
    const [scores, setScores] = useState([]);

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

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
    for (let numberButton = 0; numberButton < MAX_SPOT; numberButton++) {
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

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
            selectedPoints[i] = true;
            let nbrOfDices = diceSpots.reduce((total, x) => (x === (i+1) ? total + 1 : total), 0);
            points[i] = nbrOfDices * (i + 1);
            setScores(points[i]);
            } 
            else {
                setStatus('You already selected points for ' + (i + 1));
                return points[i];
            }
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            return points[i];
        }
        else {
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
        }
    }

    const throwDices = () => {
        if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            setStatus('Select your points before the next throw');
            return 1;
        }
        else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
            setGameEndStatus(false);
            diceSpots.fill(0);
            dicePointsTotal.fill(0);
        }
        let spots = [...diceSpots];
        for (let i = 0 ; i < NBR_OF_DICES ; i++ ) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                spots[i] = randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again')
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
    
    const savePlayerPoints = async () => {
      const newKey = scores.length + 1;
      const playerPoints = {
        key: newKey,
        name: playerName,
        date: 'pvm',
        time: 'klo',
        points: 0
      }
      try {
        const newScore = [...scores, playerPoints];
        const jsonValue = JSON.stringify(newScore);
        await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
      }
      catch (e) {
        console.log('Save error: ' + e);
      }
    }

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

    const checkBonusPoints = () => {
      if (nbrOfThrowsLeft === 0 && scores >= BONUS_POINTS_LIMIT) {
        let sum = scores + BONUS_POINTS;
        setScores(sum);
        setStatus('You got bonus!')
      } else {
        setStatus('Save your score or start a new game')
      }
    }

    const newGame = () => {
        board = [];
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        diceSpots.fill(0);
    }

    function getDiceColor(i) {
        return selectedDices[i] ? 'black' : '#e08b2a';
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] && !gameEndStatus ? 'black' : '#e08b2a';
    }

    return (
        <>
            <Header />
            <ScrollView>
              <View>
                <Text style={styles.titleMedium}>Gameboard</Text>
                <Container fluid style={styles.dices}>
                  <Row>{dicesRow}</Row>
                </Container>
                <Text style={styles.gameboardText}>Throws left: {nbrOfThrowsLeft}</Text>
                <Text style={styles.gameboardText}>{status}</Text>
                <View style={styles.buttonView}>
                  <Pressable style={styles.button} onPress={() => throwDices()}>
                    <Text style={styles.buttonText}>THROW DICES</Text>
                  </Pressable>
                </View>
                <Container fluid>
                  <Row style={styles.pointsRow}>{pointsRow}</Row>
                </Container>
                <Container fluid>
                  <Row>{pointsToSelectRow}</Row>
                </Container>
                <Text style={styles.titleMedium}>Your score is {scores}</Text>
                <Text style={styles.gameboardText}>Player: {playerName}</Text>
                <View style={styles.buttonView}>
                  <Pressable style={styles.button} onPress={() => savePlayerPoints()}>
                      <Text style={styles.buttonText}>SAVE POINTS</Text>
                  </Pressable>
                </View>
                <Text style={styles.gameboardText}>OR</Text>
                <View style={styles.buttonView}>
                  <Pressable style={styles.button} onPress={() => newGame()}>
                    <Text style={styles.buttonText}>PLAY NEW GAME</Text>
                  </Pressable>
                </View>
              </View>
           <Footer />
         </ScrollView>
      </>  
    )
}