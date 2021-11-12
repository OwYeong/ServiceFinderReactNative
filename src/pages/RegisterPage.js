import Triangle from '@atoms/Triangle';
import {CustomColors, CustomTypography, CustomMixins} from '@styles';
import React, {Fragment, useState, useCallback} from 'react';
import {StyleSheet, Text, View, Alert, StatusBar, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {TextInput, Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Rect, Circle, Polygon} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import {FastField, Field, Formik} from 'formik';
import * as yup from 'yup';
import CustomModal from '@organisms/CustomModal';
import UserService from '@services/UserService';
import {CommonActions, useNavigation} from '@react-navigation/native';
import LoadingModal from '@organisms/LoadingModal';
import {debounce} from 'lodash';

const floatingShapes = {
    0: {
        translateX: 0,
        translateY: 0,
        rotation: 0,
        scale: 1,
    },
    0.2: {
        translateX: -10,
        translateY: 10,
        scale: 1.1,
    },
    0.4: {
        translateX: -10,
        translateY: -10,
    },
    0.5: {
        translateY: 0,
        translateX: 0,
        rotation: 180,
    },
    0.6: {},
    0.7: {
        translateX: -5,
        translateY: 10,
    },
    0.9: {
        translateX: -10,
        translateY: -10,
    },
    1: {
        translateY: 0,
        translateX: 0,
        rotation: 360,
        scale: 1,
    },
};

const registerValidationSchema = yup.object().shape({
    firstName: yup
        .string()
        .max(40)
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name. Numbers is not allowed')
        .required('First Name is required.'),
    lastName: yup
        .string()
        .max(40)
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name. Numbers is not allowed')
        .required('Last Name is required.'),
    email: yup
        .string()
        .max(80)
        .email('Please enter valid email address')
        .required('Email Address is required.')
        .test('Unique email', 'Email address already registered', value => {
            if (!value) {
                //If value is empty
                return true;
            }

            return new Promise((resolve, reject) => {
                UserService.isEmailAlreadyRegistered(value)
                    .then(isEmailAlreadyRegistered => {
                        const isUnique = !isEmailAlreadyRegistered;
                        // false to show error.

                        resolve(isUnique);
                    })
                    .catch(isEmailAlreadyRegistered => {
                        resolve(!isEmailAlreadyRegistered);
                    });
            });
        }),
    password: yup
        .string()
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .required('Password is required'),
});

const RegisterPage = () => {
    const navigation = useNavigation();
    const [isPasswordHide, setIsPasswordHide] = useState(true);
    const [modal, setModal] = useState({
        isVisible: false,
        modalTitle: '',
        modalDesc: '',
        modalType: '',
        onDismiss: () => {},
    });

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Creating account...',
    });

    const [initialFormValue, setInitialFormValue] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const registerAccount = values => {
        const {firstName, lastName, email, password} = values;


        UserService.customer.registerAccount(firstName, lastName, email, password)
            .then(msg => {
                setLoadingModal({isVisible: false, modalTitle: 'Creating account...'});
                setModal({
                    isVisible: true,
                    modalType: 'success',
                    modalTitle: 'Register Success !',
                    modalDesc: 'Your account is successfully registered. Please verify your email before logging in.',
                    onDismiss: () => {
                        navigation.goBack();
                    },
                });
            })
            .catch(error => {
                setLoadingModal({isVisible: false, modalTitle: ''});
                setModal({
                    isVisible: true,
                    modalType: 'error',
                    modalTitle: 'Register failed !',
                    modalDesc: 'Some Error occured when registering. Please try again later.',
                    onDismiss: () => {
                        setModal({...modal, isVisible: false});
                    },
                });
                console.log('Error occured when register.');
                console.log(error);
            });
    };

    const registerAccountCallback = useCallback(debounce(registerAccount, 1000), []);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={styles.topBarContainer}>
                            <IconButton
                                icon="arrow-back"
                                color={CustomColors.GRAY_DARK}
                                size={CustomTypography.ICON_SMALL}
                                style={styles.backIcon}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                        </View>
                        <View style={styles.registerTitleTextContainer}>
                            <View style={styles.shapeVectorContainer}>
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <Animatable.View
                                        animation={floatingShapes}
                                        duration={20000}
                                        delay={300}
                                        easing="linear"
                                        iterationCount="infinite"
                                        direction="normal">
                                        <Svg width="30" height="30" viewBox="0 0 50 50">
                                            <Rect
                                                x="5"
                                                y="5"
                                                width="40"
                                                height="40"
                                                fill="none"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                stroke={CustomColors.PRIMARY_BLUE}
                                                rx={5}
                                            />
                                        </Svg>
                                    </Animatable.View>
                                    <Animatable.View
                                        animation={floatingShapes}
                                        duration={15000}
                                        easing="linear"
                                        iterationCount="infinite"
                                        direction="normal">
                                        <Svg width="35" height="35" viewBox="0 0 50 50">
                                            <Polygon
                                                x="0"
                                                y="0"
                                                points="25,5 5,45 45,45"
                                                width="40"
                                                height="40"
                                                fill="none"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                stroke={CustomColors.PRIMARY_BLUE}
                                                rx={5}
                                            />
                                        </Svg>
                                    </Animatable.View>
                                </View>
                                <Animatable.View
                                    animation={floatingShapes}
                                    duration={18000}
                                    easing="linear"
                                    iterationCount="infinite"
                                    direction="reverse">
                                    <Svg height="30" width="30" viewBox="0 0 50 50">
                                        <Circle
                                            r="23"
                                            cx="25"
                                            cy="25"
                                            fill="none"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            stroke={CustomColors.PRIMARY_BLUE}
                                        />
                                    </Svg>
                                </Animatable.View>
                            </View>

                            <Text style={styles.registerTitleText}>Sign up and{'\n'}purchase services now.</Text>
                        </View>
                        <Formik
                            initialValues={initialFormValue}
                            validationSchema={registerValidationSchema}
                            onSubmit={(values, settings) => {
                                setLoadingModal({isVisible: true, modalTitle: 'Creating account...'});
                                registerAccountCallback(values, settings);
                            }}>
                            {({handleSubmit, isValid, errors, resetForm, isSubmitting}) => {
                                return (
                                    <>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="First Name"
                                            name="firstName"
                                            placeholder="Your first name"
                                            keyboardType="email-address"></Field>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="Last Name"
                                            name="lastName"
                                            placeholder="Your last name"></Field>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="Email"
                                            name="email"
                                            placeholder="Your email address"
                                            keyboardType="email-address"></Field>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="Password"
                                            name="password"
                                            secureTextEntry={isPasswordHide}
                                            placeholder="Your password"
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
                                        <View style={styles.registerBtnContainer}>
                                            <Button
                                                style={styles.registerBtn}
                                                mode="contained"
                                                disabled={isSubmitting}
                                                contentStyle={{height: 50}}
                                                color={CustomColors.PRIMARY_BLUE}
                                                dark
                                                onPress={() => {
                                                    Object.keys(errors).length > 0
                                                        ? setModal({
                                                              isVisible: true,
                                                              modalType: 'error',
                                                              modalTitle: 'Error !',
                                                              modalDesc: 'Please ensure all input are correct.',
                                                              onDismiss: () => {
                                                                  setModal({...modal, isVisible: false});
                                                              },
                                                          })
                                                        : handleSubmit();
                                                }}>
                                                SIGN UP
                                            </Button>
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
                                    </>
                                );
                            }}
                        </Formik>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default RegisterPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
        ...CustomMixins.padding(0, 16),
    },
    registerTitleText: {
        marginTop: 50,
        fontSize: CustomTypography.FONT_SIZE_30,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        color: CustomColors.GRAY_DARK,
    },
    circleBgTitleHighlight: {
        width: 100,
        height: '100%',
        borderRadius: 20,
        backgroundColor: CustomColors.PRIMARY_LIGHT_BLUE,
        position: 'absolute',
        top: 0,
        left: -50,
        zIndex: -1,
    },
    inputPrompt: {
        backgroundColor: 'white',
        marginTop: 8,
    },
    registerBtnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    registerBtn: {
        marginTop: 12,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
        ...CustomMixins.margin(24, 0),
    },
    topBarContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    backIcon: {
        marginLeft: -8,
    },
    shapeVectorContainer: {
        width: 120,
        position: 'absolute',
        top: 0,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
