import {useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import {FastField, Field, Formik} from 'formik';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    LayoutAnimation,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
    TextInput,
    Button,
    IconButton,
    HelperText,
    TouchableRipple,
    Searchbar,
    Menu,
    RadioButton,
    Checkbox,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import GeoLocationUtils from '@utils/GeoLocationUtils';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {getBoundsOfDistance, isPointInPolygon} from 'geolib';
import LoadingModal from '@organisms/LoadingModal';
import FormIllustrationSvg from '@assets/images/form-illustration';
import {Constants} from '~constants';

const FormEditPage = () => {
    const navigation = useNavigation();
    const providerInfo = useSelector(state => state.loginState.providerInfo);

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Editing Profile...',
    });

    const [userInput, setUserInput] = useState({
        additionalFormSetup: providerInfo?.withAdditionalForm
            ? [...providerInfo?.additionalForm]
            : [
                  {
                      id: 1,
                      questionName: 'Untitled Question',
                      questionType: Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER,
                      options: [],
                  },
              ],
    });

    const [showAdditionalInputFormSetup, setShowAdditionalInputFormSetup] = useState(false);

    const editForm = withAdditionalForm => {
        setLoadingModal({isVisible: true, modalTitle: 'Finishing Setup'});

        var providerData = {};

        if (withAdditionalForm) {
            providerData = {
                ...providerData,
                withAdditionalForm: true,
                additionalForm: [...userInput.additionalFormSetup],
            };
        } else {
            providerData = {
                ...providerData,
                withAdditionalForm: false,
            };
        }

        ProviderService.updateProviderData(providerData)
            .then(data => {
                console.log('updating business Profile setup status');
                ProviderService.fetchProviderDataToRedux()
                    .then(data => {
                        navigation.goBack();
                    })
                    .catch(err => {});
            })
            .catch(err => {});
    };

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8}}>
                    <IconButton
                        icon="arrow-back"
                        color={CustomColors.GRAY_DARK}
                        size={CustomTypography.ICON_SMALL}
                        style={styles.backIcon}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                            fontSize: CustomTypography.FONT_SIZE_16,
                            marginTop: 2,
                        }}>
                        My Form Setup
                    </Text>
                </View>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <Text style={styles.sectionTitle}>Additonal Form Setup</Text>
                        <Text style={styles.sectionDesc}>
                            This section is optional. If your business need some additional input from your customer,
                            You could setup your questionnaire here.{' '}
                        </Text>

                        {!providerInfo?.withAdditionalForm ? (
                            <View style={{marginTop: 100, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={styles.formIllustrationWrapper}>
                                    <FormIllustrationSvg fill={'white'} />
                                </View>
                                <Text
                                    style={[
                                        styles.sectionDesc,
                                        {width: 200, textAlign: 'center', marginTop: 16, color: CustomColors.GRAY},
                                    ]}>
                                    Oops, looks like you don't have a form setup yet.
                                </Text>
                                <Button
                                    mode="contained"
                                    color={CustomColors.PRIMARY_BLUE}
                                    dark
                                    style={{marginTop: 8, borderRadius: 8}}>
                                    Setup Now
                                </Button>
                            </View>
                        ) : null}

                        {showAdditionalInputFormSetup || providerInfo?.withAdditionalForm ? (
                            <View style={styles.formSetupContainer}>
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                    }}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.subSectionTitle}>Form Setup</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableRipple
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 18,
                                                marginBottom: 5,
                                                marginRight:8
                                            }}
                                            borderless
                                            rippleColor="rgba(0, 0, 0, .32)"
                                            onPress={() => {
                                                Alert.alert("Remove This Form", "Are you sure you want to remove this form? This action cannot be reverted.", [
                                                    { text: "cancel" },
                                                    {
                                                        text: "remove form",
                                                        onPress:()=>{
  
                                                        },
                                                        style: 'destructive'
                                                      }
                                                  ]);
                                            }}>
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderWidth: 2,
                                                    borderColor: CustomColors.GRAY,
                                                    borderRadius: 18,
                                                    overflow: 'hidden',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <MaterialIcon name="delete-outline" size={20} color={CustomColors.GRAY} />
                                            </View>
                                        </TouchableRipple>
                                        <TouchableRipple
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 18,
                                                marginBottom: 5,
                                            }}
                                            borderless
                                            rippleColor="rgba(0, 0, 0, .32)"
                                            onPress={() => {
                                                const newUserInput = {...userInput};

                                                newUserInput.additionalFormSetup.push({
                                                    id:
                                                        userInput.additionalFormSetup[
                                                            userInput.additionalFormSetup.length - 1
                                                        ].id + 1,
                                                    questionName: 'Untitled Question',
                                                    questionType: Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER,
                                                    options: [],
                                                });

                                                setUserInput(newUserInput);
                                            }}>
                                            <View
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderWidth: 2,
                                                    borderColor: CustomColors.GRAY,
                                                    borderRadius: 18,
                                                    overflow: 'hidden',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <MaterialIcon name="add" size={20} color={CustomColors.GRAY} />
                                            </View>
                                        </TouchableRipple>
                                    </View>
                                </View>

                                {userInput.additionalFormSetup.map((currentQuestion, index) => (
                                    <View style={styles.questionSetupWrapper} key={currentQuestion.id}>
                                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                            {userInput.additionalFormSetup.length > 1 ? (
                                                <Button
                                                    mode="text"
                                                    color={CustomColors.GRAY_DARK}
                                                    style={{
                                                        fontSize: CustomTypography.FONT_SIZE_12,
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    }}
                                                    onPress={() => {
                                                        const newUserInput = {...userInput};

                                                        newUserInput.additionalFormSetup.splice(index, 1);

                                                        setUserInput(newUserInput);
                                                    }}>
                                                    REMOVE THIS QUESTION
                                                </Button>
                                            ) : null}
                                        </View>
                                        <TextInput
                                            mode="outlined"
                                            label="Question"
                                            multiline
                                            placeholder="Your question"
                                            style={[styles.inputPrompt]}
                                            value={currentQuestion.questionName}
                                            onChangeText={text => {
                                                const newUserInput = {...userInput};

                                                newUserInput.additionalFormSetup[index].questionName = text;

                                                setUserInput(newUserInput);
                                            }}></TextInput>
                                        <Text style={[styles.inputTitle, {marginTop: 16, marginLeft: 8}]}>
                                            Question Type
                                        </Text>
                                        <RNPickerSelect
                                            placeholder={{}}
                                            items={[
                                                {
                                                    label: 'Text answer',
                                                    value: Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER,
                                                },
                                                {
                                                    label: 'Multiple choice',
                                                    value: Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE,
                                                },
                                                {
                                                    label: 'Checkboxes',
                                                    value: Constants.QUESTIONNAIRE_TYPE.CHECK_BOX,
                                                },
                                            ]}
                                            onValueChange={value => {
                                                const newUserInput = {...userInput};

                                                newUserInput.additionalFormSetup[index].questionType = value;

                                                if (
                                                    value == Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE ||
                                                    value == Constants.QUESTIONNAIRE_TYPE.CHECK_BOX
                                                ) {
                                                    newUserInput.additionalFormSetup[index].options = [
                                                        {optionId: 1, optionName: 'Option 1'},
                                                    ];
                                                } else {
                                                    newUserInput.additionalFormSetup[index].options = [];
                                                }

                                                setUserInput(newUserInput);
                                            }}
                                            style={{
                                                ...pickerSelectStyles,

                                                iconContainer: {
                                                    top: 20,
                                                    right: 12,
                                                },
                                            }}
                                            useNativeAndroidPickerStyle={false}
                                            Icon={() => (
                                                <Ionicons
                                                    name="md-chevron-down"
                                                    size={20}
                                                    fill={CustomColors.GRAY_DARK}
                                                />
                                            )}
                                            value={currentQuestion.questionType}
                                        />
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
                                                                status={'unchecked'}
                                                                disabled
                                                            />
                                                        ) : null}
                                                        {currentQuestion.questionType ==
                                                        Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE ? (
                                                            <RadioButton status={'unchecked'} disabled />
                                                        ) : null}
                                                        <TextInput
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
                                                            onEndEditing={e => {
                                                                if (e.nativeEvent.text == '') {
                                                                    const newUserInput = {...userInput};

                                                                    newUserInput.additionalFormSetup[index].options[
                                                                        i
                                                                    ].optionName = 'Option ' + (i + 1);

                                                                    setUserInput(newUserInput);
                                                                }
                                                            }}
                                                            onChangeText={text => {
                                                                const newUserInput = {...userInput};

                                                                newUserInput.additionalFormSetup[index].options[
                                                                    i
                                                                ].optionName = text;

                                                                setUserInput(newUserInput);
                                                            }}
                                                            value={option.optionName}
                                                        />
                                                        {currentQuestion.options.length > 1 ? (
                                                            <TouchableRipple
                                                                style={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    marginTop: 5,
                                                                    borderRadius: 18,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                                borderless
                                                                rippleColor="rgba(0, 0, 0, .32)"
                                                                onPress={() => {
                                                                    const newUserInput = {...userInput};

                                                                    newUserInput.additionalFormSetup[
                                                                        index
                                                                    ].options.splice(i, 1);

                                                                    setUserInput(newUserInput);
                                                                }}>
                                                                <MaterialIcon
                                                                    name="close"
                                                                    size={24}
                                                                    color={CustomColors.GRAY_DARK}
                                                                />
                                                            </TouchableRipple>
                                                        ) : (
                                                            <View style={{width: 30, height: 30}}></View>
                                                        )}
                                                    </View>
                                                ))}

                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    {currentQuestion.questionType ==
                                                    Constants.QUESTIONNAIRE_TYPE.CHECK_BOX ? (
                                                        <Checkbox
                                                            style={{marginTop: 5}}
                                                            status={'unchecked'}
                                                            disabled
                                                        />
                                                    ) : null}
                                                    {currentQuestion.questionType ==
                                                    Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE ? (
                                                        <RadioButton status={'unchecked'} disabled />
                                                    ) : null}
                                                    <Button
                                                        mode="text"
                                                        color={CustomColors.PRIMARY_BLUE}
                                                        uppercase={false}
                                                        style={{
                                                            fontSize: CustomTypography.FONT_SIZE_12,
                                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        }}
                                                        onPress={() => {
                                                            const newUserInput = {...userInput};
                                                            console.log(
                                                                parseFloat(
                                                                    currentQuestion.options[
                                                                        currentQuestion.options.length - 1
                                                                    ].optionId,
                                                                ) + 1,
                                                            );

                                                            newUserInput.additionalFormSetup[index].options.push({
                                                                optionId:
                                                                    parseFloat(
                                                                        currentQuestion.options[
                                                                            currentQuestion.options.length - 1
                                                                        ].optionId,
                                                                    ) + 1,
                                                                optionName:
                                                                    'Option ' +
                                                                    (parseFloat(currentQuestion.options.length) + 1),
                                                            });

                                                            setUserInput(newUserInput);
                                                        }}>
                                                        Add option
                                                    </Button>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ))}
                                <Button
                                    style={styles.actionBtn}
                                    mode="contained"
                                    contentStyle={{height: 50}}
                                    color={CustomColors.PRIMARY_BLUE}
                                    dark
                                    onPress={() => {
                                        finishSetup(true);
                                    }}>
                                    {providerInfo?.withAdditionalForm ? 'Edit Form' : 'Finish'}
                                </Button>
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <LoadingModal
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                animationOutTiming={150}
                isVisible={loadingModal.isVisible}
                modalTitle={loadingModal.modalTitle}
                statusBarTranslucent={true}
                useNativeDriver={true}></LoadingModal>
        </View>
    );
};

export default FormEditPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        padding: 16,
    },
    backIcon: {
        marginLeft: -8,
    },
    inputPrompt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 2,
        marginTop: 8,
    },
    sectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.GRAY_MEDIUM,
    },
    subSectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_MEDIUM,
        marginTop: 16,
    },
    sectionDesc: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_18,
        color: CustomColors.GRAY_MEDIUM,
    },
    actionBtnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionBtn: {
        marginTop: 40,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
        marginBottom: 16,
    },
    formIllustrationWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionSetupWrapper: {
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        elevation: 1,
        padding: 16,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: CustomColors.GRAY,
        color: CustomColors.GRAY_DARK,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomWidth: 1,
        paddingRight: 30, // to ensure the text is never behind the icon
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
