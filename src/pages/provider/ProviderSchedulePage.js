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
import { Constants } from '~constants';

import moment from 'moment';

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

        return () => {
            unsubcriber();
        };
    }, []);

    useEffect(()=>{
        console.log(allProviderRequest)
        setEvents(allProviderRequest.map(request=>{
            var event =  {
                requestId: request.id,
                start: moment(new Date(request.requestTimeSlot.start)).format('YYYY-MM-dd HH:mm:ss'),
                end: moment(new Date(request.requestTimeSlot.end)).format('YYYY-MM-dd HH:mm:ss'),
                title: 'Appointment With '+ request.customerInfo.firstName + ' ' + request.customerInfo.lastName,
                summary: request.requestLocation.addressFullName,
                color: CustomColors.GRAY_LIGHT,
            };

            if(request.serviceStatus == Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS){
                event = {
                    ...event,
                    color: CustomColors.PRIMARY_LIGHT_BLUE,
                }
            }

            if(request.serviceStatus == Constants.SERVICE_STATUS.SERVICE_COMPLETED){
                event = {
                    ...event,
                    color:  '#95F985',
                }
            }

            return event;


        }))

    },[allProviderRequest])

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.pageTitle}>Jobs Schedule</Text>
                        <IconButton
                            style={{
                                backgroundColor: CustomColors.GRAY_LIGHT,
                                borderRadius: 30,
                                margin: 0,
                                height: 60,
                                width: 60,
                                elevation: 1,
                            }}
                            icon="mail-outline"
                            color={CustomColors.GRAY_DARK}
                            size={24}
                            onPress={() => {
                                serviceProviderProfileActionSheet.current?.snapTo(1);
                            }}></IconButton>
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
                                markedDates={{
                                    '2021-09-06': {marked: true},
                                    '2021-09-07': {marked: true},
                                    '2021-09-08': {marked: true},
                                    '2021-09-10': {marked: true},
                                }}
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
