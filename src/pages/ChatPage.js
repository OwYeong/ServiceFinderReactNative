import {CustomColors, CustomTypography} from '@styles';
import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StatusBar, StyleSheet, Text, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatService from '@services/ChatService';
import {TouchableRipple, Avatar} from 'react-native-paper';
import {Constants} from '~constants';
import auth from '@react-native-firebase/auth';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/core';

import NoChatIllustration from '@assets/images/no-chat-illustration';

const ChatPage = () => {
    const navigation = useNavigation();
    const [chatrooms, setChatrooms] = useState([]);

    useEffect(() => {
        const unsubcriber = ChatService.getChatroomByUserId(setChatrooms);

        return () => {
            unsubcriber();
        };
    }, []);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={{width: '100%', flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
                        <Text
                            style={{
                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                fontSize: CustomTypography.FONT_SIZE_20,
                            }}>
                            Chats
                        </Text>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}}>
                        <View style={styles.bigContainer}>
                            {chatrooms.length > 0 ? (
                                chatrooms.map(chatroom => (
                                    <TouchableRipple
                                        style={{width: '100%', backgroundColor: 'white'}}
                                        key={chatroom.id}
                                        onPress={() => {
                                            navigation.navigate('Chatroom', {
                                                chatroomId: chatroom.id,
                                            });
                                        }}>
                                        <View
                                            style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                padding: 16,
                                                paddingVertical: 8,
                                            }}>
                                            <View style={{width: 60, borderRadius: 30, overflow: 'hidden'}}>
                                                {chatroom?.opponentUserInfo?.accType ==
                                                Constants.ACCOUNT_TYPE.VENDOR ? (
                                                    !!chatroom?.opponentUserInfo?.businessLogoUrl ? (
                                                        <Image
                                                            style={{width: '100%', height: undefined, aspectRatio: 1}}
                                                            source={{uri: chatroom?.opponentUserInfo?.businessLogoUrl}}
                                                        />
                                                    ) : (
                                                        <Image
                                                            style={{
                                                                width: '108%',
                                                                height: undefined,
                                                                aspectRatio: 1,
                                                            }}
                                                            source={require('@assets/images/default-profileImage.png')}
                                                        />
                                                    )
                                                ) : (
                                                    <Avatar.Text
                                                        color={'white'}
                                                        labelStyle={{fontSize: CustomTypography.FONT_SIZE_20}}
                                                        size={60}
                                                        label={chatroom?.opponentUserInfo?.name?.charAt(0) || 'A'}
                                                    />
                                                )}
                                            </View>
                                            <View style={{justifyContent: 'center', marginLeft: 12}}>
                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        fontSize: CustomTypography.FONT_SIZE_16,
                                                        color: CustomColors.GRAY_DARK,
                                                    }}>
                                                    {chatroom?.opponentUserInfo?.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        fontSize: CustomTypography.FONT_SIZE_14,
                                                        color: CustomColors.GRAY,
                                                    }}>
                                                    {!!chatroom?.lastMessage
                                                        ? _.truncate(
                                                              chatroom?.lastMessageBy == auth().currentUser.uid
                                                                  ? 'You: ' +
                                                                        chatroom?.lastMessage?.replaceAll('\n', '')
                                                                  : chatroom?.lastMessage?.replaceAll('\n', ''),
                                                              {
                                                                  length: 30,
                                                              },
                                                          )
                                                        : 'No message yet'}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableRipple>
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
                                        <View style={{width: 160, height: undefined, aspectRatio: 795 / 645}}>
                                            <NoChatIllustration fill={'#fff'} />
                                        </View>

                                        <Text
                                            style={{
                                                fontSize: CustomTypography.FONT_SIZE_14,
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                color: CustomColors.GRAY,
                                                textAlign: 'center',
                                                marginTop: 8,
                                            }}>
                                            You have no chat yet.
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ChatPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
    },
});
