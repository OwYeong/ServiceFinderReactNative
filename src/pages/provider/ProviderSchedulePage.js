import React, {useEffect, useState} from 'react';
import {Button, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Avatar, IconButton, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {ExpandableCalendar, Timeline, CalendarProvider} from 'react-native-calendars';
import XDate from 'xdate';
import {CustomColors, CustomTypography} from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RequestService from '@services/RequestService';
import {Constants} from '~constants';

import moment from 'moment';
import {useNavigation} from '@react-navigation/core';

const ProviderSchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
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
                    color: '#70cbff',
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
                        <View style={{flexDirection: 'row'}}>
                            <TouchableRipple
                                style={{borderRadius: 30, marginRight: 8}}
                                borderless
                                rippleColor="rgba(0, 0, 0, .32)"
                                onPress={() => {
                                    navigation.navigate('ManageSchedule');
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
                                    <AntDesign name="setting" color={CustomColors.GRAY_DARK} size={24} />
                                </View>
                            </TouchableRipple>
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
                    </View>
                    <CalendarProvider
                        date={currentDate}
                        onDateChanged={onDateChanged}
                        showTodayButton
                        todayBottomMargin={36}
                        disabledOpacity={0.6}>
                        <View
                            style={{
                                overflow: 'hidden',
                                paddingBottom: 2,
                                borderBottomWidth: 2,
                                borderColor: CustomColors.GRAY_EXTRA_LIGHT,
                                shadowColor: '#000',
                                shadowOffset: {width: 5, height: 5},
                                shadowOpacity: 12,
                                shadowRadius: 6,
                                elevation:0
                            }}>
                            <ExpandableCalendar
                                style={{
                                    overflow: 'visible',
                                }}
                                hideKnob
                                styles={{
                                    arrowImage: {tintColor: 'red'},
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
                            eventTapped={e => {
                                navigation.navigate('JobRequestControlDashboard', {
                                    requestId: e.requestId,
                                });
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
                                <View style={{width: 12, height: 12, backgroundColor: '#70cbff'}}></View>
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
