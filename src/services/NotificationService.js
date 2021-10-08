import axios from 'axios';
import {FCM_SERVER_TOKEN} from '@env';

const NotificationService = {
    sendNotificationToDevice: (userFcmToken, title, body) => {
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
                            'Authorization': `key=${FCM_SERVER_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(response => {
                    resolve('success')
                })
                .catch(error => {
                    console.log('Some error occured when send notification');
                    console.log(error)
                    reject('error')
                });
        });
    },
};

export default NotificationService;
