import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';

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
    updateProviderData: (data, documentId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            const serviceProvidersCollection = firestore().collection('serviceProviders');
            
            serviceProvidersCollection
                .doc(documentId)
                .set({
                    ...data,
                })
                .then(() => {
                    resolve('Service Provider data successfully upadated!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    uploadCoverImageToStorage: (userId, coverImagePath, mimeType ) => {
        return new Promise((resolve, reject) => {
            var coverImageReference = null;

            if (mimeType == 'image/jpeg') {
                coverImageReference = storage().ref(`userData/${userId}/coverImage.png`);
            } else {
                coverImageReference = storage().ref(`userData/${userId}/coverImage.jpg`);
            }
            console.log('uploadCoverImageToStorage using ', coverImagePath)
            coverImageReference
                .putFile(coverImagePath)
                .then(data => {
                    console.log('uploaded cover image')
                    coverImageReference
                        .getDownloadURL()
                        .then(url => {
                            //from url you can fetched the uploaded image easily
                            console.log('retrieved download url ', url)
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
    uploadBusinessLogoToStorage: (userId, businessLogoPath,mimeType) => {
        return new Promise((resolve, reject) => {
            var businessLogoImageReference = null;

            if (mimeType == 'image/jpeg') {
                businessLogoImageReference = storage().ref(`userData/${userId}/coverImage.png`);
            } else {
                businessLogoImageReference = storage().ref(`userData/${userId}/coverImage.jpg`);
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
};

export default ProviderService;
