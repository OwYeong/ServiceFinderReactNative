import {CustomColors, CustomTypography} from '@styles';
import React, { useEffect } from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SetupBusinessProfileStepper = () => {
    const stepIndicatorList = [
        {
            label: 'Business\nProfile',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <FontAwesome5 name="user-tie" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <FontAwesome5
                        name="user-tie"
                        size={stepStatus == 'current' ? 24 : 20}
                        s
                        color={CustomColors.WHITE}
                    />
                ),
        },
        {
            label: 'Service\nLocation',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <Ionicons name="location-sharp" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <Ionicons
                        name="location-sharp"
                        size={stepStatus == 'current' ? 24 : 20}
                        color={CustomColors.WHITE}
                    />
                ),
        },
        {
            label: 'Additional\nInput',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <Ionicons name="document-text" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <Ionicons
                        name="document-text"
                        size={stepStatus == 'current' ? 24 : 20}
                        color={CustomColors.WHITE}
                    />
                ),
        },
    ];
    const stepIndicatorCustomStyles = {
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 45,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: CustomColors.WHITE,
        stepStrokeWidth: 2,
        separatorStrokeFinishedWidth: 3,
        stepStrokeFinishedColor: CustomColors.WHITE,
        stepStrokeUnFinishedColor: CustomColors.WHITE,
        separatorFinishedColor: CustomColors.WHITE,
        separatorUnFinishedColor: CustomColors.WHITE,
        stepIndicatorFinishedColor: CustomColors.WHITE,
        stepIndicatorUnFinishedColor: CustomColors.PRIMARY_BLUE,
        stepIndicatorCurrentColor: CustomColors.PRIMARY_BLUE,
        stepIndicatorLabelFontSize: 12,
        currentStepIndicatorLabelFontSize: 12,
        stepIndicatorLabelCurrentColor: CustomColors.WHITE,
        stepIndicatorLabelFinishedColor: CustomColors.PRIMARY_BLUE,
        stepIndicatorLabelUnFinishedColor: CustomColors.WHITE,
        labelColor: CustomColors.WHITE,
        labelSize: CustomTypography.FONT_SIZE_12,
        labelFontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        currentStepLabelColor: CustomColors.WHITE,
        stepIndicatorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'transparent', // change the color to "rgba(1,0,0,0)"
        },
    };

    const renderStepIndicator = ({position, stepStatus}) => {
        return stepIndicatorList[position].icon(position, stepStatus);
    };

    useEffect(() => {
    }, []);

    return (
        <View style={{backgroundColor: CustomColors.PRIMARY_BLUE}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Setup Your Business Profile</Text>
                            <StepIndicator
                                style={{marginTop: 10}}
                                renderStepIndicator={renderStepIndicator}
                                customStyles={stepIndicatorCustomStyles}
                                currentPosition={1}
                                stepCount={3}
                                labels={stepIndicatorList.map(e => e.label)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default SetupBusinessProfileStepper;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        width: '100%',
        backgroundColor: CustomColors.PRIMARY_BLUE,
        padding: 24,
    },
    headerTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.WHITE,
        textAlign: 'center',
        marginBottom: 20
    },
});
