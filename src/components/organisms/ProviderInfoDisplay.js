import {CustomTypography, CustomColors} from '@styles';
import React, {useEffect} from 'react';
import {LogBox, ScrollView, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProviderInfoDisplay = ({providerInfo, isScrollEnabled}) => {
    useEffect(() => {
        LogBox.ignoreLogs([
            'VirtualizedLists should never be nested',
            // name of the error/warning here, or a regex here
        ]);
    }, []);

    return (
        <View style={{width: '100%', height: '100%', paddingHorizontal: 16}}>
            <ScrollView
                scrollEnabled={isScrollEnabled}
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled={true}>
                <View style={{flex: 1}}>
                    <View style={{flexDirection:'row', marginTop:24}}>
                        <MaterialIcons name="phone" size={20} color={CustomColors.GRAY_DARK} />
                        <Text style={[styles.desc, {marginLeft:12}]}>{providerInfo?.phoneNumber.split('').join('\u200A'.repeat(1))}</Text>
                    </View>
                    <Text style={styles.title}>Business description</Text>
                    <Text style={styles.desc}>{providerInfo?.businessDesc}</Text>
                    <Text style={styles.title}>Service Description</Text>
                    <Text style={styles.desc}>{providerInfo?.businessServiceDesc.trim()}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProviderInfoDisplay;

const styles = StyleSheet.create({
    title: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_DARK,
        marginTop: 20,
    },
    desc: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
    },
});
