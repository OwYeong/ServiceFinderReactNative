import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import LoadingModal from '@organisms/LoadingModal';
import {useNavigation} from '@react-navigation/core';
import {Field, Formik} from 'formik';
import React, {useCallback, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View, Image} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import * as yup from 'yup';
import {CustomColors, CustomTypography} from '@styles';
import { showMessage } from 'react-native-flash-message';
import {debounce} from 'lodash';
import UserService from '@services/UserService';

const editProfileValidationSchema = yup.object().shape({
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
});

const EditAccountProfile = () => {
    const navigation = useNavigation();
    const userInfo = useSelector(state => state.loginState.userInfo);

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Creating account...',
    });

    const [initialFormValue, setInitialFormValue] = useState({
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
        email: auth()?.currentUser?.email || auth()?.currentUser?.providerData[0].email,
    });

    const updateProfile = (values) =>{
        const {firstName, lastName} = values;
        console.log(firstName, lastName)
        UserService.updateAccountInfo({
            firstName: firstName,
            lastName: lastName,
        }).then(async data=>{
            
            await UserService.fetchLoggedInUserDataToRedux();
            navigation.goBack();
        }).catch(err=>{
            console.log('error when updating profile')
            console.log(err)
            setLoadingModal({isVisible: false, modalTitle: 'updating account profile...'});
            showMessage({
                message: 'Error occured when updating profile.',
                type: 'info',
                position: 'center',
                titleStyle: {marginTop: 5},
                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                color: 'white', // text color
                hideOnPress: true,
                autoHide: true,
                duration: 1000,
            })
        })
    }

    const updateProfileCallback = useCallback(debounce(updateProfile, 1000), []);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
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
                                Edit Profile
                            </Text>
                        </View>
                        <Formik
                            initialValues={initialFormValue}
                            validationSchema={editProfileValidationSchema}
                            onSubmit={(values, settings) => {
                                setLoadingModal({isVisible: true, modalTitle: 'updating account profile...'});
                                // registerAccountCallback(values, settings);
                                updateProfileCallback(values)
                            }}>
                            {({handleSubmit, isValid, errors, resetForm, isSubmitting}) => {
                                return (
                                    <>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="First Name"
                                            name="firstName"
                                            placeholder="Your first name"></Field>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="Last Name"
                                            name="lastName"
                                            placeholder="Your last name"></Field>
                                        <Field
                                            disabled
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="Email"
                                            name="email"
                                            placeholder="Your email address"
                                            keyboardType="email-address"></Field>

                                        <View style={styles.actionBtnContainer}>
                                            <Button
                                                style={styles.actionBtn}
                                                mode="contained"
                                                disabled={isSubmitting}
                                                contentStyle={{height: 50}}
                                                color={CustomColors.PRIMARY_BLUE}
                                                dark
                                                onPress={() => {
                                                    Object.keys(errors).length > 0
                                                        ? showMessage({
                                                              message: 'Please ensure that inputs is valid.',
                                                              type: 'info',
                                                              position: 'center',
                                                              titleStyle: {marginTop: 5},
                                                              backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                              color: 'white', // text color
                                                              hideOnPress: true,
                                                              autoHide: true,
                                                              duration: 1000,
                                                          })
                                                        : handleSubmit();
                                                }}>
                                                Edit Account Profile
                                            </Button>
                                        </View>
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

export default EditAccountProfile;

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
});
