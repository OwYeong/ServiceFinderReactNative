import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';
import NotificationService from './NotificationService';

const ChatService = {
    getChatroomByUserId: (callback, userId = auth().currentUser.uid) => {
        let chatroomCollection = firestore().collection('chatrooms');

        return chatroomCollection
            .where('usersInChat', 'array-contains', userId)
            .orderBy('lastUpdated', 'desc')
            .onSnapshot(
                async querySnapshot => {
                    try {
                        if (querySnapshot.size > 0) {
                            const chatrooms = [];
                            console.log('more that 0');

                            for (let i in querySnapshot.docs) {
                                const docSnapshot = querySnapshot.docs[i];

                                let room = {
                                    id: docSnapshot.id,
                                    _id: docSnapshot.id,
                                    ...docSnapshot.data(),
                                };

                                if (!!docSnapshot.data().lastUpdated) {
                                    room = {...room, lastUpdated: docSnapshot.data().lastUpdated.toDate().toString()};
                                }

                                console.log(room);
                                const opponentInfo = docSnapshot.data().usersInChat.find(id => id != userId);
                                const opponentUserInfo = await UserService.getUserInfoForChatroom(opponentInfo);

                                room = {
                                    ...room,
                                    opponentUserInfo: opponentUserInfo,
                                };
                                console.log(room);
                                chatrooms.push(room);
                            }

                            console.log(chatrooms);
                            callback(chatrooms);
                        } else {
                            console.log('less than equal 0');
                            callback([]);
                        }
                    } catch (error) {
                        console.log(error.stack);
                        console.log('Error -> ChatService.getChatroomByUserId\n');
                    }
                },
                error => {
                    console.log('error');
                    console.error(error);
                },
            );
    },
    getChatroomIdBetweenTwoUser: (userId1, userId2 = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {

            let chatroomCollection = firestore().collection('chatrooms');

            chatroomCollection
                .where(`chatUsersString`, 'in', [`${userId1}_${userId2}`,`${userId2}_${userId1}`])
                .orderBy('lastUpdated', 'desc')
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const docSnapshot = querySnapshot.docs[0];

                        resolve(docSnapshot.id);
                    } else {
                        chatroomCollection
                            .add({
                                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                                usersInChat: [userId1, userId2],
                                chatUsersString: `${userId1}_${userId2}`,
                            })
                            .then(async docRef => {
                                resolve(docRef.id);
                            })
                            .catch(err => {
                                console.log(err);
                                reject('Some error occur');
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject('Some error occur');
                });
        });
    },
    getChatroomByIdOneTimeRead: (documentId, userId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            let chatroomCollection = firestore().collection('chatrooms');

            chatroomCollection
                .doc(documentId)
                .get()
                .then(async docSnapshot => {
                    if (docSnapshot.exists) {
                        let room = {
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                            lastUpdated: docSnapshot.data().lastUpdated.toDate().toString(),
                        };

                        const opponentInfo = docSnapshot.data().usersInChat.find(id => id != userId);
                        const opponentUserInfo = await UserService.getUserInfoForChatroom(opponentInfo);

                        room = {
                            ...room,
                            opponentUserInfo: opponentUserInfo,
                        };

                        resolve(room);
                    } else {
                        reject('Document does not exist');
                    }
                })
                .catch(error => {
                    console.log('Error -> ProviderService.getPost\n');
                    reject(error);
                });
        });
    },
    getAllMessageInChatroom: (callback, chatroomId) => {
        const messageCollection = firestore()
            .collection('chatrooms')
            .doc(chatroomId)
            .collection('messages')
            .orderBy('createdAt', 'desc');

        return messageCollection.onSnapshot(
            querySnapshot => {
                try {
                    const messages = querySnapshot.docs.map(documentSnapshot => {
                        if (!!documentSnapshot.data().createdAt) {
                            return {
                                id: documentSnapshot.id,
                                ...documentSnapshot.data(),
                                createdAt: documentSnapshot.data().createdAt.toDate(),
                            };
                        } else {
                            return {
                                id: documentSnapshot.id,
                                ...documentSnapshot.data(),
                                createdAt: new Date(),
                            };
                        }
                    });
                    callback(messages);
                } catch (error) {
                    console.log(error.stack);
                    console.log('Error -> ChatService.getAllMessageInChatroom\n');
                }
            },
            error => {
                console.log('error');
                console.error(error);
            },
        );
    },
    createMessage: (data, chatroomId) => {
        return new Promise((resolve, reject) => {
            const messageCollection = firestore().collection('chatrooms').doc(chatroomId).collection('messages');
            const newDocumentId = messageCollection.doc().id;

            messageCollection
                .doc(newDocumentId)
                .set({
                    ...data,
                })
                .then(async () => {
                    try {
                        console.log('getting target user');
                        const targetUserInfo = await UserService.getUserInfo(data.sentTo);
                        const accType = store.getState().loginState.userInfo.accType;

                        console.log('the target user info');
                        console.log(targetUserInfo);
                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `You have a new message.`,
                                `${
                                    accType == Constants.ACCOUNT_TYPE.CONSUMER
                                        ? store.getState().loginState.userInfo.firstName +
                                          ' ' +
                                          store.getState().loginState.userInfo.lastName
                                        : store.getState().loginState.providerInfo.businessName
                                } has sent you a message.`,
                            );
                        }

                        await ChatService.updateLastMessageForChatRoom(data, chatroomId);

                        resolve('Successfully send message!');
                    } catch (err) {
                        console.log(err);
                        reject('Some error occur');
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    updateLastMessageForChatRoom: (messageData, chatroomId) => {
        return new Promise((resolve, reject) => {
            const chatroomCollection = firestore().collection('chatrooms');

            chatroomCollection
                .doc(chatroomId)
                .update({
                    lastMessage: messageData.text,
                    lastMessageBy: messageData.sentBy,
                    lastUpdated: messageData.createdAt,
                })
                .then(() => {
                    console.log('last Message successfully updated!');
                    resolve('last Message successfully updated');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
};

export default ChatService;
