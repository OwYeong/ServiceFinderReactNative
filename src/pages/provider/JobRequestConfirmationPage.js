import NewRequestDisplayComponent from '@organisms/NewRequestDisplayComponent';
import RequestHistoryDisplayComponent from '@organisms/RequestHistoryDisplayComponent';
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

const JobRequestConfirmationPage = () => {
    const navigation = useNavigation();

    const [navigationState, setNavigationState] = useState({
        index: 0,
        routes: [
            {key: 'newRequest', title: 'New Requests'},
            {key: 'history', title: 'History'},
        ],
    });

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
                        <IconButton
                            icon="arrow-back"
                            color={CustomColors.GRAY_DARK}
                            size={CustomTypography.ICON_SMALL}
                            style={styles.backIcon}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                        <Text
                            style={{
                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                fontSize: CustomTypography.FONT_SIZE_16,
                            }}>
                            Job Request Confirmation
                        </Text>
                    </View>
                    <TabView
                        style={{flex: 1}}
                        navigationState={navigationState}
                        renderScene={({route}) => {
                            switch (route.key) {
                                case 'newRequest':
                                    return <NewRequestDisplayComponent />;
                                case 'history':
                                    return <RequestHistoryDisplayComponent />;
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

export default JobRequestConfirmationPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
    },
    backIcon: {
        marginLeft: -8,
    },
});
