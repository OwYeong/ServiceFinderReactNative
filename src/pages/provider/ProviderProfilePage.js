import UserService from '@services/UserService';
import React from 'react';
import {Button, Image, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {CustomColors, CustomMixins, CustomTypography} from '@styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

const ProviderProfilePage = () => {
    const providerInfo = useSelector(state => state.loginState.providerInfo);
    const userInfo = useSelector(state => state.loginState.userInfo);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={styles.imageContainer}>
                            <TouchableHighlight
                                onPress={() => {
                                    coverImageActionSheet.current.snapTo(1);
                                }}
                                activeOpacity={0.6}
                                underlayColor="#FFFFFF">
                                <Image
                                    style={styles.coverImage}
                                    source={
                                        !!providerInfo?.coverImgUrl
                                            ? {uri: providerInfo?.coverImgUrl}
                                            : require('@assets/images/default-coverImage.png')
                                    }
                                    resizeMode="cover"
                                />
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.businessProfileImageWrapper}
                                onPress={() => {
                                    businessLogoActionSheet.current.snapTo(1);
                                }}
                                activeOpacity={0.6}
                                underlayColor="#FFFFFF">
                                <Image
                                    style={styles.businessProfileImage}
                                    source={
                                        !!providerInfo?.businessLogoUrl
                                            ? {uri: providerInfo?.businessLogoUrl}
                                            : require('@assets/images/default-profileImage.png')
                                    }
                                />
                            </TouchableHighlight>
                        </View>
                        <Button
                            onPress={async () => {
                                UserService.logOut();
                            }}
                            title="LogOut"></Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ProviderProfilePage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
    },
    imageContainer: {
        width: '100%',
        padding: 16,
        marginBottom: 16,
    },
    coverImage: {
        marginLeft: -20,
        height: undefined,
        aspectRatio: 4 / 2,
    },
    businessProfileImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    businessProfileImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderWidth: 3,
        borderColor: CustomColors.WHITE,
    },
});
