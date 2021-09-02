import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import PhoneVerificationIllustration from '@assets/images/phone-verification-illustration';
import * as Animatable from 'react-native-animatable';
import {CustomColors, CustomTypography} from '@styles';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import {useRef} from 'react';
import {useState} from 'react';

const movingUpAndDown = {
    0: {
        translateY: 0,
        scale: 1,
    },
    0.25: {
        translateY: -10,
    },
    0.75: {
        translateY: 10,
        scale: 1,
    },
    1: {
        translateY: 0,
        scale: 1,
    },
};

const PhoneVerification = () => {
    const countryPicker = useRef(null);
    const phoneInput = useRef(null);
    const [cca2, setCca2] = useState('US');
    const [showCountryPicker, setShowCountryPicker] = useState(false)

    const selectCountry = country => {
        console.log('shyttt')
        phoneInput.current.selectCountry('ki');
        setCca2(country.cca2);
    };

    const onPressFlag = () => {
        setShowCountryPicker(true)
    };

    return (
        <View style={styles.bigContainer}>
            <View
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 350 / 2,
                    backgroundColor: '#d0f4fc',
                    overflow: 'hidden',
                    marginTop: 50,
                }}>
                <Animatable.View
                    animation={movingUpAndDown}
                    iterationCount={'infinite'}
                    easing={'linear'}
                    duration={5000}
                    useNativeDriver={true}>
                    <PhoneVerificationIllustration
                        style={{transform: [{scale: 1.15}]}}
                        width="100%"
                        height="100%"
                        fill="#ffffff"
                    />
                </Animatable.View>
            </View>
            <Text style={styles.title}>One Last Step.{'\n'} Verify Your Mobile number.</Text>
            <Text style={styles.desc}>
                With ServiceFinder, you could always find your desired services. ServiceFinder is an platform that
                offers all kind of services.
            </Text>
            <View style={{backgroundColor: 'red'}}>
                <PhoneInput style={{width:300}} ref={phoneInput} onPressFlag={onPressFlag} />
                <CountryPicker
                    visible={showCountryPicker}
                    onSelect={value => selectCountry(value)}
                    translation="eng"
                    withModal={true}
                    cca2={cca2}>
                        <Text>gaga</Text>
                </CountryPicker>
            </View>
        </View>
    );
};

export default PhoneVerification;

const styles = StyleSheet.create({
    bigContainer: {
        flex: 1,
        width: '100%',
        padding: 24,
        alignItems: 'center',
    },

    title: {
        marginTop: 24,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: 26,
        color: CustomColors.GRAY_DARK,
        textAlign: 'center',
    },
    desc: {
        marginTop: 12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_MEDIUM,
        textAlign: 'justify',
    },
});
