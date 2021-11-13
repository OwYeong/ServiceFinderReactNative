import PushNotification, {Importance} from 'react-native-push-notification';

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);

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

    popInitialNotification: true,
    requestPermissions: true,
});

PushNotification.createChannel(
    {
        channelId: 'default-channel-id', // (required)
        channelName: `Service Finder Default Notification Channel`, // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

export const LocalNotification = () => {
    PushNotification.localNotification({
        autoCancel: true,
        bigText: 'This is local notification demo in React Native app. Only shown, when expanded.',
        subText: 'Local Notification Demo',
        title: 'Local Notification Title',
        message: 'Expand me to see more',
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        actions: '["Yes", "No"]',
    });
};
