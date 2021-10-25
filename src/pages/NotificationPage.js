import {CustomColors, CustomTypography} from '@styles';
import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StatusBar, StyleSheet, Text, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatService from '@services/ChatService';
import {TouchableRipple, Avatar} from 'react-native-paper';
import {Constants} from '~constants';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/core';

import NoNotificationIllustration from '@assets/images/no-notification-illustration';
import NotificationService from '@services/NotificationService';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector} from 'react-redux';
import ReviewService from '@services/ReviewService';

const NotificationPage = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const userInfo = useSelector(state => state.loginState.userInfo);

    useEffect(() => {
        const unsubcriber = NotificationService.getAllNotificationByUserId(data => {
            setNotifications(data);

            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        });

        return () => {
            unsubcriber();
        };
    }, []);

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
                            Notifications
                        </Text>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}}>
                        <View style={styles.bigContainer}>
                            {!isLoading ? (
                                notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <TouchableRipple
                                            style={{
                                                width: '100%',
                                                borderRadius: 12,
                                                backgroundColor: '#fcfeff',
                                                padding: 16,
                                                paddindVertical: 8,
                                                elevation: 3,
                                                marginTop: 16,
                                            }}
                                            key={notification.id}
                                            onPress={async () => {
                                                // navigation.navigate('Chatroom', {
                                                //     chatroomId: chatroom.id,
                                                // });
                                                switch (notification.action) {
                                                    case Constants.NOTIFICATION_ACTION.NO_ACTION:
                                                        break;
                                                    case Constants.NOTIFICATION_ACTION.NAVIGATE_TO_PENDING_REQUEST:
                                                        navigation.navigate('JobRequestConfirmation');
                                                        break;
                                                    case Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REQUEST:
                                                        if (userInfo?.accType == Constants.ACCOUNT_TYPE.CONSUMER) {
                                                            navigation.navigate('ViewRequest', {requestId: notification?.actionPayload?.requestId});

                                                        } else {
                                                            navigation.navigate('JobRequestControlDashboard', {
                                                                requestId: notification?.actionPayload?.requestId
                                                            });
                                                        }
                                                        break;
                                                    case Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REVIEW:
                                                        const isReviewAvailable = await ReviewService.getReviewByRequestId(notification?.actionPayload?.requestId);

                                                        console.log(isReviewAvailable)
                                                        if(isReviewAvailable) {
                                                            navigation.navigate('ViewRequest', {requestId: notification?.actionPayload?.requestId});
                                                        } else {
                                                            navigation.navigate('WriteReviewPage', {requestId: notification?.actionPayload?.requestId});
                                                        }
                                                        break;
                                                    default:
                                                }
                                            }}>
                                            <View
                                                style={{
                                                    width: '100%',
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: CustomTypography.FONT_SIZE_14,
                                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                        color: CustomColors.GRAY_MEDIUM,
                                                        marginTop: 8,
                                                    }}>
                                                    {notification.title}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        color: CustomColors.GRAY,
                                                        marginTop: 2,
                                                    }}>
                                                    {moment(new Date(notification.notificationDateTime)).format(
                                                        'MMM DD [at] hh:mm A',
                                                    )}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: CustomTypography.FONT_SIZE_12,
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        color: CustomColors.GRAY_MEDIUM,
                                                        marginTop: 12,
                                                    }}>
                                                    {notification.description}
                                                </Text>
                                            </View>
                                        </TouchableRipple>
                                    ))
                                ) : (
                                    <View
                                        style={{
                                            width: '100%',
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingBottom: 140,
                                        }}>
                                        <View style={{alignItems: 'center'}}>
                                            <View style={{width: 200, height: undefined, aspectRatio: 775 / 500}}>
                                                <NoNotificationIllustration fill={'#fff'} />
                                            </View>

                                            <Text
                                                style={{
                                                    fontSize: CustomTypography.FONT_SIZE_14,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    color: CustomColors.GRAY,
                                                    textAlign: 'center',
                                                    marginTop: 8,
                                                }}>
                                                You have no notification yet.
                                            </Text>
                                        </View>
                                    </View>
                                )
                            ) : (
                                <SkeletonPlaceholder>
                                    <View
                                        style={{
                                            width: '100%',
                                            height: 130,
                                            borderRadius: 12,
                                            marginTop: 16,
                                            overflow: 'hidden',
                                        }}></View>
                                    <View
                                        style={{
                                            width: '100%',
                                            height: 130,
                                            borderRadius: 12,
                                            marginTop: 16,
                                            overflow: 'hidden',
                                        }}></View>
                                    <View
                                        style={{
                                            width: '100%',
                                            height: 130,
                                            borderRadius: 12,
                                            marginTop: 16,
                                            overflow: 'hidden',
                                        }}></View>
                                </SkeletonPlaceholder>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default NotificationPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: CustomColors.WHITE,
    },
});
