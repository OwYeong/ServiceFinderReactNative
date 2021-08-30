import React from 'react';
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import { createStackNavigator } from "@react-navigation/stack";
import ProviderLoginPage from '@pages/provider/ProviderLoginPage';
import ProviderRegisterPage from '@pages/provider/ProviderRegisterPage';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        
        <Stack.Navigator >
            <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}} />
            <Stack.Screen name="RegisterPage" component={RegisterPage} options={{headerShown: false}} />
            <Stack.Screen name="ProviderLoginPage" component={ProviderLoginPage} options={{headerShown: false}} />
            <Stack.Screen name="ProviderRegisterPage" component={ProviderRegisterPage} options={{headerShown: false}} />
        </Stack.Navigator>
    );
};

export default AuthStack;
