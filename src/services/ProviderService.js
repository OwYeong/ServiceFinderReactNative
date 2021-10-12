import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';

const ProviderService = {
    getPopularServiceOfTheMonthWithPagination: (lastVisibleDocument = null) => {
        return new Promise((resolve, reject) => {
            let popularService = null;

            if (!!lastVisibleDocument) {
                popularService = firestore()
                    .collection('serviceProviders')
                    .limit(10)
                    // Filter results
                    .orderBy('popularity.AUG_2021', 'desc')
                    .startAfter(lastVisibleDocument);
            } else {
                popularService = firestore()
                    .collection('serviceProviders')
                    .limit(10)
                    // Filter results
                    .orderBy('popularity.AUG_2021', 'desc');
            }

            popularService
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const newLastVisibleDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
                        console.log('last visible document');
                        console.log(newLastVisibleDocument.data());
                        const popularServices = [];

                        querySnapshot.forEach(docSnapshot => {
                            let service = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                            };
                            popularServices.push(service);
                        });

                        const result = {
                            lastVisibleDocument: newLastVisibleDocument,
                            data: popularServices,
                        };

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
                    console.log('Service Provider data successfully updated!')
                    resolve('Service Provider data successfully updated!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    updateProviderTotalEarningAndNumOfJobCompleted: (paymentReceived) => {
        return new Promise((resolve, reject) => {
            
            ProviderService.updateProviderData({
                totalEarnings: firebase.firestore.FieldValue.increment(paymentReceived),
                jobsCompleted: firebase.firestore.FieldValue.increment(1),
            }).then(data=>{
                resolve('success');
            }).catch(err=>{
                reject('failed')
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
    getPost: (documentId) => {
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
    deletePost: (documentId) => {
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
