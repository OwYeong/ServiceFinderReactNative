import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';

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
    registerVendorAccount: (firstName, lastName, email, password) => {
        return new Promise((resolve, reject) => {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(authUser => {
                    console.log('Vendor account created & signed in!');
                    console.log(authUser);

                    store.dispatch(setLoginBlock(true));

                    const usersCollection = firestore().collection('users');

                    usersCollection
                        .doc(authUser.user.uid)
                        .set({
                            firstName: firstName,
                            lastName: lastName,
                            accType: Constants.ACCOUNT_TYPE.VENDOR,
                            loginProvider: Constants.LOGIN_PROVIDER_FIREBASE,
                        })
                        .then(() => {});

                    //update user display name for email verification
                    authUser.user
                        .updateProfile({
                            displayName: firstName + ' ' + lastName,
                        })
                        .then(() => {
                            //Send email verification
                            authUser.user
                                .sendEmailVerification()
                                .then(result => {
                                    console.log('Verification email successfully sent');

                                    //Signout silently as the account is automatically sign in when creating.
                                    auth()
                                        .signOut()
                                        .then(() => {
                                            console.log('Silently Logged out.');
                                            resolve('Silent loggout');
                                        })
                                        .catch(err => {
                                            console.log('Silent Loggout Error.');
                                        });
                                })
                                .catch(error => {
                                    console.log('Error occured when sending email verification.');
                                    console.log(error);
                                });
                        })
                        .catch(error => {
                            // An error occurred
                            // ...
                        });
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        reject('Email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        reject('Email address is invalid!');
                    }
                });
        });
    },
};

export default ProviderService;
