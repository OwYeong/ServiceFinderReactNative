import React, {useState, useEffect} from 'react';
import {View, Text, Image, StatusBar} from 'react-native';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {CustomColors, CustomTypography} from '@styles';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {Constants} from '~constants';
import ChatService from '@services/ChatService';
import {SafeAreaView} from 'react-native-safe-area-context';
import _ from 'lodash';

const ChatroomPage = ({user, route}) => {
    const navigation = useNavigation();

    const userInfo = useSelector(state => state.loginState.userInfo);
    const providerInfo = useSelector(state => state.loginState.providerInfo);

    const [messages, setMessages] = useState([]);
    const {chatroomId} = route.params;

    const [roomInfo, setRoomInfo] = useState(null);

    useEffect(() => {
        ChatService.getChatroomByIdOneTimeRead(chatroomId)
            .then(roomData => {
                setRoomInfo(roomData);
            })
            .catch(error => {
                console.log(error);
            });

        const unsubscriber = ChatService.getAllMessageInChatroom(setMessages, chatroomId);

        return () => {
            unsubscriber();
        };
    }, []);

    const sendMessageCallback = async messageArray => {
        try {
            const message = messageArray[0];
            var newMessage = {
                ...message,
                sentBy: auth().currentUser.uid,
                sentTo: roomInfo.opponentUserInfo.id,
                createdAt: new Date(),
                user: {
                    _id: auth().currentUser.uid,
                    accType: userInfo?.accType,
                },
            };

            if (userInfo?.accType == Constants.ACCOUNT_TYPE.CONSUMER) {
                newMessage = {
                    ...newMessage,
                    user: {
                        ...newMessage.user,
                        name: userInfo?.firstName + ' ' + userInfo?.lastName,
                    },
                };
            } else {
                newMessage = {
                    ...newMessage,
                    user: {
                        ...newMessage.user,
                        name: providerInfo?.businessName,
                        avatar: providerInfo?.businessLogoUrl,
                    },
                };
            }
            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));

            await ChatService.createMessage(
                {...newMessage, createdAt: firestore.FieldValue.serverTimestamp()},
                chatroomId,
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={{width: '100%', flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
                        <IconButton
                            icon="arrow-back"
                            color={CustomColors.GRAY_DARK}
                            size={CustomTypography.ICON_SMALL}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                        <View style={{width: 40, borderRadius: 30, overflow: 'hidden'}}>
                            {roomInfo?.opponentUserInfo?.accType == Constants.ACCOUNT_TYPE.VENDOR ? (
                                !!roomInfo?.opponentUserInfo?.businessLogoUrl ? (
                                    <Image
                                        style={{width: '100%', height: undefined, aspectRatio: 1}}
                                        source={{uri: roomInfo?.opponentUserInfo?.businessLogoUrl}}
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
                                    size={40}
                                    label={roomInfo?.opponentUserInfo?.name?.charAt(0) || 'A'}
                                />
                            )}
                        </View>
                        <Text
                            style={{
                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                fontSize: CustomTypography.FONT_SIZE_16,
                                color: CustomColors.GRAY_DARK,
                                marginLeft: 8,
                            }}>
                            {_.truncate(roomInfo?.opponentUserInfo?.name, {
                                length: 30,
                            })}
                        </Text>
                    </View>
                    <View style={{flex: 1, paddingHorizontal: 8}}>
                        <GiftedChat
                            style={{paddingHorizontal: 16}}
                            messages={messages}
                            onSend={text => sendMessageCallback(text)}
                            user={{
                                _id: auth().currentUser.uid,
                            }}
                            renderBubble={props => {
                                return (
                                    <Bubble
                                        {...props}
                                        wrapperStyle={{
                                            right: {
                                                backgroundColor: CustomColors.PRIMARY_BLUE,
                                                color: 'white',
                                            },
                                        }}
                                    />
                                );
                            }}
                            renderInputToolbar={props => {
                                return (
                                    <InputToolbar
                                        {...props}
                                        containerStyle={{
                                            marginLeft: -8,
                                            marginRight: -8,
                                            backgroundColor: CustomColors.GRAY_LIGHT,
                                        }}
                                        textInputStyle={{color: CustomColors.GRAY_DARK}}
                                    />
                                );
                            }}
                            renderSend={props => (
                                <Send {...props}>
                                    <View>
                                        <MaterialCommunityIcons
                                            name="send-circle"
                                            size={36}
                                            style={{marginBottom: 3, marginRight: 16}}
                                            color={CustomColors.PRIMARY_BLUE_SATURATED}
                                        />
                                    </View>
                                </Send>
                            )}
                            renderAvatar={props => {
                                if (props?.currentMessage?.user?.accType == Constants.ACCOUNT_TYPE.VENDOR) {
                                    return (
                                        <View style={{width: 36, height: 36, borderRadius: 25, overflow: 'hidden'}}>
                                            {!!props?.currentMessage?.user?.avatar ? (
                                                <Image
                                                    style={{width: 36, height: 36}}
                                                    source={{uri: props?.currentMessage?.user?.avatar}}
                                                />
                                            ) : (
                                                <Image
                                                    style={{width: 36, height: 36}}
                                                    source={require('@assets/images/default-profileImage.png')}
                                                />
                                            )}
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={{width: 36, height: 36, borderRadius: 25, overflow: 'hidden'}}>
                                            <Avatar.Text
                                                color={CustomColors.WHITE}
                                                size={36}
                                                label={props?.currentMessage?.user?.name.charAt(0) || 'S'}
                                            />
                                        </View>
                                    );
                                }
                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ChatroomPage;
