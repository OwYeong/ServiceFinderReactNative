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
import auth from '@react-native-firebase/auth';

const PostViewPage = ({route}) => {
    const postDataParam = route.params.postData;

    const [postData, setPostData] = useState(postDataParam);

    const navigation = useNavigation();

    const [postTitle, setPostTitle] = useState(postData?.postTitle || 'My post title');
    const businessLogoActionSheet = useRef(null);

    useFocusEffect(
        useCallback(() => {
            ProviderService.getPost(postData.id).then(data => {
                setPostData(data);
            });
        }, []),
    );

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
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
                                {postData?.userId == auth().currentUser.uid ? (
                                    <IconButton
                                        icon="more-vert"
                                        color={CustomColors.GRAY_DARK}
                                        size={CustomTypography.ICON_SMALL}
                                        style={styles.backIcon}
                                        onPress={() => {
                                            businessLogoActionSheet.current.snapTo(1);
                                        }}
                                    />
                                ) : null}
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
                </ScrollView>
            </SafeAreaView>
            {postData?.userId == auth().currentUser.uid ? (
            <BottomSheet
                ref={businessLogoActionSheet}
                bottomSheerColor="#FFFFFF"
                // ref="BottomSheet"
                initialPosition={0}
                snapPoints={[0, 160]}
                isBackDrop={true}
                isBackDropDismissByPress={true}
                isRoundBorderWithTipHeader={true}
                // backDropColor="red"
                // isModal
                // containerStyle={{backgroundColor:"red"}}
                // tipStyle={{backgroundColor:"red"}}
                // headerStyle={{backgroundColor:"red"}}
                // bodyStyle={{backgroundColor:"red",flex:1}}
                body={
                    <View style={{paddingVertical: 16}}>
                        <TouchableOpacity
                            onPress={() => {
                                businessLogoActionSheet.current.snapTo(0);
                                navigation.navigate('PostEditCreate', {
                                    postData: {
                                        ...postData,
                                    },
                                });
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
                                    <MaterialIcons name="mode-edit" size={24} color={CustomColors.GRAY_DARK} />
                                </View>
                                <Text style={styles.actionButtonLabel}>Edit Post</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                ProviderService.deletePost(postData?.id)
                                    .then(res => {
                                        navigation.goBack();
                                        businessLogoActionSheet.current.snapTo(0);
                                    })
                                    .catch(err => {
                                        businessLogoActionSheet.current.snapTo(0);
                                    });
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
                                    <MaterialIcons name="delete" size={24} color={CustomColors.GRAY_DARK} />
                                </View>
                                <Text style={styles.actionButtonLabel}>Delete Post</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
            ):null}
        </View>
    );
};

export default PostViewPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        padding: 16,
    },
    inputStyle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 2,
        marginTop: 8,
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
    },
    postImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    backIcon: {
        marginLeft: -8,
    },
    actionButton: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
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
