import React from 'react';
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{unmountInactiveRoutes: true, unmountOnBlur: true}}>
            <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}} />
            <Stack.Screen name="RegisterPage" component={RegisterPage} options={{headerShown: false}} />
        </Stack.Navigator>
    );
};

export default AuthStack;
