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

const ForceLocationPick = () => {
    const navigation = useNavigation();

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                Post
                            </Text>
                        </View>
                        <View>
                            <IconButton
                                icon="more-vert"
                                color={CustomColors.GRAY_DARK}
                                size={CustomTypography.ICON_SMALL}
                                style={styles.backIcon}
                                onPress={() => {
                                    businessLogoActionSheet.current.snapTo(1);
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 16,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            overflow: 'hidden',
                            elevation: 1,
                        }}>
                        <Image style={[styles.postImage]} source={{uri: postData?.imageUrl}} resizeMode="cover" />
                    </View>
                    <Text style={styles.inputStyle}>{postData?.postTitle}</Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ForceLocationPick;

const styles = StyleSheet.create({});
