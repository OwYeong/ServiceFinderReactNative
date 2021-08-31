import React, {Fragment, useState, useRef, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TextInput, TouchableRipple, Button, Menu, Divider} from 'react-native-paper';
import {CustomColors, CustomMixins, CustomTypography} from '@styles';

import LogoSvg from '@assets/images/logo.svg';
import GoogleSvg from '@assets/images/google-icon.svg';
import FacebookSvg from '@assets/images/fb-icon.svg';
import Ripple from 'react-native-material-ripple';

import HorizontalLineWithText from '@atoms/HorizontalLineWithText';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import UserService from '@services/UserService';

import CustomModal from '@organisms/CustomModal';
import {Field, Formik} from 'formik';
import * as yup from 'yup';
import {Constants} from '~constants';
import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import LoadingModal from '@organisms/LoadingModal';
import {debounce} from 'lodash';

const loginValidationSchema = yup.object().shape({
    email: yup.string().max(80).email('Please enter valid email address').required('Email Address is required.'),
    password: yup.string().required('Password is required'),
});

const LoginPage = () => {
    const navigation = useNavigation();
    const [isPasswordHide, setIsPasswordHide] = useState(true);
    const [isForgotPasswordClicked, setIsForgotPasswordClicked] = useState(false);
    const [isRegisterClicked, setIsRegisterClicked] = useState(false);
    const [bigLogoAnimatedValue, setBigLogoAnimatedValue] = useState(new Animated.Value(1)); // 1 is small logo
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [isAdditionalMenuOpened, setIsAdditionalMenuOpened] = useState(true);
    const [modal, setModal] = useState({
        isVisible: false,
        modalTitle: '',
        modalDesc: '',
        modalType: '',
        onDismiss: () => {},
    });
    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: '',
    });

    const [initialFormValue, setInitialFormValue] = useState({
        email: '',
        password: '',
    });

    const smallLogoRef = useRef(null);

    const bigLogoHeight = bigLogoAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200], // <-- any value larger than your content's height
    });

    const bigLogoOpacity = bigLogoAnimatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1], // <-- any value larger than your content's height
    });

    const triggerSmallLogoUI = yesOrNo => {
        if (yesOrNo) {
            //Remove the BigLogo component in UI
            Animated.timing(bigLogoAnimatedValue, {
                toValue: 0,
                duration: 200, // animation duration
                easing: Easing.bezier(0.42, 0, 1, 1), // easing function
                useNativeDriver: false,
            }).start();

            // Show Small Logo
            smallLogoRef.current.fadeInLeftBig(200);
        } else {
            //Show the BigLogo component in UI
            Animated.timing(bigLogoAnimatedValue, {
                toValue: 1,
                duration: 200, // animation duration
                easing: Easing.bezier(0.42, 0, 1, 1), // easing function
                useNativeDriver: false,
            }).start();

            // hide Small Logo
            smallLogoRef.current.fadeOutLeftBig(200);
        }
    };

    const signInWithFacebook = () => {
        setLoadingModal({isVisible: true, modalTitle: 'Logging in...'});
        UserService.customer.signInWithFacebook()
            .then(result => {
            })
            .catch(error => {
                setModal({
                    isVisible: true,
                    modalType: 'error',
                    modalTitle: 'Login failed !',
                    modalDesc: error,
                    onDismiss: () => {
                        setModal({...modal, isVisible: false});
                    },
                });
            });
    };

    const signInWithGmail = async () => {
        setLoadingModal({isVisible: true, modalTitle: 'Logging in...'});
        UserService.customer.signInWithGmail()
            .then(result => {
            })
            .catch(error => {
                setModal({
                    isVisible: true,
                    modalType: 'error',
                    modalTitle: 'Login failed !',
                    modalDesc: error,
                    onDismiss: () => {
                        setModal({...modal, isVisible: false});
                    },
                });
            });
    };

    const signInWithEmail = (values, {setSubmitting}) => {
        setSubmitting(true);
        const {email, password} = values;

        UserService.customer.signInWithEmail(email, password)
            .then(async result => {
                setLoadingModal({isVisible: false, modalTitle: ''});
                setSubmitting(false);
            })
            .catch(error => {
                setLoadingModal({isVisible: false, modalTitle: ''});
                setModal({
                    isVisible: true,
                    modalType: 'error',
                    modalTitle: 'Login failed !',
                    modalDesc: error,
                    onDismiss: () => {
                        setModal({...modal, isVisible: false});
                    },
                });
                setSubmitting(false);
            });
    };

    const signInWithEmailCallback = useCallback(debounce(signInWithEmail, 1000), []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true); // Update the keyboard state
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false); // Update the keyboard state
        });

        return () => {
            // clean up
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        triggerSmallLogoUI(isKeyboardVisible);
    }, [isKeyboardVisible]);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={styles.moreOptionContainer}>
                            <Animatable.View ref={smallLogoRef} style={styles.smallLogo}>
                                <LogoSvg width={30} height={30} fill={CustomColors.PRIMARY_BLUE} />
                            </Animatable.View>

                            <View
                                style={{
                                    width: CustomTypography.ICON_MEDIUM,
                                    height: CustomTypography.ICON_MEDIUM,
                                    borderRadius: 50,
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                }}>
                                <Menu
                                    statusBarHeight={36}
                                    visible={isAdditionalMenuOpened}
                                    onDismiss={() => {
                                        setIsAdditionalMenuOpened(!isAdditionalMenuOpened);
                                    }}
                                    anchor={
                                        <TouchableRipple
                                            style={styles.moreOptionIcon}
                                            borderless={true}
                                            onPress={() => {
                                                setIsAdditionalMenuOpened(!isAdditionalMenuOpened);
                                            }}
                                            rippleColor="rgba(0, 0, 0, .32)">
                                            <Icon
                                                name="more-vert"
                                                size={CustomTypography.ICON_SMALL}
                                                color={CustomColors.GRAY_DARK}></Icon>
                                        </TouchableRipple>
                                    }>
                                    <Menu.Item
                                        titleStyle={{
                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                            fontSize: CustomTypography.FONT_SIZE_14,
                                            color: CustomColors.GRAY_DARK,
                                        }}
                                        onPress={() => {
                                            setIsAdditionalMenuOpened(false);
                                            navigation.navigate('ProviderLoginPage');
                                        }}
                                        title="Login as vendor"></Menu.Item>
                                </Menu>
                            </View>
                        </View>
                        <Animated.View
                            style={[
                                styles.logoContainer,
                                {
                                    opacity: bigLogoOpacity,
                                    height: bigLogoHeight,
                                },
                            ]}>
                            <LogoSvg width={96} height={96} fill={CustomColors.PRIMARY_BLUE} />
                        </Animated.View>
                        <View style={styles.loginPromptContainer}>
                            <Text style={styles.loginTitle}>Login to your account</Text>
                            <Formik
                                initialValues={initialFormValue}
                                validationSchema={loginValidationSchema}
                                onSubmit={(values, settings) => {
                                    setLoadingModal({isVisible: true, modalTitle: 'Logging in...'});
                                    signInWithEmailCallback(values, settings);
                                }}>
                                {({handleSubmit, isValid, errors, resetForm, isSubmitting}) => {
                                    return (
                                        <>
                                            <Field
                                                component={CustomFormikTextInput}
                                                style={styles.input}
                                                mode="outlined"
                                                label="Email"
                                                name="email"
                                                keyboardType="email-address"
                                                left={
                                                    <TextInput.Icon
                                                        rippleColor="rgba(0, 0, 0, .0)"
                                                        name="email"
                                                        color={CustomColors.PRIMARY_DARK_BLUE}
                                                    />
                                                }
                                                placeholder="Your Email address"></Field>
                                            <Field
                                                component={CustomFormikTextInput}
                                                style={styles.input}
                                                mode="outlined"
                                                label="Password"
                                                name="password"
                                                placeholder="Your Password"
                                                secureTextEntry={isPasswordHide}
                                                left={
                                                    <TextInput.Icon
                                                        rippleColor="rgba(0, 0, 0, .0)"
                                                        name="lock"
                                                        color={CustomColors.PRIMARY_DARK_BLUE}
                                                    />
                                                }
                                                right={
                                                    isPasswordHide ? (
                                                        <TextInput.Icon
                                                            name="visibility"
                                                            onPress={() => {
                                                                setIsPasswordHide(false);
                                                            }}
                                                        />
                                                    ) : (
                                                        <TextInput.Icon
                                                            name="visibility-off"
                                                            onPress={() => {
                                                                setIsPasswordHide(true);
                                                            }}
                                                        />
                                                    )
                                                }></Field>
                                            <Ripple
                                                style={styles.forgotPasswordLabelContainer}
                                                onPress={() => {
                                                    setIsForgotPasswordClicked(true);
                                                }}>
                                                <Text
                                                    style={[
                                                        styles.forgotPasswordLabel,
                                                        {
                                                            color: isForgotPasswordClicked
                                                                ? CustomColors.PRIMARY_BLUE
                                                                : CustomColors.PRIMARY_DARK_BLUE,
                                                            textDecorationLine: isForgotPasswordClicked
                                                                ? 'underline'
                                                                : 'none',
                                                        },
                                                    ]}>
                                                    Forgot password?
                                                </Text>
                                            </Ripple>
                                            <Button
                                                style={styles.loginBtn}
                                                contentStyle={{height: 50}}
                                                color={CustomColors.PRIMARY_BLUE}
                                                disabled={isSubmitting}
                                                dark
                                                mode="contained"
                                                onPress={() => {
                                                    Object.keys(errors).length > 0
                                                        ? setModal({
                                                              isVisible: true,
                                                              modalType: 'error',
                                                              modalTitle: 'Error !',
                                                              modalDesc: 'Please make sure all inputs are correct.',
                                                              onDismiss: () => {
                                                                  setModal({...modal, isVisible: false});
                                                              },
                                                          })
                                                        : handleSubmit();
                                                }}>
                                                Login
                                            </Button>
                                        </>
                                    );
                                }}
                            </Formik>

                            <HorizontalLineWithText textName="Or sign in with"></HorizontalLineWithText>

                            <View style={styles.additionalSignInOptionContainer}>
                                <Button
                                    style={styles.googleSignInBtn}
                                    mode="contained"
                                    dark={true}
                                    labelStyle={{
                                        color: CustomColors.GRAY_DARK,
                                        minWidth: 90,
                                    }}
                                    color={CustomColors.GRAY_EXTRA_LIGHT}
                                    contentStyle={{height: 48}}
                                    icon={({size, color}) => (
                                        <View style={{width: size, height: size}}>
                                            <GoogleSvg />
                                        </View>
                                    )}
                                    onPress={signInWithGmail}>
                                    Gmail
                                </Button>
                                <Button
                                    style={styles.googleSignInBtn}
                                    mode="contained"
                                    dark={true}
                                    labelStyle={{
                                        color: CustomColors.GRAY_DARK,
                                        minWidth: 90,
                                    }}
                                    color={CustomColors.GRAY_EXTRA_LIGHT}
                                    contentStyle={{height: 48}}
                                    icon={({size, color}) => (
                                        <View style={{width: size, height: size}}>
                                            <FacebookSvg fill="white" />
                                        </View>
                                    )}
                                    onPress={signInWithFacebook}>
                                    Facebook
                                </Button>
                            </View>
                            <View style={styles.spaceReservedForRegisterInfo}>
                                <View style={styles.registerInfoContainer}>
                                    <Text style={[styles.registerLabel, {color: CustomColors.GRAY_DARK}]}>
                                        No account yet?{' '}
                                    </Text>
                                    <Ripple
                                        onPress={() => {
                                            setIsRegisterClicked(true);
                                            navigation.navigate('RegisterPage');
                                        }}>
                                        <Text
                                            style={[
                                                styles.registerLabel,
                                                {
                                                    textDecorationLine: isRegisterClicked ? 'underline' : 'none',
                                                },
                                            ]}>
                                            Register Now
                                        </Text>
                                    </Ripple>
                                </View>
                            </View>
                        </View>
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

