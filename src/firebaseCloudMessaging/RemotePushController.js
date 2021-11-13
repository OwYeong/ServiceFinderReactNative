import React, {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestService from '@services/RequestService';
import NotificationService from '@services/NotificationService';
import moment from 'moment';

const RemotePushController = () => {
    useEffect(() => {
        // Setup background service to listen for Firebase cloud messaging signal 
        PushNotification.configure({
            onRegister: async function (token) {
                try {
                    console.log('FCM TOKEN:', token);

                    await AsyncStorage.setItem('fcmToken', token.token);// Store FCM token in device local storage
                } catch (err) {
                    console.log('Error occurs when storing fck token to AsyncStorage')
                    console.log(err);
                }
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: async function (notification) {
                //Receive signal from Firebase Cloud Messaging
                console.log('REMOTE NOTIFICATION ==>', notification);

                if(notification.title == "Your request has been accepted" && !!notification.data){
                    try{
                        const requestId = notification?.data?.requestId;

                        if(!!requestId) {
                            const requestData = await RequestService.getRequestByIdOneTimeRead(requestId);

                            NotificationService.scheduleNotificationLocally('You have a service appointment in 30 minutes.', `You have a service request with ${requestData?.serviceProvider?.businessName} later at ${moment(new Date(requestData?.requestTimeSlot?.start)).format('hh:mm A')}`, moment(new Date(requestData?.requestTimeSlot?.start)).subtract(30, 'minutes').toDate());


                        }
                    } catch(error){
                        console.log("error when scheduling local notification")
                        console.log(error)
                    }
                }

                // Push the notification to device
                PushNotification.localNotification({
                    /* Android Only Properties */
                    channelId: 'default-channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.

                    title: notification.title,
                    message: notification.message,
                    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                    priority: 'high', // (optional) set notification priority, default: high
                    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
                    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                });
            },
            // Android only: GCM or FCM Sender ID
            senderID: '105438375417',
            popInitialNotification: true,
            requestPermissions: true,
        });
    }, []);

    return null;
};

export default RemotePushController;
