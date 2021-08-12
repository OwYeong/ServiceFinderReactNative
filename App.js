/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 *
 */
import 'react-native-gesture-handler';
import React from 'react';
import type {Node} from 'react';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from '@pages/LoginPage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashPage from '@pages/SplashPage';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {CustomColors} from '@styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RegisterPage from '@pages/RegisterPage';

const Stack = createStackNavigator();
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
        background: CustomColors.WHITE,
        surface: CustomColors.WHITE,
        backdrop: 'white',
        error: 'red'
    },
};

const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: 'blue',
    };

    console.log('hahaha');
    // firestore().collection('users').get().then(querySnapshot=>{

    //   querySnapshot.forEach(documentSnapshot => {
    //     console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //   });
    // });

    return (
        <PaperProvider
            settings={{
                icon: props => <Icon {...props} />,
            }}
            theme={theme}>
            <NavigationContainer>
                <SafeAreaProvider>
                    <Stack.Navigator screenOptions={{unmountInactiveRoutes:true, unmountOnBlur: true}}>
                        <Stack.Screen name="SplashPage" component={SplashPage} options={{headerShown: false}} />
                        <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}} />
                        <Stack.Screen name="RegisterPage" component={RegisterPage} options={{headerShown: false}} />
                    </Stack.Navigator>
                </SafeAreaProvider>
            </NavigationContainer>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
