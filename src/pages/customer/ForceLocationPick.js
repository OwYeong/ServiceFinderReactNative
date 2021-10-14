import {useFocusEffect, useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import React, {useState, useRef, useCallback} from 'react';
import {Image, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {TextInput, Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ForceLocationIllustration from '@assets/images/service-address-required-illustration';
const ForceLocationPick = () => {
    const navigation = useNavigation();

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <Text style={styles.header}>Welcome to ServiceFinder. Input your address to proceed.</Text>
                    <Text style={styles.desc}>
                        Please input your address before you could purchase a service. The address will be used as the place for the actual delivery of service.
                    </Text>
                    <View style={{width: '90%', height: undefined, aspectRatio: 676 / 370, marginTop: 60}}>
                        <ForceLocationIllustration fill="#fff" />
                    </View>
                    <Button
                        style={styles.actionBtn}
                        mode="contained"
                        contentStyle={{height: 50}}
                        color={CustomColors.PRIMARY_BLUE}
                        dark
                        onPress={() => {
                            navigation.navigate('LocationPicker')
                        }}>
                        Pick a location
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ForceLocationPick;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        padding: 16,
        paddingVertical: 24,
    },
    header: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.GRAY_DARK,
        marginTop: 24,
    },
    desc: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY,
        marginTop: 12,
    },

    actionBtnContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    actionBtn: {
        marginTop: 40,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
    },
});
