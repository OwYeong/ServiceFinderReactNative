import RequestService from '@services/RequestService';
import React, {useEffect, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Image} from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Dialog,
    HelperText,
    IconButton,
    Portal,
    RadioButton,
    Surface,
    TouchableRipple,
    TextInput,
} from 'react-native-paper';
import moment from 'moment';
import {CustomColors, CustomTypography} from '@styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Constants} from '~constants';
import {useNavigation} from '@react-navigation/core';
import CommonFunction from '@utils/CommonFunction';

const PendingRequestListing = () => {
    const navigation = useNavigation();
    const [requests, setRequests] = useState([]);

    const [googleMapRedirectDialog, setGoogleMapRedirectDialog] = useState({
        isVisible: false,
        redirectCoordinate: '',
    });

    const [customerFormInputDisplayDialog, setCustomerFormInputDisplayDialog] = useState({
        isVisible: false,
        customerFormResponse: [],
    });

    useEffect(() => {
        const unsubscriber = RequestService.getPendingRequestByCustomer(setRequests);

        return () => {
            unsubscriber();
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1, width: '100%', padding: 16, backgroundColor: CustomColors.GRAY_EXTRA_LIGHT}}>
                {requests.length > 0 ? (
                    requests.map(request => (
                        <TouchableWithoutFeedback
                            key={request.id}
                            onPress={() => {
                                navigation.navigate('ViewRequest', {requestId: request.id});
                            }}>
                            <Surface style={styles.requestContainer}>
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{width: 40, height: 40, borderRadius: 20, overflow: 'hidden'}}>
                                            {!!request?.serviceProvider?.businessLogoUrl ? (
                                                <Image
                                                    style={{width: '100%', height: '100%'}}
                                                    source={{
                                                        uri: request?.serviceProvider?.businessLogoUrl,
                                                    }}></Image>
                                            ) : (
                                                <Image
                                                    style={{width: '100%', height: '100%'}}
                                                    source={require('@assets/images/default-profileImage.png')}></Image>
                                            )}
                                        </View>
                                        <View style={{marginLeft: 16}}>
                                            <Text style={styles.customerName}>
                                                {request?.serviceProvider?.businessName}
                                            </Text>
                                            <Text style={styles.requestedDateTime}>
                                                {CommonFunction.getDisplayNameForServiceType(
                                                    request?.serviceProvider?.serviceType,
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setGoogleMapRedirectDialog({
                                                isVisible: true,
                                                redirectCoordinate: `${request.requestLocation.addressCoor.latitude},${request.requestLocation.addressCoor.longitude}`,
                                            });
                                        }}>
                                        <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                            <MaterialIcon name="location-on" size={30} color={CustomColors.GRAY} />
                                            <Text style={styles.requestedAddress}>
                                                {request.requestLocation.addressFullName}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                        <MaterialIcon name="date-range" size={30} color={CustomColors.GRAY} />
                                        <Text style={styles.requestedTimeSlot}>
                                            {moment(new Date(request.requestTimeSlot.start)).format(
                                                'YYYY-MM-DD hh:mm A',
                                            )}
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                        <AntDesignIcon name="form" size={30} color={CustomColors.GRAY} />
                                        <Button
                                            style={{marginLeft: 8}}
                                            labelStyle={{fontSize: CustomTypography.FONT_SIZE_12}}
                                            onPress={() => {
                                                setCustomerFormInputDisplayDialog({
                                                    isVisible: true,
                                                    customerFormResponse: request.customerFormResponse,
                                                });
                                            }}>
                                            View My Filled Form
                                        </Button>
                                    </View>
                                    <View
                                        style={{
                                            width: '100%',
                                            marginTop: 24,
                                            padding: 12,
                                            borderRadius: 10,
                                            backgroundColor: CustomColors.GRAY
                                            // request.requestStatus == Constants.REQUEST_STATUS.ACCEPTED
                                            //     ? CustomColors.SUCCESS
                                            //     : request.requestStatus == Constants.REQUEST_STATUS.REJECTED
                                            //     ? CustomColors.ALERT
                                            //     : CustomColors.WARNING,
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: CustomTypography.FONT_SIZE_12,
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                color: CustomColors.WHITE,
                                            }}>
                                            Pending Response From Service Provider
                                        </Text>
                                    </View>
                                </View>
                            </Surface>
                        </TouchableWithoutFeedback>
                    ))
                ) : (
                    <View
                        style={{
                            width: '100%',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingBottom: 140,
                        }}>
                        <View style={{alignItems: 'center'}}>
                            <MaterialIcon name="history" size={100} color={CustomColors.GRAY} />

                            <Text
                                style={{
                                    fontSize: CustomTypography.FONT_SIZE_16,
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    color: CustomColors.GRAY,
                                    textAlign: 'center',
                                    marginTop: 8,
                                }}>
                                You have no history yet.
                            </Text>
                        </View>
                    </View>
                )}
                <Portal>
                    <Dialog
                        visible={googleMapRedirectDialog.isVisible}
                        onDismiss={() => {
                            setGoogleMapRedirectDialog({isVisible: false});
                        }}>
                        <Dialog.Title>Redirect to Google Maps</Dialog.Title>
                        <Dialog.Content>
                            <Text>
                                Do you want to view the actual location at google map? you will be redirect to google
                                map app.
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                style={{width: 80}}
                                color={CustomColors.GRAY}
                                onPress={() => {
                                    setGoogleMapRedirectDialog({isVisible: false});
                                }}>
                                No
                            </Button>
                            <Button
                                style={{width: 80}}
                                onPress={() => {
                                    var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${googleMapRedirectDialog.redirectCoordinate}`;
                                    Linking.canOpenURL(url)
                                        .then(supported => {
                                            if (!supported) {
                                                console.log("Can't handle url: " + url);
                                            } else {
                                                return Linking.openURL(url);
                                            }
                                        })
                                        .catch(err => console.error('An error occurred', err));

                                    setGoogleMapRedirectDialog({isVisible: false});
                                }}>
                                Yes
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog
                        style={{backgroundColor: CustomColors.WHITE}}
                        visible={customerFormInputDisplayDialog.isVisible}
                        dismissable={false}
                        needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                        onDismiss={() => {
                            setCustomerFormInputDisplayDialog({...customerFormInputDisplayDialog, isVisible: false});
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                            }}>
                            <Text style={styles.dialogTitle}>Customer Form Response</Text>
                            <IconButton
                                icon="close"
                                size={24}
                                color={CustomColors.GRAY_DARK}
                                onPress={() => {
                                    setCustomerFormInputDisplayDialog({isVisible: false, customerFormResponse: []});
                                }}></IconButton>
                        </View>

                        <Dialog.ScrollArea style={{paddingHorizontal: 0, paddingVertical: 0}}>
                            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{flexGrow: 1}}>
                                <View style={{widht: '100%', flex: 1, paddingHorizontal: 16, paddingVertical: 24}}>
                                    {customerFormInputDisplayDialog.customerFormResponse.map(
                                        (currentQuestion, index) => (
                                            <View
                                                style={styles.questionSetupWrapper}
                                                needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                                                key={currentQuestion.id}>
                                                <Text style={[styles.inputTitle, {marginTop: 8, marginLeft: 8}]}>
                                                    {currentQuestion.questionName}
                                                </Text>
                                                {currentQuestion.questionType ==
                                                Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER ? (
                                                    <TextInput
                                                        disabled
                                                        mode="outlined"
                                                        label="Customer response"
                                                        multiline
                                                        placeholder="Your question"
                                                        style={[styles.inputPrompt]}
                                                        value={currentQuestion.response}></TextInput>
                                                ) : null}

                                                {currentQuestion.questionType ==
                                                Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER ? null : (
                                                    <View style={{marginTop: 16}}>
                                                        {currentQuestion.options.map((option, i) => (
                                                            <View
                                                                style={{flexDirection: 'row', alignItems: 'center'}}
                                                                key={option.optionId}>
                                                                {currentQuestion.questionType ==
                                                                Constants.QUESTIONNAIRE_TYPE.CHECK_BOX ? (
                                                                    <Checkbox
                                                                        style={{marginTop: 5}}
                                                                        status={
                                                                            currentQuestion.response.includes(
                                                                                option.optionId.toString(),
                                                                            )
                                                                                ? 'checked'
                                                                                : 'unchecked'
                                                                        }
                                                                        disabled
                                                                    />
                                                                ) : null}
                                                                {currentQuestion.questionType ==
                                                                Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE ? (
                                                                    <RadioButton
                                                                        status={
                                                                            currentQuestion.response == option.optionId
                                                                                ? 'checked'
                                                                                : 'unchecked'
                                                                        }
                                                                        disabled
                                                                    />
                                                                ) : null}
                                                                <TextInput
                                                                    disabled
                                                                    mode="flat"
                                                                    label=""
                                                                    placeholder="Option name"
                                                                    style={[
                                                                        styles.inputPrompt,
                                                                        {
                                                                            flex: 1,
                                                                            height: 36,
                                                                            marginHorizontal: 8,
                                                                            marginTop: 0,
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    ]}
                                                                    value={option.optionName}
                                                                />
                                                                <View style={{width: 30, height: 30}}></View>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        ),
                                    )}
                                </View>
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </Dialog>
                </Portal>
            </View>
        </ScrollView>
    );
};

export default PendingRequestListing;

const styles = StyleSheet.create({
    requestContainer: {
        marginHorizontal: 5,
        marginVertical: 8,
        padding: 16,
        elevation: 3,
        borderRadius: 16,
    },
    customerName: {
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
    },
    requestedDateTime: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginTop: -2,
    },
    requestedAddress: {
        flex: 1,
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginLeft: 20,
    },
    requestedTimeSlot: {
        flex: 1,
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginLeft: 20,
        marginTop: 5,
    },
    inputPrompt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 2,
        marginTop: 8,
    },

    questionSetupWrapper: {
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        elevation: 2,
        padding: 16,
    },
    dialogTitle: {
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
    },
    errorText: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: 'red',
        margin: 0,
        padding: 0,
    },
});
