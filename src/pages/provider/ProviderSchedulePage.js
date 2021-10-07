import React, {useEffect, useState} from 'react';
import {Button, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Avatar, IconButton, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {ExpandableCalendar, Timeline, CalendarProvider} from 'react-native-calendars';
import XDate from 'xdate';
import {CustomColors, CustomTypography} from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RequestService from '@services/RequestService';
import {Constants} from '~constants';

import moment from 'moment';
import {useNavigation} from '@react-navigation/core';

const EVENTS = [
    {
        id: 'zzz',
        start: '2021-09-06 01:30:00',
        end: '2021-09-06 02:30:00',
        title: 'Dr. Mariana Joseph',
        summary: '3412 Piedmont Rd NE, GA 3032',
        color: '#e6add8',
    },
    {
        id: 'zzz',
        start: '2021-09-07 00:30:00',
        end: '2021-09-07 01:30:00',
        title: 'Visit Grand Mother',
        summary: 'Visit Grand Mother and bring some fruits.',
        color: CustomColors.GRAY_LIGHT,
    },
    {
        id: 'zzz',
        start: '2021-09-07 00:30:00',
        end: '2021-09-07 01:30:00',
        title: 'haha',
        summary: 'testing.',
        color: '#95F985',
    },
    {
        id: 'zzz',
        start: '2021-09-07 00:30:00',
        end: '2021-09-07 01:30:00',
        title: 'haha',
        summary: 'testing.',
        color: CustomColors.PRIMARY_LIGHT_BLUE,
    },
    {
        start: '2021-09-07 04:10:00',
        end: '2021-09-07 04:40:00',
        title: 'Tea Time with Dr. Hasan',
        summary: 'Tea Time with Dr. Hasan, Talk about Project',
    },
    {
        start: '2021-09-07 01:05:00',
        end: '2021-09-07 01:35:00',
        title: 'Dr. Mariana Joseph',
        summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
        start: '2021-09-07 14:30:00',
        end: '2021-09-07 16:30:00',
        title: 'Meeting Some Friends in ARMED',
        summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
        color: '#d8ade6',
    },
    {
        start: '2021-09-08 01:40:00',
        end: '2021-09-08 02:25:00',
        title: 'Meet Sir Khurram Iqbal',
        summary: 'Computer Science Dept. Comsats Islamabad',
        color: '#e6bcad',
    },
    {
        start: '2021-09-08 04:10:00',
        end: '2021-09-08 04:40:00',
        title: 'Tea Time with Colleagues',
        summary: 'WeRplay',
    },
    {
        start: '2021-09-08 00:45:00',
        end: '2021-09-08 01:45:00',
        title: 'Lets Play Apex Legends',
        summary: 'with Boys at Work',
    },
    {
        start: '2021-09-08 11:30:00',
        end: '2021-09-08 12:30:00',
        title: 'Dr. Mariana Joseph',
        summary: '3412 Piedmont Rd NE, GA 3032',
    },
    {
        start: '2021-09-10 12:10:00',
        end: '2021-09-10 13:45:00',
        title: 'Merge Request to React Native Calendars',
        summary: 'Merge Timeline Calendar to React Native Calendars',
    },
];

const ProviderSchedulePage = () => {
    const [currentDate, setCurrentDate] = useState('2021-09-07');
    const [allProviderRequest, setAllProviderRequest] = useState([]);
    const [events, setEvents] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const navigation = useNavigation();
    const [pendingRequests, setPendingRequests] = useState([]);

    const onDateChanged = date => {
        // console.warn('TimelineCalendarScreen onDateChanged: ', date, updateSource);
        // fetch and set data for date + week ahead
        setCurrentDate(date);
    };

    const sameDate = (a, b) => {
        return (
            a instanceof XDate &&
            b instanceof XDate &&
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );
    };

    useEffect(() => {
        var unsubcriber = RequestService.getAllRequestByProvider(setAllProviderRequest);
        const pendingRequestUnsubscriber = RequestService.getPendingRequestByProvider(setPendingRequests);

        return () => {
            unsubcriber();
            pendingRequestUnsubscriber();
        };
    }, []);

    useEffect(() => {
        var events = allProviderRequest.map(request => {
            var event = {
                requestId: request.id,
                start: moment(new Date(request.requestTimeSlot.start)).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(new Date(request.requestTimeSlot.end)).format('YYYY-MM-DD HH:mm:ss'),
                title: 'Appointment With ' + request.customerInfo.firstName + ' ' + request.customerInfo.lastName,
                summary: request.requestLocation.addressFullName,
                color: CustomColors.GRAY_LIGHT,
            };

            if (request.serviceStatus == Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS) {
                event = {
                    ...event,
                    color: CustomColors.PRIMARY_LIGHT_BLUE,
                };
            }

            if (request.serviceStatus == Constants.SERVICE_STATUS.SERVICE_COMPLETED) {
                event = {
                    ...event,
                    color: '#95F985',
                };
            }

            return event;
        });

        setEvents(events);

        var datesWithJob = allProviderRequest.map(request => {
            return moment(new Date(request.requestTimeSlot.start)).format('YYYY-MM-DD');
        });

        datesWithJob = [...new Set(datesWithJob)]; // Make sure unique in dates

        var markedDateObject = datesWithJob.reduce(
            (previous, current) => ({...previous, [current]: {marked: true}}),
            {},
        );

        setMarkedDates(markedDateObject);
    }, [allProviderRequest]);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.pageTitle}>Jobs Schedule</Text>
                        <TouchableRipple
                            style={{borderRadius: 30}}
                            borderless
                            rippleColor="rgba(0, 0, 0, .32)"
                            onPress={() => {
                                navigation.navigate('JobRequestConfirmation');
                            }}>
                            <View
                                style={{
                                    backgroundColor: CustomColors.GRAY_LIGHT,
                                    borderRadius: 30,
                                    margin: 0,
                                    height: 60,
                                    width: 60,
                                    elevation: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <MaterialIcons name="mail-outline" color={CustomColors.GRAY_DARK} size={24} />

                                {pendingRequests.length > 0 ? (
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 20,
                                            backgroundColor: 'rgba(255, 69, 56,1)',
                                            position: 'absolute',
                                            top: 9,
                                            right: 9,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: 10,
                                                color: CustomColors.WHITE,
                                                textAlign: 'center',
                                                marginTop: 2,
                                            }}>
                                            {pendingRequests.length > 9 ? '9+' : null}
                                            {pendingRequests.length <= 9 && pendingRequests.length > 0
                                                ? pendingRequests.length.toString()
                                                : null}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </TouchableRipple>
                    </View>
                    <CalendarProvider
                        date={currentDate}
                        onDateChanged={onDateChanged}
                        showTodayButton
                        todayBottomMargin={36}
                        disabledOpacity={0.6}>
                        <View style={{overflow: 'hidden', paddingBottom: 1.8}}>
                            <ExpandableCalendar
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: {width: 1, height: 1},
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    elevation: 3,
                                }}
                                styles={{
                                    arrowImage: {tintColor: 'black'},
                                }}
                                renderArrow={direction =>
                                    direction == 'right' ? (
                                        <MaterialIcons name="chevron-right" size={24} color={CustomColors.GRAY_DARK} />
                                    ) : (
                                        <MaterialIcons name="chevron-left" size={24} color={CustomColors.GRAY_DARK} />
                                    )
                                }
                                firstDay={1}
                                markedDates={markedDates}
                            />
                        </View>
                        <Timeline
                            format24h={false}
                            eventTapped={e => {
                                console.log(e);
                            }}
                            events={events.filter(event => sameDate(new XDate(event.start), new XDate(currentDate)))}
                            styles={{
                                eventTitle: {
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                },
                                event: {
                                    borderRadius: 12,
                                    padding: 8,
                                    borderColor: 'white',
                                },
                                eventSummary: {
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                },
                                eventTimes: {
                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                },
                            }}
                            // scrollToFirst={true}
                            // start={0}
                            // end={24}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                padding: 16,
                                borderRadius: 24,
                                backgroundColor: 'rgba(0,180,255,0.1)',
                                zIndex: 20,
                            }}
                            pointerEvents={'none'}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View
                                    style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                    }}></View>
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_12,
                                        color: CustomColors.GRAY,
                                        marginLeft: 8,
                                    }}>
                                    Jobs waiting to service
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View
                                    style={{width: 12, height: 12, backgroundColor: CustomColors.PRIMARY_BLUE}}></View>
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_12,
                                        color: CustomColors.GRAY,
                                        marginLeft: 8,
                                    }}>
                                    Jobs in progress
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{width: 12, height: 12, backgroundColor: '#95F985'}}></View>
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_12,
                                        color: CustomColors.GRAY,
                                        marginLeft: 8,
                                    }}>
                                    Jobs completed
                                </Text>
                            </View>
                        </View>
                    </CalendarProvider>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ProviderSchedulePage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        width: '100%',
        padding: 16,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pageTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_DARK,
    },
});
