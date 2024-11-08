// App.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SimetricoScreen from './SimetricoScreen';
import AsimetricoScreen from './AsimetricoScreen';
import 'react-native-gesture-handler';
const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Button title="Cifrado Simétrico (AES)" onPress={() => navigation.navigate('Simetrico')} />
            <Button title="Cifrado Asimétrico (RSA)" onPress={() => navigation.navigate('Asimetrico')} />
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Seleccionar Cifrado' }} />
                <Stack.Screen name="Simetrico" component={SimetricoScreen} />
                <Stack.Screen name="Asimetrico" component={AsimetricoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
