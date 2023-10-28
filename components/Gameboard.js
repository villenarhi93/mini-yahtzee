import { Pressable, Text, View, ScrollView } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import styles from '../style/style';
import { useEffect, useState } from 'react';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [totalPoints, setTotalPoints] = useState(0);
    const [bonusStatus, setBonusStatus] = useState('63 is the bonus limit');

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
       getScoreboardData();
       });
    return unsubscribe;
    }, [navigation]);

    useEffect(() => {
      setNbrOfThrowsLeft(NBR_OF_THROWS)
      selectedDices.fill(false)
      setStatus('Throw dices')
      let countTotalPoints = dicePointsTotal.reduce((sum, point) => sum + point, 0)
      let pointsFromBonus = BONUS_POINTS_LIMIT - countTotalPoints
      if (pointsFromBonus > 0) {
        setTotalPoints(countTotalPoints)
        setBonusStatus('You are ' + pointsFromBonus + ' points from reaching the bonus')
      }
      else {
        const newTotalPoints = countTotalPoints + BONUS_POINTS;
        setTotalPoints(newTotalPoints)
        setBonusStatus('Congratulations you won a bonus!')
      }
      const allPointsSelected = selectedDicePoints.every((pointSelected) => pointSelected);
      if (allPointsSelected) {
        setGameEndStatus(true)
      }
    }, [selectedDicePoints])

    useEffect(() => {
      if (gameEndStatus) {
        savePlayerPoints()
        setStatus('Game Over. Press PLAY NEW GAME to start again')
      }
    }, [gameEndStatus])

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

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

      const savePlayerPoints = async() => {
        const newKey = scores.length + 1;
        const playerPoints = {
          key: newKey,
          name: playerName,
          date: date,
          time: time,
          points: totalPoints,
        };
        
        try {
          const newScore = [...scores, playerPoints];
          const jsonValue = JSON.stringify(newScore);
          await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        }
        catch (e) {
          console.log('Save error: ' + e)
        }
      }

      const getScoreboardData = async() => {
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

    const newGame = () => {
        setGameEndStatus(false)
        setNbrOfThrowsLeft(NBR_OF_THROWS)
        setStatus('Throw dices')
        diceSpots.fill(0)
        dicePointsTotal.fill(0)
        setTotalPoints(0)
        selectedDices.fill(0)
        selectedDicePoints.fill(0)
        setBonusStatus('63 points is the bonus limit')
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
                <Text style={styles.titleMedium}>Gameboard</Text>
                <Container fluid style={styles.dices}>
                  <Row>{dicesRow}</Row>
                </Container>
                <Text style={styles.gameboardText}>Throws left: {nbrOfThrowsLeft}</Text>
                <Text style={styles.statusText}>{status}</Text>
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
                <Text style={styles.titleMedium}>Your score is {totalPoints}</Text>
                <Text style={styles.statusText}>{bonusStatus}</Text>
                <View style={styles.buttonView}>
                  <Pressable style={styles.button} onPress={() => newGame()}>
                    <Text style={styles.buttonText}>PLAY NEW GAME</Text>
                  </Pressable>
                </View>
                <Text style={styles.gameboardText}>Player: {playerName}</Text>   
            <Footer />
         </ScrollView>
      </>  
    )
}