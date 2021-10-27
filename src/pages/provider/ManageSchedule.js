import {useNavigation} from '@react-navigation/core';
import {CustomColors, CustomTypography} from '@styles';
import React, {useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {WheelPicker} from 'react-native-wheel-picker-android';

const ManageSchedule = () => {
    const navigation = useNavigation();
    const providerInfo = useSelector(state => state.loginState.providerInfo);

    const [showStartHourTimePicker, setShowStartHourTimePicker] = useState(false);
    const [selectedStartHour, setSelectedStartHour] = useState(0);

    const [showEndHourTimePicker, setShowEndHourTimePicker] = useState(false);

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
                            <WheelPicker
                                selectedItem={selectedStartHour}
                                data={['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']}
                                onItemSelected={selectedItem => {
                                    console.log(selectedItem);
                                }}></WheelPicker>
                        </View>
                    </View>
                    {showStartHourTimePicker && (
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
                    )}
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
