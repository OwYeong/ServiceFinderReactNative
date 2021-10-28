import {useNavigation} from '@react-navigation/core';
import {CustomColors, CustomTypography} from '@styles';
import React, {useEffect, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View, Platform, UIManager, LayoutAnimation} from 'react-native';
import {IconButton, Dialog, Button, Portal, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import WheelPicker, {CommonPicker, DateRangePicker, DatePicker, RegionPicker} from '@yz1311/react-native-wheel-picker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import ProviderService from '@services/ProviderService';
import {Calendar} from 'react-native-calendars';
import firebase from '@react-native-firebase/app';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ManageSchedule = () => {
    const navigation = useNavigation();
    const [minutesAvailable, setMinutesAvailable] = useState(['00', '30']);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [markedDatesForOffDay, setMarkedDatesForOffDay] = useState({});

    console.log(new Date());

    const providerInfo = useSelector(state => state.loginState.providerInfo);

    const [showStartHourTimePicker, setShowStartHourTimePicker] = useState(false);
    const [selectedStartHour, setSelectedStartHour] = useState({
        selectedHour: [
            moment(providerInfo?.workingHours?.startHour || '1', ['HH']).format('hh'),
            moment(providerInfo?.workingHours?.startHour || '1', ['HH']).format('A'),
        ],
        error: null,
    });
    console.log(
        moment(providerInfo?.workingHours?.startHour || '1', ['HH']).format('hh'),
        moment(providerInfo?.workingHours?.startHour || '1', ['HH']).format('A'),
    );

    const [showEndHourTimePicker, setShowEndHourTimePicker] = useState(false);
    const [selectedEndHour, setSelectedEndHour] = useState({
        selectedHour: [
            moment(providerInfo?.workingHours?.endHour || '1', ['HH']).format('hh'),
            moment(providerInfo?.workingHours?.endHour || '1', ['HH']).format('A'),
        ],
        error: null,
    });

    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);

    useEffect(() => {
        updateMarkedDates();
    }, [providerInfo, selectedDate]);

    const updateMarkedDates = () => {
        let myMarkedDates = {
            [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
            },
        };

        providerInfo?.dateNotAvailable.forEach(offDay => {
            if (offDay in myMarkedDates) {
                myMarkedDates = {
                    ...myMarkedDates,
                    [offDay]: {
                        ...myMarkedDates[offDay],
                        marked: true,
                        dotColor: 'red',
                    },
                };
            } else {
                myMarkedDates = {
                    ...myMarkedDates,
                    [offDay]: {
                        marked: true,
                        dotColor: 'red',
                    },
                };
            }
        });

        setMarkedDatesForOffDay(myMarkedDates);
    };

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -16}}>
                                <IconButton
                                    icon="arrow-back"
                                    color={CustomColors.GRAY_DARK}
                                    size={CustomTypography.ICON_SMALL}
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                    }}>
                                    Manage Schedule Settings
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text
                                style={{
                                    marginTop: 24,
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    fontSize: CustomTypography.FONT_SIZE_14,
                                }}>
                                Manage Working Hours
                            </Text>
                            <View style={{width: '100%', flexDirection: 'row', marginTop: 16, alignItems: 'center'}}>
                                <TouchableRipple
                                    style={{
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        borderColor: CustomColors.GRAY,
                                        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                    }}
                                    onPress={() => {
                                        setShowStartHourTimePicker(true);
                                    }}>
                                    <View style={{padding: 32, paddingVertical: 8}}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                fontSize: CustomTypography.FONT_SIZE_14,
                                            }}>
                                            {moment(providerInfo?.workingHours?.startHour || '1', ['HH']).format('h A')}
                                        </Text>
                                    </View>
                                </TouchableRipple>
                                <Text
                                    style={{
                                        marginHorizontal: 16,
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_14,
                                    }}>
                                    to
                                </Text>
                                <TouchableRipple
                                    style={{
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        borderColor: CustomColors.GRAY,
                                        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                    }}
                                    onPress={() => {
                                        setShowEndHourTimePicker(true);
                                    }}>
                                    <View style={{padding: 32, paddingVertical: 8}}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                fontSize: CustomTypography.FONT_SIZE_14,
                                            }}>
                                            {moment(providerInfo?.workingHours?.endHour || '1', ['HH']).format('h A')}
                                        </Text>
                                    </View>
                                </TouchableRipple>
                            </View>
                            <Text
                                style={{
                                    marginTop: 24,
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    fontSize: CustomTypography.FONT_SIZE_14,
                                }}>
                                Manage Off-day
                            </Text>
                            <Text
                                style={{
                                    marginTop: 8,
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    fontSize: CustomTypography.FONT_SIZE_12,
                                }}>
                                Date marked red in the calendar below indicate an off-day
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                {providerInfo?.dateNotAvailable.indexOf(selectedDate) == -1 ? (
                                    <Button
                                        uppercase={false}
                                        mode="contained"
                                        dark
                                        color={CustomColors.PRIMARY_BLUE}
                                        style={{borderRadius: 8, marginTop: 12}}
                                        onPress={async () => {
                                            try {
                                                await ProviderService.updateProviderData({
                                                    'dateNotAvailable': firebase.firestore.FieldValue.arrayUnion(selectedDate),
                                                });

                                                await ProviderService.fetchProviderDataToRedux();

                                                showMessage({
                                                    message: 'Successfully marked as off-day',
                                                    type: 'info',
                                                    position: 'center',
                                                    titleStyle: {marginTop: 5},
                                                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                    color: 'white', // text color
                                                    hideOnPress: true,
                                                    autoHide: true,
                                                    duration: 1000,
                                                });
                                            } catch (error) {
                                                console.log(error);
                                                showMessage({
                                                    message: 'Some error occured when marking off-day.',
                                                    type: 'info',
                                                    position: 'center',
                                                    titleStyle: {marginTop: 5},
                                                    style:{height:80},
                                                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                    color: 'white', // text color
                                                    hideOnPress: true,
                                                    autoHide: true,
                                                    duration: 1000,
                                                });
                                            }
                                        }}>
                                        Mark {selectedDate} as Off-Day
                                    </Button>
                                ) : (
                                    <Button
                                        uppercase={false}
                                        mode="contained"
                                        dark
                                        color={CustomColors.ALERT}
                                        style={{borderRadius: 8, marginTop: 12}}
                                        onPress={async () => {
                                            try {
                                                await ProviderService.updateProviderData({
                                                    'dateNotAvailable': firebase.firestore.FieldValue.arrayRemove(selectedDate),
                                                });

                                                await ProviderService.fetchProviderDataToRedux();

                                                showMessage({
                                                    message: 'Successfully unmarked the off-day',
                                                    type: 'info',
                                                    position: 'center',
                                                    titleStyle: {marginTop: 5},
                                                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                    color: 'white', // text color
                                                    hideOnPress: true,
                                                    autoHide: true,
                                                    duration: 1000,
                                                });
                                            } catch (error) {
                                                showMessage({
                                                    message: 'Some error occured when unmarking off-day.',
                                                    type: 'info',
                                                    position: 'center',
                                                    titleStyle: {marginTop: 5},
                                                    style:{height:80},
                                                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                    color: 'white', // text color
                                                    hideOnPress: true,
                                                    autoHide: true,
                                                    duration: 1000,
                                                });
                                                console.log(error);
                                            }
                                        }}>
                                        Unmark {selectedDate} as Off-Day
                                    </Button>
                                )}
                            </View>
                            <Calendar
                                date={selectedDate}
                                onDayPress={day => setSelectedDate(day.dateString)}
                                minDate={moment().format('YYYY-MM-DD')}
                                maxDate={moment().add(1,'month').format('YYYY-MM-DD')}
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
                                markedDates={markedDatesForOffDay}
                            />
                        </View>
                    </View>
                    {/* {showStartHourTimePicker && (
                        <DateTimePicker
                            testID="timePicker1"
                            value={selectedDateTime}
                            mode={'time'}
                            is24Hour={false}
                            minuteInterval={30}
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                const currentTime = selectedDate || selectedDateTime;
                                setShowTimePicker(Platform.OS === 'ios');
                                setSelectedDateTime(currentTime);
                            }}
                        />
                    )}
                    {showEndHourTimePicker && (
                        <DateTimePicker
                            testID="timePicker2"
                            value={selectedDateTime}
                            mode={'time'}
                            is24Hour={false}
                            minuteInterval={30}
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                const currentTime = selectedDate || selectedDateTime;
                                setShowTimePicker(Platform.OS === 'ios');
                                setSelectedDateTime(currentTime);
                            }}
                        />
                    )} */}
                    <Portal>
                        <Dialog
                            dismissable={false}
                            visible={showStartHourTimePicker}
                            onDismiss={() => {
                                setShowStartHourTimePicker({isVisible: false});
                            }}>
                            <Dialog.Title>Set Business Start Hour</Dialog.Title>
                            <Dialog.Content>
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_14,
                                    }}>
                                    Please select your business start hours
                                </Text>
                                <CommonPicker
                                    style={{marginTop: 12, elevation: 0}}
                                    showHeader={false}
                                    pickerConfirmBtnText={'Confirm'}
                                    pickerCancelBtnText={'Cancel'}
                                    pickerData={[
                                        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                                        ['AM', 'PM'],
                                    ]}
                                    pickerElevation={0}
                                    selectedValue={selectedStartHour.selectedHour}
                                    onValueChange={value => {
                                        console.log(value);
                                        setSelectedStartHour({
                                            ...selectedStartHour,
                                            selectedHour: value,
                                        });
                                    }}
                                />
                                {!!selectedStartHour.error ? (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                fontSize: CustomTypography.FONT_SIZE_14,
                                                padding: 16,
                                                borderRadius: 12,
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                            }}>
                                            {selectedStartHour.error}
                                        </Text>
                                    </View>
                                ) : null}
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button
                                    style={{width: 80}}
                                    color={CustomColors.GRAY}
                                    onPress={() => {
                                        setShowStartHourTimePicker(false);
                                    }}>
                                    No
                                </Button>
                                <Button
                                    style={{width: 100}}
                                    onPress={async () => {
                                        try {
                                            console.log(selectedStartHour);
                                            const selectedStartHourIn24h = moment(
                                                `${selectedStartHour.selectedHour[0]} ${selectedStartHour.selectedHour[1]}`,
                                                ['h A'],
                                            ).format('HH');

                                            if (selectedStartHourIn24h == providerInfo?.workingHours?.endHour) {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                setSelectedStartHour({
                                                    ...selectedStartHour,
                                                    error: 'Start Hour cannot be the \nsame as end hours.',
                                                });

                                                setTimeout(() => {
                                                    LayoutAnimation.configureNext(
                                                        LayoutAnimation.Presets.easeInEaseOut,
                                                    );
                                                    setSelectedStartHour({
                                                        ...selectedStartHour,
                                                        error: null,
                                                    });
                                                }, 2000);
                                                return;
                                            }
                                            await ProviderService.updateProviderData({
                                                'workingHours.startHour': parseFloat(selectedStartHourIn24h),
                                            });

                                            await ProviderService.fetchProviderDataToRedux();

                                            setShowStartHourTimePicker(false);
                                            console.log(
                                                moment(`${selectedStartHour[0]} ${selectedStartHour[1]}`, [
                                                    'h A',
                                                ]).format('HH'),
                                            );
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}>
                                    Confirm
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog
                            dismissable={false}
                            visible={showEndHourTimePicker}
                            onDismiss={() => {
                                setShowEndHourTimePicker({isVisible: false});
                            }}>
                            <Dialog.Title>Set Business End Hour</Dialog.Title>
                            <Dialog.Content>
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_14,
                                    }}>
                                    Please select your business End hours
                                </Text>
                                <CommonPicker
                                    style={{marginTop: 12, elevation: 0}}
                                    showHeader={false}
                                    pickerConfirmBtnText={'Confirm'}
                                    pickerCancelBtnText={'Cancel'}
                                    pickerData={[
                                        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                                        ['AM', 'PM'],
                                    ]}
                                    pickerElevation={0}
                                    selectedValue={selectedEndHour.selectedHour}
                                    onValueChange={value => {
                                        console.log(value);
                                        setSelectedEndHour({
                                            ...selectedEndHour,
                                            selectedHour: value,
                                        });
                                    }}
                                />
                                {!!selectedEndHour.error ? (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                fontSize: CustomTypography.FONT_SIZE_14,
                                                padding: 16,
                                                borderRadius: 12,
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                            }}>
                                            {selectedEndHour.error}
                                        </Text>
                                    </View>
                                ) : null}
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button
                                    style={{width: 80}}
                                    color={CustomColors.GRAY}
                                    onPress={() => {
                                        setShowEndHourTimePicker(false);
                                    }}>
                                    No
                                </Button>
                                <Button
                                    style={{width: 100}}
                                    onPress={async () => {
                                        try {
                                            console.log(selecteEndHourIn24h);
                                            const selecteEndHourIn24h = moment(
                                                `${selectedEndHour.selectedHour[0]} ${selectedEndHour.selectedHour[1]}`,
                                                ['h A'],
                                            ).format('HH');

                                            if (selecteEndHourIn24h == providerInfo?.workingHours?.endHour) {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                setSelectedEndHour({
                                                    ...selectedEndHour,
                                                    error: 'Start Hour cannot be the \nsame as end hours.',
                                                });

                                                setTimeout(() => {
                                                    LayoutAnimation.configureNext(
                                                        LayoutAnimation.Presets.easeInEaseOut,
                                                    );
                                                    setSelectedEndHour({
                                                        ...selectedEndHour,
                                                        error: null,
                                                    });
                                                }, 2000);
                                                return;
                                            }
                                            await ProviderService.updateProviderData({
                                                'workingHours.endHour': parseFloat(selecteEndHourIn24h),
                                            });

                                            await ProviderService.fetchProviderDataToRedux();

                                            setShowEndHourTimePicker(false);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}>
                                    Confirm
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ManageSchedule;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        padding: 16,
    },
});
