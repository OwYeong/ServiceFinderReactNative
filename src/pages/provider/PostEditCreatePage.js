import {useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import React, {useState} from 'react';
import {Image, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {TextInput, Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const PostEditCreatePage = ({route}) => {
    const postData = route.params.postData;
    const chosenImage = route.params.chosenImage;

    const navigation = useNavigation();

    console.log(route);

    const [postTitle, setPostTitle] = useState(postData?.postTitle || 'My post title');

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                                }}>
                                {!!postData ? 'Edit Post' : 'Create Post'}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginTop: 16,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                overflow: 'hidden',
                                elevation: 1,
                            }}>
                            <Image
                                style={[styles.postImage]}
                                source={!!postData ? {uri: postData?.imageUrl} : {uri: chosenImage.path}}
                                resizeMode="cover"
                            />
                        </View>
                        <TextInput
                            style={styles.inputStyle}
                            value={postTitle}
                            onChangeText={text => {
                                setPostTitle(text);
                            }}
                            onEndEditing={e => {
                                if (e.nativeEvent.text == '') {
                                    setUserInput('My post title');
                                }
                            }}
                            mode={'outlined'}
                            label="Post Title"
                            name="postTitle"
                            placeholder="Your Post Title"
                            numberOfLines={5}
                            multiline
                        />
                        <Button
                            style={styles.actionBtn}
                            mode="contained"
                            contentStyle={{height: 50}}
                            color={CustomColors.PRIMARY_BLUE}
                            dark
                            onPress={() => {
                                if (!!postData) {
                                    ProviderService.updatePost(
                                        {
                                            postTitle: postTitle,
                                        },
                                        postData.id,
                                    )
                                        .then(() => {
                                            navigation.goBack();
                                        })
                                        .catch(error => {
                                            showMessage({
                                                message: 'Some Error Occur. Please Try again',
                                                type: 'info',
                                                position: 'center',
                                                titleStyle: {marginTop: 5},
                                                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                color: 'white', // text color
                                                hideOnPress: true,
                                                autoHide: true,
                                                duration: 1000,
                                            });
                                            console.log('create post error');
                                        });
                                } else {
                                    ProviderService.createPost({
                                        postTitle: postTitle,
                                        postImage: {
                                            path: chosenImage.path,
                                            mime: chosenImage.mime,
                                        },
                                    })
                                        .then(() => {
                                            navigation.goBack();
                                        })
                                        .catch(error => {
                                            showMessage({
                                                message: 'Some Error Occure. Please Try again',
                                                type: 'info',
                                                position: 'center',
                                                titleStyle: {marginTop: 5},
                                                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                color: 'white', // text color
                                                hideOnPress: true,
                                                autoHide: true,
                                                duration: 1000,
                                            });
                                            console.log('create post error');
                                        });
                                }
                            }}>
                            {!!postData ? 'Edit Post' : 'Create Post'}
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default PostEditCreatePage;

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
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
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
});
