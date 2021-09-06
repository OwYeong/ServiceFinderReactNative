import React from 'react';
import {
    Animated,
    Keyboard,
    StyleSheet,
    Text,
    View,
    Platform,
    UIManager,
    LayoutAnimation,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import {Button} from 'react-native-paper';
import PhoneVerificationIllustration from '@assets/images/phone-verification-illustration';
import * as Animatable from 'react-native-animatable';
import {CustomColors, CustomTypography} from '@styles';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import {useRef, useEffect} from 'react';
import {useState} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import firebase from '@react-native-firebase/app';
import LottieView from 'lottie-react-native';
import Ripple from 'react-native-material-ripple';

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
    const [phoneNumInputted, setPhoneNumInputted] = useState('');
    const [uiState, setUiState] = useState('promptUserInput');
    const [verificationId, setVerificationId] = useState(null);
    const selectCountry = country => {
        phoneInput.current.selectCountry(country.cca2.toLowerCase());
        setCountryCode(country.cca2);
    };

    const onPressFlag = () => {
        console.log('presss flag');
        setShowCountryPicker(true);
    };

    const sendOTPCode = phoneNum => {
        firebase
            .auth()
            .verifyPhoneNumber(phoneNum)
            .on(
                'state_changed',
                phoneAuthSnapshot => {
                    switch (phoneAuthSnapshot.state) {
                        // ------------------------
                        //  IOS AND ANDROID EVENTS
                        // ------------------------
                        case firebase.auth.PhoneAuthState.CODE_SENT:
                            // OTP Code Successfully sent
                            console.log('OTP Successfully send');
                            setPhoneNumInputted(phoneNum);

                            setVerificationId(phoneAuthSnapshot.verificationId);
                            setUiState('pendingOTP');
                            break;
                        case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                            console.log('verification error');
                            console.log(phoneAuthSnapshot.error);
                            break;

                        // ---------------------
                        // ANDROID ONLY EVENTS
                        // ---------------------
                        case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                            console.log('auto verify on android timed out');
                            // proceed with your manual code input flow, same as you would do in
                            // CODE_SENT if you were on IOS
                            break;
                        case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                            // auto verified means the code has also been automatically confirmed as correct/received
                            // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                            console.log('auto verified on android');
                            console.log(phoneAuthSnapshot);
                            // Example usage if handling here and not in optionalCompleteCb:
                            // const { verificationId, code } = phoneAuthSnapshot;
                            // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

                            // Do something with your new credential, e.g.:
                            // firebase.auth().signInWithCredential(credential);
                            // firebase.auth().linkWithCredential(credential);
                            // etc ...
                            break;
                    }
                },
                error => {
                    // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
                    // the ERROR case in the above observer then there's no need to handle it here
                    console.log(error);
                    // verificationId is attached to error if required
                    console.log(error.verificationId);
                },
            )
            .then(phoneAuthSnapshot => {})
            .catch(error => {
                // Error return from Firebase. No OTP Code sent.
                console.log('PhoneVerification: Some Error Occured ' + JSON.stringify(error));
            });
    };

    const verifyOTPCode = async inputtedCode => {
        try {
            const phoneAuthCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, inputtedCode);

            const config = {
                name: 'AUTH_WORKER',
            };

            // We use a seperate firebase object (worker) to avoid the signIn method to affect our current app who user already sign in with email
            let firebaseAuthWorker = firebase.apps.find(app => app.name === 'AUTH_WORKER');
            if (!firebaseAuthWorker) {
                firebaseAuthWorker = await firebase.initializeApp({...firebase.app().options, databaseURL: ''}, config);
            }

            firebaseAuthWorker = firebaseAuthWorker.auth();

            firebaseAuthWorker
                .signInWithCredential(phoneAuthCredential)
                .then(userCredential => {
                    //Verification Success, OTP inputted is correct.
                    setUiState('verificationSuccess');
                    setVerificationId(null);

                    console.log('verificationSuccess');

                    return firebaseAuthWorker.signOut().catch(err => {});
                })
                .catch(error => {
                    // Verification Failed. Check error code.
                    var errorMsg = '';
                    if (error.code === 'auth/invalid-verification-code') {
                        errorMsg = 'Sorry, that code was incorrect.';
                    } else if (error.code === 'auth/user-disabled') {
                        errorMsg = 'Sorry, this phone number has been blocked.';
                    } else if (error.code === 'auth/session-expired') {
                        errorMsg = 'session expired';
                    } else {
                        // other internal error
                        // see https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html#sign-inwith-credential
                        errorMsg =
                            "Sorry, we couldn't verify that phone number at the moment. " +
                            'Please try again later. ' +
                            '\n\nIf the issue persists, please contact support.';
                        console.log(error);
                    }

                    console.log(errorMsg);
                });
        } catch (err) {
            console.log(err);
        }
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
            <Text style={styles.title}>
                {uiState == 'verificationSuccess' ? 'Verification Success' : 'Verify Your Phone Number'}
            </Text>

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
                            sendOTPCode(phoneInput.current.getValue());
                        }}>
                        Verify
                    </Button>
                </>
            ) : null}

            {uiState == 'pendingOTP' ? (
                <>
                    <Text
                        style={[
                            styles.desc,
                            {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center'},
                        ]}>
                        We will send you a One Time Password to{' '}
                        <Text style={{fontFamily: CustomTypography.FONT_FAMILY_MEDIUM}}>{phoneNumInputted}</Text>.{' '}
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setPhoneNumInputted('');
                                setUiState('promptUserInput');
                            }}>
                            <Text
                                style={{
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    color: CustomColors.SECONDARY_BLUE_PURPLE,
                                }}>
                                Not this number?
                            </Text>
                        </TouchableWithoutFeedback>
                    </Text>
                    <OTPInputView
                        style={{width: '100%', height: 60, paddingHorizontal: 20}}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={code => {
                            console.log(`Code is ${code}, you are good to go!`);
                            verifyOTPCode(code);
                        }}
                        pinCount={6}></OTPInputView>
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

            {uiState == 'verificationSuccess' ? (
                <>
                    <Text style={styles.desc}>
                        Cheers! You have successfully verify your phone number and you may start booking service with
                        ServiceFinder now.
                    </Text>
                    <View style={{width: '100%', flex: 1, marginBottom: 48}}>
                        <Button
                            style={[styles.button, {position: 'absolute', bottom: 0, left: 0}]}
                            mode="contained"
                            contentStyle={{height: 50}}
                            dark
                            color={CustomColors.PRIMARY_BLUE}
                            onPress={() => {
                                console.log(phoneInput.current.setValue('haha'));
                                setUiState('pendingOTP');
                            }}>
                            Get Started
                        </Button>
                    </View>
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
        flex: 1,
        height: 60,
        borderWidth: 0,
        borderBottomWidth: 2,
        borderRadius: 0,
        color: CustomColors.GRAY_DARK,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_16,
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
