import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';
import {FCM_SERVER_TOKEN} from '@env';
import axios from 'axios';
import NotificationService from './NotificationService';
import ProviderService from './ProviderService';

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
    getRequestById: (callback, requestId) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection.doc(requestId).onSnapshot(
            docSnapshot => {
                let request = {
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                    requestTimeSlot: {
                        start: docSnapshot.data().requestTimeSlot.start.toDate().toString(),
                        end: docSnapshot.data().requestTimeSlot.end.toDate().toString(),
                    },
                    dateTimeRequested: docSnapshot.data().dateTimeRequested.toDate().toString(),
                };

                callback(request);
            },
            error => {
                console.error(error);
            },
        );
    },
    rejectRequest: (documentId, rejectReason, customerId) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    requestStatus: Constants.REQUEST_STATUS.REJECTED,
                    rejectReason: rejectReason,
                })
                .then(async () => {
                    try {
                        const targetUserInfo = await UserService.getUserInfo(customerId);

                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `Your request has been rejected`,
                                `${
                                    store.getState().loginState.providerInfo.businessName
                                } has rejected your job request with the reason: ${rejectReason} `,
                            );
                        }
                        resolve('Request successfully rejected!');
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    acceptRequest: (documentId, customerId) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    requestStatus: Constants.REQUEST_STATUS.ACCEPTED,
                })
                .then(async () => {
                    try {
                        const targetUserInfo = await UserService.getUserInfo(customerId);

                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `Your request has been accepted`,
                                `${
                                    store.getState().loginState.providerInfo.businessName
                                } has accepted Your job request. You may track the progess in the app.`,
                            );
                        }
                        resolve('Request successfully accepted!');
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    updateRequest: (data, documentId) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    ...data,
                })
                .then(() => {
                    console.log('Request data successfully updated!');
                    resolve('Request data successfully updated!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    startJobRequest: (documentId, customerId) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    serviceStatus: Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS,
                })
                .then(async () => {
                    try {
                        const targetUserInfo = await UserService.getUserInfo(customerId);

                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `Your job request has started.`,
                                `${
                                    store.getState().loginState.providerInfo.businessName
                                } has started to work on your job request. Service provider will arrive at your doorstep shortly.`,
                            );
                        }
                        resolve('Request successfully started!');
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    completeJobRequest: (documentId, customerId, paymentReceived) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    serviceStatus: Constants.SERVICE_STATUS.SERVICE_COMPLETED,
                    paymentReceived: paymentReceived,
                })
                .then(async () => {
                    try {
                        const targetUserInfo = await UserService.getUserInfo(customerId);

                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `Your job request has been completed.`,
                                `${
                                    store.getState().loginState.providerInfo.businessName
                                } has completed your job request. Thank you for using ServiceFinder, please leave a rating to ${
                                    store.getState().loginState.providerInfo.businessName
                                }.`,
                            );
                        }
                        await ProviderService.updateProviderTotalEarningAndNumOfJobCompleted(paymentReceived);
                        await ProviderService.fetchProviderDataToRedux();
                        resolve('Request successfully started!');
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    vendorCancelRequest: (documentId, customerId) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    serviceStatus: Constants.SERVICE_STATUS.CANCELLED_BY_VENDOR,
                })
                .then(async () => {
                    try {
                        const targetUserInfo = await UserService.getUserInfo(customerId);

                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `Your job request has been cancelled.`,
                                `${
                                    store.getState().loginState.providerInfo.businessName
                                } has cancelled your job request. Refund will be done shortly.`,
                            );
                        }
                        resolve('Request successfully started!');
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
};

export default RequestService;
