import React from 'react';
import SplashPage from '@pages/SplashPage';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';
import SearchServicePage from '@pages/customer/SearchServicePage';

const Stack = createStackNavigator();

const RootStack = ({isAuth, isLoading, loginBlock}) => {
    return (
        <Stack.Navigator>
            {isLoading ? (
                <Stack.Screen name="SplashPage" component={SplashPage} options={{headerShown: false}} />
            ) : null}
            {/* <Stack.Screen
                name="Auth"
                component={AuthStack}
                options={{
                    animationEnabled: false,
                    headerShown: false,
                }}
            /> */}

            {isAuth && !loginBlock ? (
                <>
                    <Stack.Screen
                        name="Customer"
                        component={CustomerStack}
                        options={{
                            animationEnabled: true,
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="SearchService"
                        component={SearchServicePage}
                        options={{
                            animationEnabled: false,
                            headerShown: false,
                        }}
                    />
                </>
            ) : (
                <Stack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{
                        animationEnabled: true,
                        headerShown: false,
                    }}
                />
            )}
        </Stack.Navigator>
    );
};

export default RootStack;
