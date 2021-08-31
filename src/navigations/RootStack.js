import React from 'react';
import SplashPage from '@pages/SplashPage';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';
import SearchServicePage from '@pages/customer/SearchServicePage';
import {useSelector} from 'react-redux';
import {Constants} from '~constants';
import ProviderStack from './ProviderStack';

const Stack = createStackNavigator();

const RootStack = ({isAuth, isLoading, loginBlock, loggedInAcctype}) => {
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
                    {loggedInAcctype == Constants.ACCOUNT_TYPE.CONSUMER ? (
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
                    ) : null}
                    {loggedInAcctype == Constants.ACCOUNT_TYPE.VENDOR ? (
                        <>
                            <Stack.Screen
                                name="Provider"
                                component={ProviderStack}
                                options={{
                                    animationEnabled: true,
                                    headerShown: false,
                                }}
                            />
                        </>
                    ) : null}
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
