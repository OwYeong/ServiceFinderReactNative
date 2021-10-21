import NewRequestDisplayComponent from '@organisms/NewRequestDisplayComponent';
import PendingRequestListing from '@organisms/PendingRequestListing';
import RequestHistoryDisplayComponent from '@organisms/RequestHistoryDisplayComponent';
import ServiceHistoryListing from '@organisms/ServiceHistoryListing';
import UpcomingServiceListing from '@organisms/UpcomingServiceListing';
import {useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import React, {useState} from 'react';
import {Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {TextInput, Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, TabBar, SceneMap, PagerPan} from 'react-native-tab-view';

const CustomerBookingPage = () => {
    const navigation = useNavigation();

    const [navigationState, setNavigationState] = useState({
        index: 0,
        routes: [
            {key: 'upcomingRequest', title: 'Upcoming'},
            {key: 'pendingRequest', title: 'Pending'},
            {key: 'history', title: 'History'},
        ],
    });
    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={{width: '100%', flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
                        <Text
                            style={{
                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                fontSize: CustomTypography.FONT_SIZE_20,
                            }}>
                            My Service Request
                        </Text>
                    </View>
                    <TabView
                        style={{height: Dimensions.get('window').height - 64 - 24}}
                        navigationState={navigationState}
                        renderScene={({route}) => {
                            // return <View></View>;
                            switch (route.key) {
                                case 'upcomingRequest':
                                    return <UpcomingServiceListing />;
                                case 'pendingRequest':
                                    return <PendingRequestListing />;
                                case 'history':
                                    return <ServiceHistoryListing />;
                                default:
                                    return null;
                            }
                        }}
                        renderTabBar={props => {
                            return (
                                <TabBar
                                    {...props}
                                    inactiveColor={CustomColors.GRAY}
                                    indicatorStyle={{backgroundColor: CustomColors.GRAY_DARK}}
                                    style={{backgroundColor: 'white', elevation: 0}}
                                    labelStyle={{
                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                        color: CustomColors.GRAY_DARK,
                                    }}
                                />
                            );
                        }}
                        onIndexChange={index => {
                            setNavigationState({...navigationState, index: index});
                        }}
                        renderPager={props => <PagerPan {...props} />}
                        initialLayout={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height - 64 - 50,
                        }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default CustomerBookingPage;

const styles = StyleSheet.create({});
