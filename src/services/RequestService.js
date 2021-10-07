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

        return requestCollection
            .where('serviceProvider.userId', '==', providerUserId)
            .where('requestStatus', '==', Constants.REQUEST_STATUS.ACCEPTED)
            .onSnapshot(querySnapshot => {
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
    getPendingRequestByProvider: (callback, providerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection
            .where('serviceProvider.userId', '==', providerUserId)
            .where('requestStatus', '==', Constants.REQUEST_STATUS.PENDING)
            .orderBy('dateTimeRequested', 'desc')
            .onSnapshot(
                querySnapshot => {
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
                },
                error => {
                    console.error(error);
                },
            );
    },
    getHistoryRequestByProvider: (callback, providerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection
            .where('serviceProvider.userId', '==', providerUserId)
            .where('requestStatus', 'in', [Constants.REQUEST_STATUS.ACCEPTED, Constants.REQUEST_STATUS.REJECTED])
            .orderBy('dateTimeRequested', 'desc')
            .onSnapshot(
                querySnapshot => {
                    console.log(querySnapshot);
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
                },
                error => {
                    console.error(error);
                },
            );
    },
    rejectRequest: (documentId, rejectReason) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    requestStatus: Constants.REQUEST_STATUS.REJECTED,
                    rejectReason: rejectReason,
                })
                .then(() => {
                    resolve('Request successfully rejected!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    acceptRequest: documentId => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    requestStatus: Constants.REQUEST_STATUS.ACCEPTED,
                })
                .then(() => {
                    resolve('Request successfully rejected!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
};

export default RequestService;
