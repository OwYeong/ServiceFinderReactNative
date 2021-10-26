import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserService from '@services/UserService';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {Avatar, Button, TouchableRipple} from 'react-native-paper';
import {CustomColors, CustomTypography} from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants} from '~constants';

const CustomerProfilePage = () => {
    const navigation = useNavigation();
    const userInfo = useSelector(state => state.loginState.userInfo);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View style={{width: '100%', flex: 1, padding: 16}}>
                        <View style={{flexDirection: 'row', marginTop: 12, alignItems: 'center'}}>
                            <Avatar.Text
                                color={'white'}
                                size={64}
                                labelStyle={{fontSize: CustomTypography.FONT_SIZE_20}}
                                label={userInfo?.firstName?.charAt(0) || 'S'}
                            />
                            <View style={{marginLeft: 24}}>
                                <Text
                                    style={{
                                        fontSize: CustomTypography.FONT_SIZE_20,
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        color: CustomColors.GRAY_MEDIUM,
                                    }}>
                                    {userInfo?.firstName} {userInfo?.lastName}
                                </Text>
                                <Button
                                    mode="contained"
                                    dark
                                    color={CustomColors.PRIMARY_BLUE}
                                    style={{borderRadius: 8, marginTop: 8}}
                                    labelStyle={{fontSize: CustomTypography.FONT_SIZE_14}}
                                    uppercase={false}
                                    onPress={() => {
                                        navigation.navigate('EditAccountProfile');
                                    }}>
                                    Edit Profile
                                </Button>
                            </View>
                        </View>
                        <View
                            style={{
                                backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                width: '100%',
                                height: 2,
                                marginVertical: 24,
                            }}></View>
                        {userInfo?.loginProvider == Constants.LOGIN_PROVIDER_FIREBASE ? (
                            <TouchableRipple
                                rippleColor="rgba(0, 0, 0, .32)"
                                onPress={() => {
                                    navigation.navigate('ChangePassword');
                                }}>
                                <View style={styles.actionButton}>
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: CustomColors.GRAY_LIGHT,
                                        }}>
                                        <MaterialCommunityIcons
                                            name="lock-reset"
                                            size={24}
                                            color={CustomColors.GRAY_DARK}
                                        />
                                    </View>

                                    <Text style={styles.actionButtonLabel}>Change Password</Text>
                                </View>
                            </TouchableRipple>
                        ) : null}
                        <TouchableRipple
                                rippleColor="rgba(0, 0, 0, .32)"
                                onPress={() => {
                                    navigation.navigate('ChangePhone');
                                }}>
                                <View style={styles.actionButton}>
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: CustomColors.GRAY_LIGHT,
                                        }}>
                                        <MaterialCommunityIcons
                                            name="phone"
                                            size={20}
                                            color={CustomColors.GRAY_DARK}
                                        />
                                    </View>

                                    <Text style={styles.actionButtonLabel}>Change Phone Number</Text>
                                </View>
                            </TouchableRipple>
                        <TouchableRipple
                            rippleColor="rgba(0, 0, 0, .32)"
                            onPress={() => {
                                UserService.logOut()
                                    .then(data => {})
                                    .catch(err => {});
                            }}>
                            <View style={styles.actionButton}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: CustomColors.GRAY_LIGHT,
                                    }}>
                                    <MaterialIcons name="logout" size={24} color={CustomColors.GRAY_DARK} />
                                </View>

                                <Text style={styles.actionButtonLabel}>Logout</Text>
                            </View>
                        </TouchableRipple>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default CustomerProfilePage;

const styles = StyleSheet.create({
    actionButton: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actionButtonLabel: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
        marginHorizontal: 16,
    },
});
