import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import LoadingModal from '@organisms/LoadingModal';
import {useNavigation} from '@react-navigation/core';
import {Field, Formik} from 'formik';
import React, {useCallback, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View, Image} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import * as yup from 'yup';
import {CustomColors, CustomTypography} from '@styles';
import {showMessage} from 'react-native-flash-message';
import {debounce} from 'lodash';
import UserService from '@services/UserService';
import firebase from '@react-native-firebase/app';

const changePasswordValidationSchema = yup.object().shape({
    password: yup.string().min(8, 'Password must be 8 character length.').required('Password is required'),
    newPassword: yup.string().min(8, 'NewPassword must be 8 character length.').required('Password is required'),
});

const ChangePassword = () => {
    const navigation = useNavigation();

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Creating account...',
    });

    const [initialFormValue, setInitialFormValue] = useState({
        password: '',
        newPassword: '',
    });

    const [isPasswordHide, setIsPasswordHide] = useState(true);
    const [isNewPasswordHide, setIsNewPasswordHide] = useState(true);

    const reauthenticateUserWithPassword = currentPassword => {
        var currentUser = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
        return currentUser.reauthenticateWithCredential(credential);
    };

    const changePassword = values => {
        const {password, newPassword} = values;
        console.log(password, newPassword);
        reauthenticateUserWithPassword(password)
            .then(() => {
                var currentUser = firebase.auth().currentUser;
                currentUser.updatePassword(newPassword)
                    .then(() => {
                        console.log('Password updated!');
                        showMessage({
                            message: 'Password successfully updated.',
                            type: 'info',
                            position: 'center',
                            titleStyle: {marginTop: 5},
                            backgroundColor: 'rgba(0,0,0,0.6)', // background color
                            color: 'white', // text color
                            hideOnPress: true,
                            autoHide: true,
                            duration: 1000,
                        });
                        navigation.goBack();
                    })
                    .catch(error => {
                        console.log(error);
                        showMessage({
                            message: 'Some error occured when updating password',
                            type: 'info',
                            position: 'center',
                            titleStyle: {marginTop: 5},
                            backgroundColor: 'rgba(0,0,0,0.6)', // background color
                            color: 'white', // text color
                            hideOnPress: true,
                            autoHide: true,
                            duration: 1000,
                        });
                        setLoadingModal({isVisible: false, modalTitle: 'Updating password...'});
                    });
            })
            .catch(error => {
                console.log(error);
                showMessage({
                    message: 'Current password is wrong.',
                    type: 'info',
                    position: 'center',
                    titleStyle: {marginTop: 5},
                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                    color: 'white', // text color
                    hideOnPress: true,
                    autoHide: true,
                    duration: 1000,
                });
                setLoadingModal({isVisible: false, modalTitle: 'Updating password...'});
            });
    };

    const changePasswordCallback = useCallback(debounce(changePassword, 1000), []);

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
                                Change Password
                            </Text>
                        </View>
                        <Formik
                            initialValues={initialFormValue}
                            validationSchema={changePasswordValidationSchema}
                            onSubmit={(values, settings) => {
                                setLoadingModal({isVisible: true, modalTitle: 'Updating password...'});
                                // registerAccountCallback(values, settings);
                                changePasswordCallback(values);
                            }}>
                            {({handleSubmit, isValid, errors, resetForm, isSubmitting}) => {
                                return (
                                    <>
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="Current Password"
                                            name="password"
                                            secureTextEntry={isPasswordHide}
                                            placeholder="Current password"
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
                                        <Field
                                            component={CustomFormikTextInput}
                                            style={styles.inputPrompt}
                                            label="New Password"
                                            name="newPassword"
                                            secureTextEntry={isNewPasswordHide}
                                            placeholder="New password"
                                            right={
                                                isNewPasswordHide ? (
                                                    <TextInput.Icon
                                                        name="visibility"
                                                        onPress={() => {
                                                            setIsNewPasswordHide(false);
                                                        }}
                                                    />
                                                ) : (
                                                    <TextInput.Icon
                                                        name="visibility-off"
                                                        onPress={() => {
                                                            setIsNewPasswordHide(true);
                                                        }}
                                                    />
                                                )
                                            }></Field>
                                        <View style={styles.actionBtnContainer}>
                                            <Button
                                                style={styles.actionBtn}
                                                mode="contained"
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
                                                Change Password
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

export default ChangePassword;

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
