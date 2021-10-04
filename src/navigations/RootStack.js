import React from 'react';
import SplashPage from '@pages/SplashPage';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';
import SearchServicePage from '@pages/customer/SearchServicePage';
import {useSelector} from 'react-redux';
import {Constants} from '~constants';
import ProviderStack from './ProviderStack';
import IntroductionSliderPage from '@pages/IntroductionSliderPage';
import SetupBusinessProfileWalkThrough from '@pages/provider/SetupBusinessProfileWalkthrough';
import PostEditCreatePage from '@pages/provider/PostEditCreatePage';
import PostViewPage from '@pages/PostViewPage';
import TestPage from '@pages/TestPage';
import BusinessProfileEditPage from '@pages/provider/BusinessProfileEditPage';
import FormEditPage from '@pages/provider/FormEditPage';

const Stack = createStackNavigator();

const RootStack = ({isAuth, isLoading, loginBlock, loggedInAcctype}) => {
    const userInfo = useSelector(state => state.loginState.userInfo);

    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="test" component={TestPage} options={{headerShown: false}} /> */}
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
                    {userInfo.isFirstTimeUser ? (
                        <Stack.Screen
                            name="IntroductionSliderPage"
                            options={{
                                animationEnabled: true,
                                headerShown: false,
                            }}>
                            {props => <IntroductionSliderPage {...props} accType={userInfo.accType} />}
                        </Stack.Screen>
                    ) : null}

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
                            {!userInfo.isBusinessProfileSetup ? (
                                <Stack.Screen
                                    name="ProviderBusinessSetup"
                                    component={SetupBusinessProfileWalkThrough}
                                    options={{
                                        animationEnabled: true,
                                        headerShown: false,
                                    }}
                                />
                            ) : null}
                            <Stack.Screen
                                name="Provider"
                                component={ProviderStack}
                                options={{
                                    animationEnabled: true,
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="PostEditCreate"
                                component={PostEditCreatePage}
                                options={{
                                    animationEnabled: true,
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="PostView"
                                component={PostViewPage}
                                options={{
                                    animationEnabled: true,
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="BusinessProfileEdit"
                                component={BusinessProfileEditPage}
                                options={{
                                    animationEnabled: true,
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="FormEdit"
                                component={FormEditPage}
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
