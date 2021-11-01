import { useNavigation } from '@react-navigation/core';
import {CustomColors, CustomTypography} from '@styles';
import CommonFunction from '@utils/CommonFunction';
import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Avatar, Surface, Button} from 'react-native-paper';
import moment from 'moment';

const NewlyJoinedProviderDisplay = ({
    serviceType,
    joinedDate,
    businessName,
    profileImgUrl,
    coverImageUrl,
    providerId,
    style
}) => {
    const navigation = useNavigation();
    console.log(coverImageUrl);
    return (
        <Surface style={[styles.container, style]} needsOffscreenAlphaCompositing={true} >
            <ImageBackground style={styles.businessCoverImg} source={!!coverImageUrl?{uri: coverImageUrl}: require('@assets/images/default-coverImage.png')}></ImageBackground>
            <View style={[styles.contentWrapper,{backgroundColor:!!coverImageUrl?'rgba(38, 48, 89, .5)':'rgba(38, 48, 89, .2)'}]}>
                <Text style={styles.serviceType}>{CommonFunction.getDisplayNameForServiceType(serviceType)}</Text>
                <Text style={styles.monthlyAppointment}>Joined on {moment(new Date(joinedDate)).format('DD MMM')}</Text>
                <View style={styles.businessInfoWrapper}>
                    <Avatar.Image style={styles.businessLogo} size={80} source={!!profileImgUrl?{uri: profileImgUrl}: require('@assets/images/default-profileImage.png')} />
                    <View style={styles.bookNowWrapper}>
                        <Text style={styles.businessName}>{businessName}</Text>
                        <Button style={styles.bookBtn} mode='contained' dark={true} color={CustomColors.PRIMARY_BLUE} contentStyle={{height: 40, width: '100%', padding: 0, margin: 0}} onPress={() => {
                            navigation.navigate('BookServicePage', {providerId: providerId});
                        }}>BOOK NOW</Button>
                    </View>
                </View>
            </View>
        </Surface>
    );
};

export default NewlyJoinedProviderDisplay;

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
    },
    businessCoverImg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 16,
        top: 0,
        left: 0,
        resizeMode: 'cover',
    },
    contentWrapper: {
        borderRadius: 16,
        flex: 1,
        width:'100%',
        height: '100%',
        padding: 16,
        backgroundColor: 'rgba(38, 48, 89, .5)',
    },
    serviceType: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.WHITE,
    },
    monthlyAppointment: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.WHITE,
    },
    businessInfoWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center'
    },
    businessLogo: {
        width: 80,
        marginRight: 15
    },
    bookNowWrapper: {
        flex: 1,
        

    },
    businessName: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.WHITE,
    },
    bookBtn: {
        width:'100%',        
        height: 40,
        borderRadius: 8,
        marginTop: 5,
    }
});
