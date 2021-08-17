import React from 'react';
import CustomerHomepage from '@pages/customer/CustomerHomepage';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const CustomerStack = () => {
    return (
        <Stack.Navigator screenOptions={{unmountInactiveRoutes: true, unmountOnBlur: true}}>
            <Stack.Screen name="CustomerHomepage" component={CustomerHomepage} options={{headerShown: false}} />
        </Stack.Navigator>
    );
};

export default CustomerStack;
