import React from 'react';
import {Animated, Keyboard, StyleSheet, Text, View, Platform, UIManager, LayoutAnimation} from 'react-native';
import {Button} from 'react-native-paper';
import PhoneVerificationIllustration from '@assets/images/phone-verification-illustration';
import * as Animatable from 'react-native-animatable';
import {CustomColors, CustomTypography} from '@styles';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import {useRef, useEffect} from 'react';
import {useState} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';

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
    const [countryCode, setCountryCode] = useState('MY');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showIllustration, setShowIllustration] = useState(true);
    const [phoneNumInputted, setPhoneNumInputted] = useState('')
    const [uiState, setUiState] = useState('promptUserInput');
    const selectCountry = country => {
        phoneInput.current.selectCountry(country.cca2.toLowerCase());
        setCountryCode(country.cca2);
    };

    const onPressFlag = () => {
        console.log('presss flag');
        setShowCountryPicker(true);
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setShowIllustration(false); // Update the keyboard state
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setShowIllustration(true); // Update the keyboard state
        });

        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
        return () => {
            // clean up
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <View style={styles.bigContainer}>
            {showIllustration ? (
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
            ) : null}
            <Text style={styles.title}>Verify Your Phone Number.</Text>

            {uiState == 'promptUserInput' ? (
                <>
                    <Text style={styles.desc}>
                        One last step, verify your phone number and book service now. This will ensure that service
                        provider could contact you.
                    </Text>
                    <View
                        style={{
                            marginTop: 12,
                            backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                            borderRadius: 10,
                        }}>
                        {/* <View
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'white',
                        opacity: 0.5,
                        zIndex: 20,
                    }}></View> */}
                        <PhoneInput
                            style={{width: '100%', paddingHorizontal: 16}}
                            ref={phoneInput}
                            textStyle={{
                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                height: 50,
                                color: CustomColors.GRAY_DARK,
                            }}
                            initialCountry="my"
                            textProps={{placeholder: 'Enter Your Phone Number'}}
                            onPressFlag={onPressFlag}
                            countriesList={require('@assets/allowedCountries.json')}
                        />

                        <CountryPicker
                            visible={showCountryPicker}
                            onSelect={value => selectCountry(value)}
                            onClose={() => {
                                setShowCountryPicker(false);
                            }}
                            translation="eng"
                            withModal={true}
                            withFilter
                            withFlagButton={false}
                            withCountryNameButton
                            withAlphaFilter
                            withCallingCode
                            countryCode={countryCode}
                            countryCodes={['MY', 'SG', 'TH', 'VN', 'US', 'UK', 'IN', 'ID']}>
                            <View></View>
                        </CountryPicker>
                    </View>
                    <Button
                        style={styles.button}
                        mode="contained"
                        contentStyle={{height: 50}}
                        dark
                        color={CustomColors.PRIMARY_BLUE}
                        onPress={() => {
                            console.log(phoneInput.current.setValue('haha'));
                            
                            setPhoneNumInputted(phoneInput.current.getValue())
                            setUiState('pendingOTP');
                        }}>
                        Verify
                    </Button>
                </>
            ) : null}

            {uiState == 'pendingOTP' ? (
                <>
                    <Text style={styles.desc}>We will send you a One Time Password to <Text style={{fontFamily: CustomTypography.FONT_FAMILY_MEDIUM}}>{phoneNumInputted}</Text>.<Text style={{fontFamily: CustomTypography.FONT_FAMILY_REGULAR, color: CustomColors.SECONDARY_BLUE_PURPLE}}> Not this number?</Text></Text>
                    <OTPInputView
                        style={{width: 300, height: 100}}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        pinCount={4}></OTPInputView>
                    <Text style={styles.otpResend}>
                        Didn't receive the OTP ?
                        <Text
                            style={{
                                color: CustomColors.PRIMARY_BLUE_SATURATED,
                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                            }}>
                            {' '}
                            RESEND OTP
                        </Text>
                    </Text>
                    <Button
                        style={styles.button}
                        mode="contained"
                        contentStyle={{height: 50}}
                        dark
                        color={CustomColors.PRIMARY_BLUE}
                        onPress={() => {
                            console.log(phoneInput.current.setValue('haha'));
                            setUiState('pendingOTP');
                        }}>
                        Submit
                    </Button>
                </>
            ) : null}
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
    button: {
        marginTop: 24,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
    },
    underlineStyleBase: {
        width: 60,
        height: 60,
        borderWidth: 0,
        borderBottomWidth: 2,
        borderRadius: 0,
        color: CustomColors.GRAY_DARK,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_16
    },

    underlineStyleHighLighted: {
        borderColor: CustomColors.PRIMARY_BLUE,
    },
    otpResend: {
        color: CustomColors.GRAY,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        marginTop: 8,
    },
});
