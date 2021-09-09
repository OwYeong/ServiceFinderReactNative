import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import {CustomColors, CustomTypography} from '@styles';
import {Field, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import LoadingModal from './LoadingModal';

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
            return true;
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

    const [initialFormValue, setInitialFormValue] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Creating account...',
    });

    const renderStepIndicator = ({position, stepStatus}) => {
        return stepIndicatorList[position].icon(position, stepStatus);
    };

    useEffect(() => {}, []);

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
                        <View style={styles.contentContainer}>
                            <Formik
                                initialValues={initialFormValue}
                                validationSchema={registerValidationSchema}
                                onSubmit={(values, settings) => {}}>
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
                                                placeholder="Your password"></Field>
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
                                        </>
                                    );
                                }}
                            </Formik>
                        </View>
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

export default SetupBusinessProfileStepper;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.PRIMARY_BLUE,
    },
    headerContainer: {
        width: '100%',
        backgroundColor: CustomColors.PRIMARY_BLUE,
        padding: 24,
    },
    contentContainer: {
        flex:1,
        backgroundColor: CustomColors.WHITE,
        borderTopRightRadius:16,
        borderTopLeftRadius: 16,
        padding: 20
    },
    headerTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.WHITE,
        textAlign: 'center',
        marginBottom: 20,
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
    },
});
