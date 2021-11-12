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
import moment from 'moment';

const RequestService = {
    getAllRequestByProvider: (callback, providerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection
            .where('serviceProvider.userId', '==', providerUserId)
            .where('requestStatus', '==', Constants.REQUEST_STATUS.ACCEPTED)
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
    getUpcomingRequestByCustomer: (callback, customerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection
            .where('customerInfo.userId', '==', customerUserId)
            .where('requestStatus', '==', Constants.REQUEST_STATUS.ACCEPTED)
            .where('serviceStatus', 'in', [
                Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS,
            ])
            .orderBy('requestTimeSlot.start')
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

                            console.log(docSnapshot.data());
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
    getPendingRequestByCustomer: (callback, customerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection
            .where('customerInfo.userId', '==', customerUserId)
            .where('requestStatus', '==', Constants.REQUEST_STATUS.PENDING)
            .orderBy('dateTimeRequested', 'desc')
            .onSnapshot(
                querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const requests = [];
                        querySnapshot.forEach(docSnapshot => {
                            console.log(docSnapshot.data());
                            let request = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                                requestTimeSlot: {
                                    start: docSnapshot.data().requestTimeSlot.start.toDate().toString(),
                                    end: docSnapshot.data().requestTimeSlot.end.toDate().toString(),
                                },
                            };
                            if (!!docSnapshot.data().dateTimeRequested) {
                                request = {
                                    ...request,
                                    dateTimeRequested: docSnapshot.data().dateTimeRequested.toDate().toString(),
                                };
                            }

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
    getHistoryRequestByCustomer: (callback, customerUserId = auth().currentUser.uid) => {
        let requestCollection = firestore().collection('requests');

        return requestCollection
            .where('customerInfo.userId', '==', customerUserId)
            .where('requestStatus', 'in', [Constants.REQUEST_STATUS.ACCEPTED, Constants.REQUEST_STATUS.REJECTED])
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

                            console.log(docSnapshot.data());
                            if (request.requestStatus == Constants.REQUEST_STATUS.ACCEPTED) {
                                if (
                                    [
                                        Constants.SERVICE_STATUS.CANCELLED_BY_CUSTOMER,
                                        Constants.SERVICE_STATUS.CANCELLED_BY_VENDOR,
                                        Constants.SERVICE_STATUS.SERVICE_COMPLETED,
                                    ].indexOf(request.serviceStatus) != -1
                                ) {
                                    requests.push(request);
                                }
                            } else {
                                requests.push(request);
                            }
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
    getRequestByIdOneTimeRead: requestId => {
        return new Promise((resolve, reject) => {
            let requestCollection = firestore().collection('requests');

            requestCollection
                .doc(requestId)
                .get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        let data = {
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
                            requestTimeSlot: {
                                start: documentSnapshot.data().requestTimeSlot.start.toDate().toString(),
                                end: documentSnapshot.data().requestTimeSlot.end.toDate().toString(),
                            },
                            dateTimeRequested: documentSnapshot.data().dateTimeRequested.toDate().toString(),
                        };

                        resolve(data);
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
    checkIfRequestTimeIsAvailableForServiceProvider: (dateTimeRequested, serviceProviderId) => {
        return new Promise(async (resolve, reject) => {
            //This function is to check if service provider is available at the requested time. To avoid of timetable clash
            try {
                let requestCollection = firestore().collection('requests');

                let result = [];
                console.log(dateTimeRequested);
                console.log(moment(dateTimeRequested).add(1, 'hours').toDate());
                const startDateCrashQuerySnapshot = await requestCollection
                    .where('serviceProvider.userId', '==', serviceProviderId)
                    .where('requestStatus', 'in', [Constants.REQUEST_STATUS.ACCEPTED, Constants.REQUEST_STATUS.PENDING])
                    .where('requestTimeSlot.start', '>', firestore.Timestamp.fromDate(dateTimeRequested))
                    .where(
                        'requestTimeSlot.start',
                        '<',
                        firestore.Timestamp.fromDate(moment(dateTimeRequested).add(1, 'hours').toDate()),
                    )
                    .get();

                if (startDateCrashQuerySnapshot.size > 0) {
                    startDateCrashQuerySnapshot.forEach(documentSnapshot => {
                        let request = {
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
                            requestTimeSlot: {
                                start: documentSnapshot.data().requestTimeSlot.start.toDate().toString(),
                                end: documentSnapshot.data().requestTimeSlot.end.toDate().toString(),
                            },
                        };

                        if (!!documentSnapshot.data().dateTimeRequested) {
                            request = {
                                ...request,
                                dateTimeRequested: documentSnapshot.data().dateTimeRequested.toDate().toString(),
                            };
                        }

                        console.log(request);

                        if (
                            [
                                Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS,
                                Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                            ].indexOf(request.serviceStatus) != -1
                        )
                            result.push(request);
                    });
                } else {
                }

                const endDateCrashQuerySnapshot = await requestCollection
                    .where('serviceProvider.userId', '==', serviceProviderId)
                    .where('requestStatus', 'in', [Constants.REQUEST_STATUS.ACCEPTED, Constants.REQUEST_STATUS.PENDING])
                    .where('requestTimeSlot.end', '>', firestore.Timestamp.fromDate(dateTimeRequested))
                    .where(
                        'requestTimeSlot.end',
                        '<',
                        firestore.Timestamp.fromDate(moment(dateTimeRequested).add(1, 'hours').toDate()),
                    )
                    .get();
                if (endDateCrashQuerySnapshot.size > 0) {
                    endDateCrashQuerySnapshot.forEach(documentSnapshot => {
                        console.log(documentSnapshot.id);
                        let request = {
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
                            requestTimeSlot: {
                                start: documentSnapshot.data().requestTimeSlot.start.toDate().toString(),
                                end: documentSnapshot.data().requestTimeSlot.end.toDate().toString(),
                            },
                        };
                        if (!!documentSnapshot.data().dateTimeRequested) {
                            request = {
                                ...request,
                                dateTimeRequested: documentSnapshot.data().dateTimeRequested.toDate().toString(),
                            };
                        }

                        console.log(request);
                        console.log();
                        //if document is not already in the list
                        if (!result.find(req => req.id == documentSnapshot.id)) {
                            if (
                                [
                                    Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS,
                                    Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                                ].indexOf(request.serviceStatus) != -1
                            )
                                result.push(request);
                        }
                    });
                } else {
                }

                const sameDateTimeCrashQuerySnapshot = await requestCollection
                    .where('serviceProvider.userId', '==', serviceProviderId)
                    .where('requestStatus', 'in', [Constants.REQUEST_STATUS.ACCEPTED, Constants.REQUEST_STATUS.PENDING])
                    .where(
                        'requestTimeSlot.end',
                        '==',
                        firestore.Timestamp.fromDate(moment(dateTimeRequested).add(1, 'hours').toDate()),
                    )
                    .where('requestTimeSlot.start', '==', firestore.Timestamp.fromDate(dateTimeRequested))
                    .get();

                if (sameDateTimeCrashQuerySnapshot.size > 0) {
                    sameDateTimeCrashQuerySnapshot.forEach(documentSnapshot => {
                        console.log('same start date and end date');
                        console.log(documentSnapshot.id);
                        let request = {
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
                            requestTimeSlot: {
                                start: documentSnapshot.data().requestTimeSlot.start.toDate().toString(),
                                end: documentSnapshot.data().requestTimeSlot.end.toDate().toString(),
                            },
                        };
                        if (!!documentSnapshot.data().dateTimeRequested) {
                            request = {
                                ...request,
                                dateTimeRequested: documentSnapshot.data().dateTimeRequested.toDate().toString(),
                            };
                        }

                        //if document is not already in the list
                        if (!result.find(req => req.id == documentSnapshot.id)) {
                            if (
                                [
                                    Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS,
                                    Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                                ].indexOf(request.serviceStatus) != -1
                            )
                                result.push(request);
                        }
                    });
                } else {
                }
                console.log(result);
                const isTimetableClashOccur = result.length > 0;
                resolve(isTimetableClashOccur);
            } catch (error) {
                console.log('Error -> ProviderService.checkIfRequestTimeIsAvailableForServiceProvider\n');
                console.log(error);
                reject('some error occur');
            }
        });
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
                                targetUserInfo.id,
                                Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REQUEST,
                                {
                                    requestId: documentId
                                }
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
                                targetUserInfo.id,
                                Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REQUEST,
                                {
                                    requestId: documentId
                                }
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
    createRequest: data => {
        return new Promise((resolve, reject) => {
            try {
                const requestsCollection = firestore().collection('requests');
                
                // create a service request record in Firebase firestore
                requestsCollection
                    .add({
                        ...data,
                    })
                    .then(async docRef => {
                        console.log('Service Request successfully created!');

                        try {
                            const targetUserInfo = await UserService.getUserInfo(data.serviceProvider.userId);// Get Service Provider info

                            if (!!targetUserInfo.fcmToken) {
                                // if Firebase cloud messaging token is available
                                console.log('sending notification to' + targetUserInfo.fcmToken);

                                // push notification to Service provider Device.
                                await NotificationService.sendNotificationToDevice(
                                    targetUserInfo.fcmToken,
                                    `You have a new job request`,
                                    `You have a new job request, you may view the request in the app.`,
                                    targetUserInfo.id,
                                    Constants.NOTIFICATION_ACTION.NAVIGATE_TO_PENDING_REQUEST
                                    
                                );
                            }
                            resolve(docRef.id);
                        } catch (err) {
                            reject('Some error occur');
                            console.log(err);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        reject('Some error occur');
                    });
            } catch (err) {                
                console.log(err);
                console.log('Some error occur');
            }
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
                                targetUserInfo.id,
                                Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REQUEST,
                                {
                                    requestId: documentId
                                }
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
                                targetUserInfo.id,
                                Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REVIEW,
                                {
                                    requestId: documentId
                                }
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
                                targetUserInfo.id,
                                Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REQUEST,
                                {
                                    requestId: documentId
                                }
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
    customerCancelRequest: (documentId, providerId) => {
        return new Promise((resolve, reject) => {
            const requestsCollection = firestore().collection('requests');

            requestsCollection
                .doc(documentId)
                .update({
                    serviceStatus: Constants.SERVICE_STATUS.CANCELLED_BY_CUSTOMER,
                })
                .then(async () => {
                    try {
                        const targetUserInfo = await UserService.getUserInfo(providerId);

                        if (!!targetUserInfo.fcmToken) {
                            await NotificationService.sendNotificationToDevice(
                                targetUserInfo.fcmToken,
                                `Your job request has been cancelled.`,
                                `${
                                    store.getState().loginState.userInfo.firstName +
                                    ' ' +
                                    store.getState().loginState.userInfo.lastName
                                } has cancelled your job request.`,
                                targetUserInfo.id,
                                Constants.NOTIFICATION_ACTION.NAVIGATE_TO_REQUEST,
                                {
                                    requestId: documentId
                                }
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
