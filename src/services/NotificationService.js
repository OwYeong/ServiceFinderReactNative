import axios from 'axios';
import {FCM_SERVER_TOKEN} from '@env';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const NotificationService = {
    sendNotificationToDevice: (userFcmToken, title, body, receiveBy = null, action = null, actionPayload = null) => {
        const notificationCollection = firestore().collection('notifications');

        if (!!action) {
            notificationCollection
                .add({
                    title: title,
                    description: body,
                    receivedBy: receiveBy,
                    action: action,
                    actionPayload: actionPayload,
                    notificationDateTime: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(async docRef => {
                    console.log('successfully recorded the notification!');
                })
                .catch(err => {
                    console.log('error when recording the notification!');
                    console.log(err);
                });
        }

        return new Promise((resolve, reject) => {
            axios
                .post(
                    'https://fcm.googleapis.com/fcm/send',
                    {
                        to: userFcmToken,
                        notification: {
                            title: title,
                            body: body,
                        },
                    },
                    {
                        headers: {
                            Authorization: `key=${FCM_SERVER_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(response => {
                    resolve('success');
                })
                .catch(error => {
                    console.log('Some error occured when send notification');
                    console.log(error);
                    reject('error');
                });
        });
    },
    getAllNotificationByUserId: (callback, userId = auth().currentUser.uid) => {
        let notificationCollection = firestore().collection('notifications');

        return notificationCollection
            .where('receivedBy', '==', userId)
            .orderBy('notificationDateTime', 'desc')
            .onSnapshot(
                querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const notifications = [];
                        querySnapshot.forEach(docSnapshot => {

                            let notification = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                            };
                            if (!!docSnapshot.data().notificationDateTime) {
                                notification = {
                                    ...notification,
                                    notificationDateTime: docSnapshot.data().notificationDateTime.toDate().toString(),
                                };
                            }

                            notifications.push(notification);
                        });

                        callback(notifications);
                    } else {
                        const notifications = [];

                        callback(notifications);
                    }
                },
                error => {
                    console.error(error);
                },
            );
    },
};

export default NotificationService;
