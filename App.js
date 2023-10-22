import Home from './components/Home';
import Gameboard from './components/Gameboard';
import Scoreboard from './components/Scoreboard';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from './style/style';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        screenOptions={({ route }) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'information'
                : 'information-outline'
            }
            else if (route.name === 'Gameboard') {
              iconName = focused
                ? 'dice-multiple'
                : 'dice-multiple-outline'
            }
            else if (route.name === 'Scoreboard') {
              iconName = focused
                ? 'view-list'
                : 'view-list-outline'
            }
            return <MaterialCommunityIcons 
              name={iconName}
              size={size}
              color={color}
              />
          },
          tabBarActiveTintColor: '#e08b2a',
        tabBarInactiveTintColor: 'black'
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarStyle: {display: 'none' }}} />
      <Tab.Screen name="Gameboard" component={Gameboard} />
      <Tab.Screen name="Scoreboard" component={Scoreboard} />
    
      </Tab.Navigator>
    </NavigationContainer>

  );
}