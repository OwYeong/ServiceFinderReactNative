import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';

const RequestService = {
    getAllRequestByProvider: (callback, providerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection.where('serviceProvider.userId', '==', providerUserId).onSnapshot(querySnapshot => {
            if (querySnapshot.size > 0) {
                const requests = [];

                querySnapshot.forEach(docSnapshot => {
                    let request = {
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                        requestTimeSlot: {
                            start: docSnapshot.data().requestTimeSlot.start.toDate().toString(),
                            end: docSnapshot.data().requestTimeSlot.end.toDate().toString(),
                        },
                        dateTimeRequested: docSnapshot.data().dateTimeRequested.toDate().toString(),
                    };
                    requests.push(request);
                });

                callback(requests);
            } else {
                const requests = [];

                callback(requests);
            }
        });
    },
};

export default RequestService;
