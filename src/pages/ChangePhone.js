import React, {useCallback} from 'react';
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
    StatusBar,
    ScrollView,
} from 'react-native';
import {Button, HelperText, IconButton} from 'react-native-paper';
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
import CustomModal from '@organisms/CustomModal';
import LoadingModal from '@organisms/LoadingModal';
import UserService from '@services/UserService';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {Constants} from '~constants';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/core';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProviderService from '@services/ProviderService';
import { showMessage } from 'react-native-flash-message';

const ChangePhone = () => {
    const navigation = useNavigation();

    const phoneInput = useRef(null);
    const otpAnimatable = useRef(null);
    const otpInputRef = useRef(null);
    const [countryCode, setCountryCode] = useState('MY');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [phoneNumInputted, setPhoneNumInputted] = useState('');
    const [uiState, setUiState] = useState('promptUserInput');
    const [verificationId, setVerificationId] = useState(null);
    const [otpInputted, setOtpInputted] = useState('');
    const [otpError, setOtpError] = useState({isError: false, errorMsg: ''});
    const [otpClear, setOtpClear] = useState(false);
    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: '',
    });
    const userInfo = useSelector(state => state.loginState.userInfo);

    useEffect(() => {
        phoneInput.current.setValue(userInfo.phoneNumber);
    }, []);
    const selectCountry = country => {
        phoneInput.current.selectCountry(country.cca2.toLowerCase());
        setCountryCode(country.cca2);
    };
    const [modal, setModal] = useState({
        isVisible: false,
        modalTitle: '',
        modalDesc: '',
        modalType: '',
        onDismiss: () => {},
    });

    const onPressFlag = () => {
        console.log('presss flag');
        setShowCountryPicker(true);
    };

    const resendOTPCode = () => {
        firebase
            .auth()
            .verifyPhoneNumber(phoneNumInputted)
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
                            setModal({
                                isVisible: true,
                                modalType: 'success',
                                modalTitle: 'OTP successfully resend !',
                                modalDesc: `We have resend the OTP code to ${phoneNumInputted}`,
                                onDismiss: () => {
                                    setModal({...modal, isVisible: false});
                                },
                            });
                            break;
                        case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                            if (phoneAuthSnapshot.error.code === 'auth/too-many-requests') {
                                setModal({
                                    isVisible: true,
                                    modalType: 'error',
                                    modalTitle: 'Phone verification failed !',
                                    modalDesc: `Too many request to this phone number ${phoneNumInputted}. Please try again later.`,
                                    onDismiss: () => {
                                        setModal({...modal, isVisible: false});
                                    },
                                });
                            } else {
                                setModal({
                                    isVisible: true,
                                    modalType: 'error',
                                    modalTitle: 'OTP resend failed !',
                                    modalDesc:
                                        'Unexpected error occur during OTP resend process. Please try again later.',
                                    onDismiss: () => {
                                        setModal({...modal, isVisible: false});
                                    },
                                });
                            }
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
                            if (phoneAuthSnapshot.error.code === 'auth/too-many-requests') {
                                setModal({
                                    isVisible: true,
                                    modalType: 'error',
                                    modalTitle: 'Phone verification failed !',
                                    modalDesc: `Too many request to this phone number ${phoneNum}. Please try again later.`,
                                    onDismiss: () => {
                                        setModal({...modal, isVisible: false});
                                    },
                                });
                            } else {
                                setModal({
                                    isVisible: true,
                                    modalType: 'error',
                                    modalTitle: 'OTP resend failed !',
                                    modalDesc:
                                        'Unexpected error occur during OTP resend process. Please try again later.',
                                    onDismiss: () => {
                                        setModal({...modal, isVisible: false});
                                    },
                                });
                            }
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
                    setLoadingModal({isVisible: false, modalTitle: ''});
                    // setUiState('verificationSuccess');

                    setVerificationId(null);

                    let promises = [];
                    promises.push(UserService.updatePhoneNumber(auth().currentUser.uid, phoneNumInputted));

                    if (userInfo.accType == Constants.ACCOUNT_TYPE.VENDOR) {
                        promises.push(ProviderService.updatePhoneNumber(auth().currentUser.uid, phoneNumInputted));
                    }

                    Promise.all(promises)
                        .then(async values => {
                            await UserService.fetchLoggedInUserDataToRedux();

                            if(userInfo?.accType == Constants.ACCOUNT_TYPE.VENDOR)
                                await ProviderService.fetchProviderDataToRedux();   

                            showMessage({
                                message: 'Phone number successfully changed.',
                                type: 'info',
                                position: 'center',
                                titleStyle: {marginTop: 5},
                                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                color: 'white', // text color
                                hideOnPress: true,
                                autoHide: true,
                                duration: 2000,
                            });
                            navigation.goBack();


                        })
                        .catch(error => {
                            console.log(error)
                        });
                    console.log('verificationSuccess');

                    return firebaseAuthWorker.signOut().catch(err => {});
                })
                .catch(error => {
                    // Verification Failed. Check error code.
                    setLoadingModal({isVisible: false, modalTitle: ''});
                    var errorMsg = '';
                    if (error.code === 'auth/invalid-verification-code') {
                        errorMsg = 'Sorry, that code was incorrect.';
                        setOtpError({isError: true, errorMsg: 'Sorry, the OTP code is incorrect. Please Try again'});
                        otpAnimatable.current.shake(500).then(() => {
                            setOtpError({
                                ...otpError,
                                isError: false,
                            });
                            setOtpInputted('');
                            setOtpClear(true);
                        });
                    } else if (error.code === 'auth/user-disabled') {
                        errorMsg = 'Sorry, this phone number has been blocked.';
                    } else if (error.code === 'auth/session-expired') {
                        errorMsg = 'session expired';
                        setOtpError({
                            isError: true,
                            errorMsg: 'Sorry, the OTP code has expired. Please resend the OTP.',
                        });
                        otpAnimatable.current.shake(500).then(() => {
                            setOtpError({
                                ...otpError,
                                isError: false,
                            });
                            setOtpInputted('');
                            setOtpClear(true);
                        });
                    } else if (error.code === 'auth/too-many-requests') {
                        errorMsg =
                            "Sorry, we couldn't verify that phone number at the moment. " +
                            'Please try again later. ' +
                            '\n\nIf the issue persists, please contact support.';
                        setModal({
                            isVisible: true,
                            modalType: 'error',
                            modalTitle: 'Phone verification failed !',
                            modalDesc: `Too many request to this phone number ${phoneNumInputted}. Please try again later.`,
                            onDismiss: () => {
                                setModal({...modal, isVisible: false});
                            },
                        });
                    } else {
                        // other internal error
                        // see https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html#sign-inwith-credential
                        errorMsg =
                            "Sorry, we couldn't verify that phone number at the moment. " +
                            'Please try again later. ' +
                            '\n\nIf the issue persists, please contact support.';
                        setModal({
                            isVisible: true,
                            modalType: 'error',
                            modalTitle: 'Phone verification failed !',
                            modalDesc: 'Unexpected error occur during phone verification. Please try again later.',
                            onDismiss: () => {
                                setModal({...modal, isVisible: false});
                            },
                        });
                    }

                    console.log(errorMsg);
                });
        } catch (err) {
            setLoadingModal({isVisible: false, modalTitle: ''});
            console.log(err);
        }
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View style={styles.bigContainer}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginLeft: -16,
                            }}>
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
                                Edit Phone Number
                            </Text>
                        </View>
                        {uiState == 'promptUserInput' ? (
                            <>
                                <View
                                    style={{
                                        marginTop: 12,
                                        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                        borderRadius: 10,
                                    }}>
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
                                        if (phoneInput.current.getValue() == userInfo.phoneNumber) {
                                            //Since phone number does not change, no verification is required.
                                            navigation.goBack();
                                            return;
                                        }
                                        sendOTPCode(phoneInput.current.getValue());
                                    }}>
                                    Verify and Change Phone Number
                                </Button>
                            </>
                        ) : null}

                        {uiState == 'pendingOTP' ? (
                            <>
                                <Text
                                    style={[
                                        styles.desc,
                                        {
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                        },
                                    ]}>
                                    We will send you a One Time Password to{' '}
                                    <Text style={{fontFamily: CustomTypography.FONT_FAMILY_MEDIUM}}>
                                        {phoneNumInputted}
                                    </Text>
                                    .{' '}
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setPhoneNumInputted('');
                                            setOtpError({isError: false, errorMsg: ''});
                                            setOtpInputted('');
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
                                <Animatable.View ref={otpAnimatable}>
                                    <OTPInputView
                                        ref={otpInputRef}
                                        code={otpInputted}
                                        onCodeChanged={code => {
                                            setOtpError({...otpError, errorMsg: ''});

                                            setOtpInputted(code);
                                            setOtpClear(false);
                                            if (code.length == 6) {
                                                console.log('Submitting OTP code ' + code);
                                                setLoadingModal({isVisible: true, modalTitle: 'Verifying otp...'});
                                                verifyOTPCode(code);
                                            }
                                        }}
                                        style={{width: '100%', height: 60, paddingHorizontal: 20}}
                                        codeInputFieldStyle={[
                                            styles.underlineStyleBase,
                                            {
                                                borderColor: otpError.isError ? 'red' : CustomColors.GRAY_LIGHT,
                                                color: otpError.isError ? 'red' : CustomColors.GRAY_DARK,
                                            },
                                        ]}
                                        clearInputs={otpClear}
                                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                        pinCount={6}></OTPInputView>
                                </Animatable.View>
                                <HelperText type="error" style={styles.errorText} visible={!!otpError.errorMsg}>
                                    {otpError.errorMsg}
                                </HelperText>

                                <Text style={styles.otpResend}>
                                    Didn't receive the OTP ?
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            resendOTPCode();
                                        }}>
                                        <Text
                                            style={{
                                                color: CustomColors.PRIMARY_BLUE_SATURATED,
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                            }}>
                                            {' '}
                                            RESEND OTP
                                        </Text>
                                    </TouchableWithoutFeedback>
                                </Text>
                                <Button
                                    style={styles.button}
                                    mode="contained"
                                    contentStyle={{height: 50}}
                                    dark
                                    color={CustomColors.PRIMARY_BLUE}
                                    onPress={() => {
                                        // console.log(phoneInput.current.setValue('haha'));
                                        setUiState('pendingOTP');
                                    }}>
                                    Submit
                                </Button>
                            </>
                        ) : null}

                        {uiState == 'verificationSuccess' ? (
                            <>
                                <Text style={styles.desc}>
                                    Cheers! You have successfully verify your phone number and you may start booking
                                    service with ServiceFinder now.
                                </Text>
                                <View style={{width: '100%', flex: 1, marginBottom: 48}}>
                                    <Button
                                        style={[styles.button, {position: 'absolute', bottom: 0, left: 0}]}
                                        mode="contained"
                                        contentStyle={{height: 50}}
                                        dark
                                        color={CustomColors.PRIMARY_BLUE}
                                        onPress={() => {
                                            UserService.updateIsFirstTime(auth().currentUser.uid, false)
                                                .then(data => {
                                                    UserService.fetchLoggedInUserDataToRedux();
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                });
                                        }}>
                                        Get Started
                                    </Button>
                                </View>
                            </>
                        ) : null}
                        <CustomModal
                            animationIn={'bounceIn'}
                            animationOut={'bounceOut'}
                            animationOutTiming={150}
                            isVisible={modal.isVisible}
                            modalType={modal.modalType}
                            modalTitle={modal.modalTitle}
                            modalDesc={modal.modalDesc}
                            buttonOnPressCallback={modal.onDismiss}
                            statusBarTranslucent={true}
                            useNativeDriver={true}></CustomModal>
                        <LoadingModal
                            animationIn={'bounceIn'}
                            animationOut={'bounceOut'}
                            animationOutTiming={150}
                            isVisible={loadingModal.isVisible}
                            modalTitle={loadingModal.modalTitle}
                            statusBarTranslucent={true}
                            useNativeDriver={true}></LoadingModal>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ChangePhone;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        flex: 1,
        padding: 16,
    },
    inputPrompt: {
        backgroundColor: 'white',
        marginTop: 8,
    },
    actionBtnContainer: {
        marginTop: 24,
    },
    actionBtn: {
        marginTop: 12,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
    },
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
        marginTop: 16,
    },
    errorText: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: 'red',
        margin: 0,
        marginTop: 8,
        padding: 0,
    },
});