export default LoginPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
        ...CustomMixins.padding(0, 16),
    },
    moreOptionContainer: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'visible',
    },
    smallLogo: {
        width: CustomTypography.ICON_MEDIUM,
        height: CustomTypography.ICON_MEDIUM,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
    moreOptionIcon: {
        width: CustomTypography.ICON_MEDIUM,
        height: CustomTypography.ICON_MEDIUM,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
    },
    loginPromptContainer: {
        width: '100%',
        flex: 1,
    },
    loginTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.PRIMARY_DARK_BLUE,
        marginBottom: 8,
    },
    input: {
        marginTop: 12,
    },
    forgotPasswordLabelContainer: {
        marginLeft: 2,
        marginTop: 8,
        width: 140,
    },
    forgotPasswordLabel: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_12,
    },
    loginBtn: {
        marginTop: 12,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
        ...CustomMixins.margin(24, 0),
    },
    googleSignInBtn: {
        flex: 1,
        margin: 8,
    },
    additionalSignInOptionContainer: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 16,
    },
    spaceReservedForRegisterInfo: {
        flex: 1,
        minHeight: 40,
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
    },
    registerInfoContainer: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: CustomColors.PRIMARY_DARK_BLUE,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        letterSpacing: 1.2,
        marginTop: 16,
        marginBottom: 16,
    },
    registerLabel: {
        color: CustomColors.PRIMARY_BLUE,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        letterSpacing: 1.2,
    },
});
