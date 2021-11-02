import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';
import moment from 'moment';

// ~1 km of lat and lon in degrees (not 100% accurate, approximately only)
//adopted from : https://stackoverflow.com/questions/4000886/gps-coordinates-1km-square-around-a-point
let latDegreeFor1Km = 0.008983;
let lonDegreeFor1Km = 0.01506;

const ProviderService = {
    getPopularServiceOfTheMonthWithPagination: (lastVisibleDocument = null) => {
        return new Promise((resolve, reject) => {
            let popularService = null;
            // Firebase does not support query that uses a fieldvalue.
            // In our case, we need serviceCoverage field value when querying the service providers within the area of customer doorstep
            // Its is best to be done using firebaseCloud function or a custom backend server with firebase admin SDK.
            // Since, firebaseCloud function required payment option and we do not have a custome backend application
            // We will temperory do the location filter in frontend.

            // if (!!lastVisibleDocument) {
            //     popularService = firestore()
            //         .collection('serviceProviders')
            //         .limit(10)
            //         // Filter results
            //         .orderBy('popularity.AUG_2021', 'desc')
            //         .startAfter(lastVisibleDocument);
            // } else {
            //     popularService = firestore()
            //         .collection('serviceProviders')
            //         .limit(10)
            //         // Filter results
            //         .orderBy('popularity.AUG_2021', 'desc');
            // }

            var serviceProviderCollection = firestore()
                .collection('serviceProviders')
                .orderBy(`popularity.${moment().format('MMM_YYYY').toUpperCase()}`, 'desc');

            var providerWithinAreaOfCustomerLocation = [];

            serviceProviderCollection
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        console.log('last visible document');
                        console.log(lastVisibleDocument);
                        try {
                            var popularServices = [];

                            querySnapshot.forEach(docSnapshot => {
                                let provider = {
                                    id: docSnapshot.id,
                                    ...docSnapshot.data(),
                                };
                                let providerCoverageDistance = provider.serviceCoverage.coverageDistance;
                                let providerCoor = provider.serviceCoverage.addressCoor;

                                let userCoor = store.getState().loginState.userInfo.serviceAddress.addressCoor;

                                let lowLatThreshold = userCoor.latitude - latDegreeFor1Km * providerCoverageDistance;
                                let lowLonThreshold = userCoor.longitude - lonDegreeFor1Km * providerCoverageDistance;

                                let highLatThreshold = userCoor.latitude + latDegreeFor1Km * providerCoverageDistance;
                                let highLonThreshold = userCoor.longitude + lonDegreeFor1Km * providerCoverageDistance;

                                console.log(providerCoor.latitude + ',' + providerCoor.longitude);
                                //Location Filter, Temperatory here.
                                if (
                                    providerCoor.latitude > lowLatThreshold &&
                                    providerCoor.latitude < highLatThreshold &&
                                    providerCoor.longitude > lowLonThreshold &&
                                    providerCoor.longitude < highLonThreshold
                                )
                                    providerWithinAreaOfCustomerLocation.push(provider);
                            });

                            const paginationLimit = 10;

                            if (!!lastVisibleDocument) {
                                lastVisibleDocumentIndex = providerWithinAreaOfCustomerLocation.findIndex(element => {
                                    return element.id == lastVisibleDocument.id;
                                });

                                popularServices = providerWithinAreaOfCustomerLocation.slice(
                                    lastVisibleDocumentIndex + 1,
                                    lastVisibleDocumentIndex + 1 + paginationLimit,
                                );
                            } else {
                                popularServices = providerWithinAreaOfCustomerLocation.slice(0, paginationLimit);
                            }
                            var result = {};

                            if (popularServices.length > 0) {
                                result = {
                                    lastVisibleDocument: popularServices[popularServices.length - 1],
                                    data: popularServices,
                                };
                            } else {
                                result = {
                                    lastVisibleDocument: lastVisibleDocument,
                                    data: [],
                                };
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        resolve(result);
                    } else {
                        const result = {
                            lastVisibleDocument: lastVisibleDocument,
                            data: [],
                        };

                        resolve(result);
                    }
                })
                .catch(error => {
                    console.log('Error -> ProviderService.getPopularServiceOfTheMonthWithPagination\n');
                    reject(error);
                });
        });
    },
    getProviderJoinedInLast30DayWithPagination: (lastVisibleDocument = null) => {
        return new Promise((resolve, reject) => {
            let popularService = null;
            // Firebase does not support query that uses a fieldvalue.
            // In our case, we need serviceCoverage field value when querying the service providers within the area of customer doorstep
            // Its is best to be done using firebaseCloud function or a custom backend server with firebase admin SDK.
            // Since, firebaseCloud function required payment option and we do not have a custome backend application
            // We will temperory do the location filter in frontend.

            // if (!!lastVisibleDocument) {
            //     popularService = firestore()
            //         .collection('serviceProviders')
            //         .limit(10)
            //         // Filter results
            //         .orderBy('popularity.AUG_2021', 'desc')
            //         .startAfter(lastVisibleDocument);
            // } else {
            //     popularService = firestore()
            //         .collection('serviceProviders')
            //         .limit(10)
            //         // Filter results
            //         .orderBy('popularity.AUG_2021', 'desc');
            // }

            var serviceProviderCollection = firestore()
                .collection('serviceProviders')
                .where(
                    'firstJoined',
                    '>',
                    firestore.Timestamp.fromDate(moment().startOf('day').subtract(30, 'days').toDate()),
                )
                .orderBy(`firstJoined`, 'desc');

            var providerWithinAreaOfCustomerLocation = [];

            serviceProviderCollection
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        console.log('last visible document');
                        console.log(lastVisibleDocument);
                        try {
                            var popularServices = [];

                            querySnapshot.forEach(docSnapshot => {
                                let provider = {
                                    id: docSnapshot.id,
                                    ...docSnapshot.data(),
                                    firstJoined: docSnapshot.data().firstJoined.toDate().toString(),
                                };
                                let providerCoverageDistance = provider.serviceCoverage.coverageDistance;
                                let providerCoor = provider.serviceCoverage.addressCoor;

                                let userCoor = store.getState().loginState.userInfo.serviceAddress.addressCoor;

                                let lowLatThreshold = userCoor.latitude - latDegreeFor1Km * providerCoverageDistance;
                                let lowLonThreshold = userCoor.longitude - lonDegreeFor1Km * providerCoverageDistance;

                                let highLatThreshold = userCoor.latitude + latDegreeFor1Km * providerCoverageDistance;
                                let highLonThreshold = userCoor.longitude + lonDegreeFor1Km * providerCoverageDistance;

                                console.log(providerCoor.latitude + ',' + providerCoor.longitude);
                                //Location Filter, Temperatory here.
                                if (
                                    providerCoor.latitude > lowLatThreshold &&
                                    providerCoor.latitude < highLatThreshold &&
                                    providerCoor.longitude > lowLonThreshold &&
                                    providerCoor.longitude < highLonThreshold
                                )
                                    providerWithinAreaOfCustomerLocation.push(provider);
                            });

                            const paginationLimit = 10;

                            if (!!lastVisibleDocument) {
                                lastVisibleDocumentIndex = providerWithinAreaOfCustomerLocation.findIndex(element => {
                                    return element.id == lastVisibleDocument.id;
                                });

                                popularServices = providerWithinAreaOfCustomerLocation.slice(
                                    lastVisibleDocumentIndex + 1,
                                    lastVisibleDocumentIndex + 1 + paginationLimit,
                                );
                            } else {
                                popularServices = providerWithinAreaOfCustomerLocation.slice(0, paginationLimit);
                            }
                            var result = {};

                            if (popularServices.length > 0) {
                                result = {
                                    lastVisibleDocument: popularServices[popularServices.length - 1],
                                    data: popularServices,
                                };
                            } else {
                                result = {
                                    lastVisibleDocument: lastVisibleDocument,
                                    data: [],
                                };
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        resolve(result);
                    } else {
                        const result = {
                            lastVisibleDocument: lastVisibleDocument,
                            data: [],
                        };

                        resolve(result);
                    }
                })
                .catch(error => {
                    console.log('Error -> ProviderService.getPopularServiceOfTheMonthWithPagination\n');
                    reject(error);
                });
        });
    },
    getAllPost: (userId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            let popularService = firestore().collection('posts');

            popularService
                .where('userId', '==', userId)
                .orderBy('postedDateTime', 'desc')
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const popularServices = [];

                        querySnapshot.forEach(docSnapshot => {
                            let service = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                            };
                            popularServices.push(service);
                        });

                        const result = {
                            data: popularServices,
                        };

                        resolve(result);
                    } else {
                        const result = {
                            data: [],
                        };

                        resolve(result);
                    }
                })
                .catch(error => {
                    console.log('Error -> ProviderService.getPopularServiceOfTheMonthWithPagination\n');
                    reject(error);
                });
        });
    },
    getProviderByBusinessCategory: businessCategory => {
        return new Promise((resolve, reject) => {
            let providerCollection = firestore().collection('serviceProviders');

            providerCollection
                .where('businessCategory', '==', businessCategory)
                .orderBy('businessName')
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const serviceProviders = [];

                        querySnapshot.forEach(docSnapshot => {
                            let provider = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                            };
                            let providerCoverageDistance = provider.serviceCoverage.coverageDistance;
                            let providerCoor = provider.serviceCoverage.addressCoor;

                            let userCoor = store.getState().loginState.userInfo.serviceAddress.addressCoor;

                            let lowLatThreshold = userCoor.latitude - latDegreeFor1Km * providerCoverageDistance;
                            let lowLonThreshold = userCoor.longitude - lonDegreeFor1Km * providerCoverageDistance;

                            let highLatThreshold = userCoor.latitude + latDegreeFor1Km * providerCoverageDistance;
                            let highLonThreshold = userCoor.longitude + lonDegreeFor1Km * providerCoverageDistance;

                            //Location Filter, Temperatory here.
                            if (
                                providerCoor.latitude > lowLatThreshold &&
                                providerCoor.latitude < highLatThreshold &&
                                providerCoor.longitude > lowLonThreshold &&
                                providerCoor.longitude < highLonThreshold
                            )
                                serviceProviders.push(provider);
                        });

                        const result = {
                            data: serviceProviders,
                        };

                        resolve(result);
                    } else {
                        const result = {
                            data: [],
                        };

                        resolve(result);
                    }
                })
                .catch(error => {
                    console.log('Error -> ProviderService.getProviderByBusinessCategory\n');
                    reject(error);
                });
        });
    },
    getProviderByServiceType: serviceType => {
        return new Promise((resolve, reject) => {
            let providerCollection = firestore().collection('serviceProviders');

            providerCollection
                .where('serviceType', '==', serviceType)
                .orderBy('businessName')
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const serviceProviders = [];

                        querySnapshot.forEach(docSnapshot => {
                            let provider = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                            };
                            let providerCoverageDistance = provider.serviceCoverage.coverageDistance;
                            let providerCoor = provider.serviceCoverage.addressCoor;

                            let userCoor = store.getState().loginState.userInfo.serviceAddress.addressCoor;

                            let lowLatThreshold = userCoor.latitude - latDegreeFor1Km * providerCoverageDistance;
                            let lowLonThreshold = userCoor.longitude - lonDegreeFor1Km * providerCoverageDistance;

                            let highLatThreshold = userCoor.latitude + latDegreeFor1Km * providerCoverageDistance;
                            let highLonThreshold = userCoor.longitude + lonDegreeFor1Km * providerCoverageDistance;

                            console.log(
                                providerCoor.latitude +
                                    ',' +
                                    providerCoor.longitude +
                                    '<<PRovider     low>>' +
                                    lowLatThreshold +
                                    ',' +
                                    lowLonThreshold +
                                    '   high>>' +
                                    highLatThreshold +
                                    ',' +
                                    highLonThreshold,
                            );
                            //Location Filter
                            if (
                                providerCoor.latitude > lowLatThreshold &&
                                providerCoor.latitude < highLatThreshold &&
                                providerCoor.longitude > lowLonThreshold &&
                                providerCoor.longitude < highLonThreshold
                            )
                                serviceProviders.push(provider);
                        });

                        const result = {
                            data: serviceProviders,
                        };

                        resolve(result);
                    } else {
                        const result = {
                            data: [],
                        };

                        resolve(result);
                    }
                })
                .catch(error => {
                    console.log('Error -> ProviderService.getProviderByServiceType\n');
                    reject(error);
                });
        });
    },
    getProviderById: (callback, documentId) => {
        let serviceProviderCollections = firestore().collection('serviceProviders');

        return serviceProviderCollections.doc(documentId).onSnapshot(docSnapshot => {
            if (docSnapshot.exists) {
                let providerData = {
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                    firstJoined: docSnapshot.data().firstJoined.toDate().toString(),
                };

                callback(providerData);
            } else {
                callback(null);
            }
        });
    },
    getProviderByIdOneTimeRead: documentId => {
        return new Promise((resolve, reject) => {
            let serviceProviderCollections = firestore().collection('serviceProviders');

            serviceProviderCollections
                .doc(documentId)
                .get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        let data = {
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
                            firstJoined: documentSnapshot.data().firstJoined.toDate().toString(),
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
    setProviderData: (data, documentId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            const serviceProvidersCollection = firestore().collection('serviceProviders');

            serviceProvidersCollection
                .doc(documentId)
                .set({
                    ...data,
                })
                .then(() => {
                    resolve('Service Provider data successfully updated!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    updateProviderData: (data, documentId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            const serviceProvidersCollection = firestore().collection('serviceProviders');

            serviceProvidersCollection
                .doc(documentId)
                .update({
                    ...data,
                })
                .then(() => {
                    console.log('Service Provider data successfully updated!');
                    resolve('Service Provider data successfully updated!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    updateProviderTotalEarningAndNumOfJobCompleted: paymentReceived => {
        return new Promise((resolve, reject) => {
            popularityInCurrentMonth =
                store.getState().loginState.providerInfo.popularity[moment().format('MMM_YYYY').toUpperCase()];
            ProviderService.updateProviderData({
                totalEarnings: firebase.firestore.FieldValue.increment(paymentReceived),
                jobsCompleted: firebase.firestore.FieldValue.increment(1),
                [`popularity.${moment().format('MMM_YYYY').toUpperCase()}`]: !!popularityInCurrentMonth
                    ? firebase.firestore.FieldValue.increment(1)
                    : 1,
            })
                .then(data => {
                    resolve('success');
                })
                .catch(err => {
                    reject('failed');
                });
        });
    },
    uploadCoverImageToStorage: (userId, coverImagePath, mimeType) => {
        return new Promise((resolve, reject) => {
            var coverImageReference = null;

            if (mimeType == 'image/jpeg') {
                coverImageReference = storage().ref(`userData/${userId}/coverImage.png`);
            } else {
                coverImageReference = storage().ref(`userData/${userId}/coverImage.jpg`);
            }
            console.log('uploadCoverImageToStorage using ', coverImagePath);
            coverImageReference
                .putFile(coverImagePath)
                .then(data => {
                    console.log('uploaded cover image');
                    coverImageReference
                        .getDownloadURL()
                        .then(url => {
                            //from url you can fetched the uploaded image easily
                            console.log('retrieved download url ', url);
                            resolve(url);
                        })
                        .catch(err => {
                            reject('Provider Service - Error occured when getting image url.');
                            console.log('Provider Service - Error occured when getting image url.');
                            console.log(err);
                        });
                })
                .catch(err => {
                    reject('Provider Service - Error occured when uploading image.');
                    console.log('Provider Service - Error occured when uploading image.');
                    console.log(err);
                });
        });
    },
    useDefaultCoverImage: (userId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            ProviderService.updateProviderData({
                coverImgUrl: null,
            },userId)
                .then(() => {
                    ProviderService.fetchProviderDataToRedux();
                    resolve('done');
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    uploadBusinessLogoToStorage: (userId, businessLogoPath, mimeType) => {
        return new Promise((resolve, reject) => {
            var businessLogoImageReference = null;

            if (mimeType == 'image/jpeg') {
                businessLogoImageReference = storage().ref(`userData/${userId}/businessLogo.png`);
            } else {
                businessLogoImageReference = storage().ref(`userData/${userId}/businessLogo.jpg`);
            }

            businessLogoImageReference
                .putFile(businessLogoPath)
                .then(data => {
                    businessLogoImageReference
                        .getDownloadURL()
                        .then(url => {
                            //from url you can fetched the uploaded image easily
                            resolve(url);
                        })
                        .catch(err => {
                            reject('Provider Service - Error occured when getting business logo image url.');
                            console.log('Provider Service - Error occured when getting business logo image url.');
                            console.log(err);
                        });
                })
                .catch(err => {
                    reject('Provider Service - Error occured when uploading business logo image.');
                    console.log('Provider Service - Error occured when uploading business logo image.');
                    console.log(err);
                });
        });
    },
    useDefaultBusinessLogo: (userId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            ProviderService.updateProviderData({
                businessLogoUrl: null,
            },userId)
                .then(() => {
                    ProviderService.fetchProviderDataToRedux();
                    resolve('done');
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },
    uploadPostImageToStorage: (userId, postId, postImagePath, mimeType) => {
        return new Promise((resolve, reject) => {
            var postImageLogoRef = null;

            if (mimeType == 'image/jpeg') {
                postImageLogoRef = storage().ref(`userData/${userId}/postImage/${postId}.png`);
            } else {
                postImageLogoRef = storage().ref(`userData/${userId}/postImage/${postId}.png`);
            }

            postImageLogoRef
                .putFile(postImagePath)
                .then(data => {
                    postImageLogoRef
                        .getDownloadURL()
                        .then(url => {
                            //from url you can fetched the uploaded image easily
                            resolve(url);
                        })
                        .catch(err => {
                            reject('Provider Service - Error occured when getting post image url.');
                            console.log('Provider Service - Error occured when getting post image url.');
                            console.log(err);
                        });
                })
                .catch(err => {
                    reject('Provider Service - Error occured when uploading post image.');
                    console.log('Provider Service - Error occured when uploadingpost image.');
                    console.log(err);
                });
        });
    },
    getPost: documentId => {
        return new Promise((resolve, reject) => {
            let postCollections = firestore().collection('posts');

            postCollections
                .doc(documentId)
                .get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        let data = {
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
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
    createPost: (data, userId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            const postsCollection = firestore().collection('posts');
            const newDocumentId = postsCollection.doc().id;

            const {postImage, ...othersData} = data;

            ProviderService.uploadPostImageToStorage(userId, newDocumentId, postImage.path, postImage.mime)
                .then(postImageUrl => {
                    postsCollection
                        .doc(newDocumentId)
                        .set({
                            ...othersData,
                            postedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
                            userId: userId,
                            imageUrl: postImageUrl,
                        })
                        .then(() => {
                            resolve('Successfully created a post updated!');
                        })
                        .catch(err => {
                            console.log(err);
                            reject('Some error occur');
                        });
                })
                .catch(error => {
                    reject('error occurs');
                    console.log('error occure when createing post');
                });
        });
    },
    updatePost: (data, documentId) => {
        return new Promise((resolve, reject) => {
            const postsCollection = firestore().collection('posts');

            postsCollection
                .doc(documentId)
                .update({
                    ...data,
                })
                .then(() => {
                    resolve('post data successfully updated!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    deletePost: documentId => {
        return new Promise((resolve, reject) => {
            const postsCollection = firestore().collection('posts');

            postsCollection
                .doc(documentId)
                .delete()
                .then(() => {
                    resolve('Successfully deleted a post!');
                })
                .catch(error => {
                    reject('error occurs');
                    console.log('some error occur when deleting post');
                });
        });
    },
    updatePhoneNumber: (documentId, phoneNumber) => {
        return new Promise(async (resolve, reject) => {
            const providersCollection = firestore().collection('serviceProviders');

            providersCollection
                .doc(documentId)
                .update({
                    phoneNumber: phoneNumber,
                })
                .then(() => {
                    resolve('Successfully updated');
                })
                .catch(err => {
                    console.log(err);
                    providersCollection
                        .doc(documentId)
                        .set({
                            phoneNumber: phoneNumber,
                        })
                        .then(() => {
                            resolve('Successfully updated');
                        })
                        .catch(error => {
                            console.log(error);
                            reject('Some error occur');
                        });
                });
        });
    },
    fetchProviderDataToRedux: () => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('fetching logged in provider data into redux ...');
                if (auth().currentUser == null) {
                    reject('User not logged in');
                }

                console.log(auth().currentUser.uid);
                const currentServiceProvider = await firestore()
                    .collection('serviceProviders')
                    .doc(auth().currentUser.uid)
                    .get();

                if (!currentServiceProvider.exists) {
                    throw 'user document does not exist';
                }

                const loggedInProviderData = {
                    ...currentServiceProvider.data(),

                    firstJoined: currentServiceProvider.data().firstJoined.toDate().toString(),
                };

                store.dispatch(setProviderInfo(loggedInProviderData));

                resolve('Finish fetching');
            } catch (error) {
                console.log(error);
                UserService.logOut();
                reject('Some Error occurs');
            }
        });
    },
};

export default ProviderService;
