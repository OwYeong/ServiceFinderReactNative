import React, {useEffect, useRef} from 'react';
import CustomerHomepage from '@pages/customer/CustomerHomepage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomerBookingPage from '@pages/customer/CustomerBookingPage';
import ChatPage from '@pages/ChatPage';
import NotificationPage from '@pages/NotificationPage';
import CustomerProfilePage from '@pages/customer/CustomerProfilePage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {CustomColors, CustomTypography} from '@styles';
import {TouchableRipple} from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import * as Animatable from 'react-native-animatable';

import HomeIconSvg from '@assets/images/home-icon.svg';
import ScheduleIconSvg from '@assets/images/schedule-icon.svg';
import ChatIconSvg from '@assets/images/chat-icon.svg';
import NotificationIconSvg from '@assets/images/notification-icon.svg';
import ProfileIconSvg from '@assets/images/profile-icon.svg';

import HomeIconFilledSvg from '@assets/images/home-icon-filled.svg';
import ScheduleIconFilledSvg from '@assets/images/schedule-icon-filled.svg';
import ChatIconFilledSvg from '@assets/images/chat-icon-filled.svg';
import NotificationIconFilledSvg from '@assets/images/notification-icon-filled.svg';
import ProfileIconFilledSvg from '@assets/images/profile-icon-filled.svg';
import ProviderHomePage from '@pages/provider/ProviderHomePage';
import ProviderProfilePage from '@pages/provider/ProviderProfilePage';
import ProviderSchedulePage from '@pages/provider/ProviderSchedulePage';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const getItemWidth = () => {
    //Retrieve the width of each item
    var screenWidth = Dimensions.get('window').width;

    return screenWidth / 5;
};

const ProviderStack = () => {
    const tabIndicatorLeftPos = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    return (
        <>
            <Tab.Navigator
                backBehavior="history"
                screenOptions={({route}) => ({
                    tabBarShowLabel: true,
                    tabBarStyle: {
                        height: 64,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifySelf: 'center',
                        paddingVertical: 6,
                    },
                    tabBarIconStyle: {
                        // marginTop: 8
                        margin: 0,
                        padding: 0,
                        alignSelf: 'center',
                    },
                    tabBarActiveTintColor: CustomColors.PRIMARY_BLUE_SATURATED,
                    tabBarBadgeStyle: {
                        backgroundColor: 'red',
                    },
                    tabBarButton: props => <TouchableRipple {...props} />,
                })}
                renderTouchable={props => <Touchable {...props} />}>
                <Tab.Screen
                    name="ProviderHomepage"
                    component={ProviderHomePage}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({focused, color}) => {
                            if (focused) {
                                Animated.spring(tabIndicatorLeftPos, {
                                    toValue: 0,
                                    useNativeDriver: true,
                                }).start();
                            }

                            return focused ? (
                                <Animatable.Text animation="bounceIn" style={[styles.labelStyle, {color: color}]}>
                                    Home
                                </Animatable.Text>
                            ) : null;
                        },
                        tabBarIcon: ({focused, color}) => (
                            <View style={{width: 24, height: 24, margin: 0, padding: 0}}>
                                {focused ? (
                                    <HomeIconFilledSvg fill={color} />
                                ) : (
                                    <HomeIconSvg fill={CustomColors.GRAY_MEDIUM} />
                                )}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ProviderSchedulePage"
                    component={ProviderSchedulePage}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({focused, color}) => {
                            if (focused) {
                                Animated.spring(tabIndicatorLeftPos, {
                                    toValue: parseInt(getItemWidth() * 1),
                                    useNativeDriver: true,
                                }).start();
                            }
                            return focused ? (
                                <Animatable.Text animation="bounceIn" style={[styles.labelStyle, {color: color}]}>
                                    Bookings
                                </Animatable.Text>
                            ) : null;
                        },
                        tabBarIcon: ({focused, color}) => (
                            <View style={{width: 24, height: 24}}>
                                {focused ? (
                                    <ScheduleIconFilledSvg fill={color} />
                                ) : (
                                    <ScheduleIconSvg fill={CustomColors.GRAY_MEDIUM} />
                                )}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ChatPage"
                    component={ChatPage}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({focused, color}) => {
                            if (focused) {
                                Animated.spring(tabIndicatorLeftPos, {
                                    toValue: parseInt(getItemWidth() * 2),
                                    useNativeDriver: true,
                                }).start();
                            }

                            return focused ? (
                                <Animatable.Text animation="bounceIn" style={[styles.labelStyle, {color: color}]}>
                                    Chats
                                </Animatable.Text>
                            ) : null;
                        },
                        tabBarIcon: ({focused, color}) => (
                            <View style={{width: 24, height: 24}}>
                                {focused ? (
                                    <ChatIconFilledSvg fill={color} />
                                ) : (
                                    <ChatIconSvg fill={CustomColors.GRAY_MEDIUM} />
                                )}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="NotificationPage"
                    component={NotificationPage}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({focused, color}) => {
                            if (focused) {
                                Animated.spring(tabIndicatorLeftPos, {
                                    toValue: parseInt(getItemWidth() * 3),
                                    useNativeDriver: true,
                                }).start();
                            }
                            focused ? (
                                <Animatable.Text animation="bounceIn" style={[styles.labelStyle, {color: color}]}>
                                    Notification
                                </Animatable.Text>
                            ) : null;
                        },
                        tabBarIcon: ({focused, color}) => (
                            <View style={{width: 24, height: 24}}>
                                {focused ? (
                                    <NotificationIconFilledSvg fill={color} />
                                ) : (
                                    <NotificationIconSvg fill={CustomColors.GRAY_MEDIUM} />
                                )}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ProviderProfilePage"
                    component={ProviderProfilePage}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({focused, color}) => {
                            if (focused) {
                                Animated.spring(tabIndicatorLeftPos, {
                                    toValue: parseInt(getItemWidth() * 4),
                                    useNativeDriver: true,
                                }).start();
                            }
                            return focused ? (
                                <Animatable.Text animation="bounceIn" style={[styles.labelStyle, {color: color}]}>
                                    Profile
                                </Animatable.Text>
                            ) : null;
                        },
                        tabBarIcon: ({focused, color}) => (
                            <View style={{width: 24, height: 24}}>
                                {focused ? (
                                    <ProfileIconFilledSvg fill={color} />
                                ) : (
                                    <ProfileIconSvg fill={CustomColors.GRAY_MEDIUM} />
                                )}
                            </View>
                        ),
                    }}
                />
            </Tab.Navigator>

            <Animated.View
                style={[
                    styles.bottomTabIndicatorContainer,
                    {width: getItemWidth(), transform: [{translateX: tabIndicatorLeftPos}]},
                ]}>
                <View style={styles.bottomTabIndicator}></View>
            </Animated.View>
        </>
    );
};

export default ProviderStack;

const styles = StyleSheet.create({
    bottomTabNavigator: {
        backgroundColor: 'white',
        height: 100,
        justifyContent: 'center',
    },
    labelStyle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_12,
    },
    bottomTabIndicatorContainer: {
        height: 2.5,
        elevation: 100,
        zIndex: 2000,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 62,
        left: 0,
    },
    bottomTabIndicator: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: CustomColors.PRIMARY_BLUE_SATURATED,
    },
});
