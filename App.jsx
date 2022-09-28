import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Greeting from './components/Greeting';
import First from './components/First';
import Number from './components/Number';
import Name from './components/Name';
import Home from './components/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        networkActivityIndicatorVisible={true}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Greeting">
          <Stack.Screen
            name="Greeting"
            component={Greeting}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="First"
            component={First}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Number"
            component={Number}
            options={{
              headerBackTitle: 'retour',
              headerTransparent: true,
              title: ''
            }}
          />
          <Stack.Screen
            name="Name"
            component={Name}
            options={{
              headerBackTitle: 'retour',
              headerTransparent: true,
              title: ''
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    width: '100%',
    height: '100%'
  },
});
