import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        marginTop: 30,
        marginBottom: 15,
        backgroundColor: 'e08b2a',
        flexDirection: 'row',
    },
    footer: {
        marginTop: 50,
        backgroundColor: '#e08b2a',
        flexDirection: 'row'
    },
    title: {
        fontWeight: 'bold',
        flex: 1,
        fontSize: 32,
        textAlign: 'center',
        margin: 10,
    },
    author: {
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
    },
    gameboard: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gameinfo: {
        backgroundColor: '#fff',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginTop: 10
    },
    button: {
        backgroundColor: "#e08b2a",
        height: 50,
        width: 150,
        borderRadius: 15,
        color:'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        backgroundColor: "#e08b2a",
    },
    enterName: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 30,
    },
    textInput: {
      padding: 15,
      fontSize: 24,
      textAlign: 'center'
    },
    home: {
      alignItems: 'center',
      justifyContent:'center'
    },
    rules: {
      fontSize: 28,
      marginTop: 30,
      marginBottom: 20,
      fontWeight: 'bold'
    },
    play: {
      fontSize: 24,
      padding: 15,
      color: 'white',
      backgroundColor: '#e08b2a',
      borderRadius: 15,
      marginTop: 20
    },
    text: {
      fontSize: 16,
      margin: 8,
    },
    player: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 10
    }

});