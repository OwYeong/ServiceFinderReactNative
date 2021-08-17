import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';

import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk-next';

const UserService = {
    registerAccount: (firstName, lastName, email, password) => {
        return new Promise((resolve, reject) => {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(authUser => {
                    console.log('User account created & signed in!');
                    console.log(authUser);

                    const usersCollection = firestore().collection('users');

                    usersCollection
                        .doc(authUser.uid)
                        .set({
                            firstName: firstName,
                            lastName: lastName,
                            loginType: Constants.LOGIN_PROVIDER_FIREBASE,
                        })
                        .then(() => {
                            resolve('User Succesfully Registered!');
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
    updateUserData: (data, documentId) => {
        return new Promise((resolve, reject) => {
            const usersCollection = firestore().collection('users');
            console.log(documentId);
            usersCollection
                .doc(documentId)
                .set({
                    ...data,
                })
                .then(() => {
                    resolve('User Succesfully Registered!');
                })
                .catch(err => {
                    console.log(err);
                    reject('Some error occur');
                });
        });
    },
    isEmailAlreadyRegistered: email => {
        return new Promise((resolve, reject) => {
            auth()
                .fetchSignInMethodsForEmail(email)
                .then(listOfSignInMethod => {
                    if (listOfSignInMethod.indexOf('password') > -1) {
                        //email already exist
                        console.log('email already exist');
                        resolve(true);
                    }

                    resolve(false);
                })
                .catch(err => {
                    console.log('err');
                    console.log(err);
                    reject(false);
                });
        });
    },
    signInWithGmail: () => {
        return new Promise(async (resolve, reject) => {
            try {
                await GoogleSignin.hasPlayServices();
                console.log('gmail trying');
                const {accessToken, idToken} = await GoogleSignin.signIn();
                console.log('gmail trying');

                const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);

                auth()
                    .signInWithCredential(credential)
                    .then(auth => {
                        console.log('gmail inside');
                        console.log(auth);
                        UserService.updateUserData(
                            {
                                firstName: auth.additionalUserInfo.profile.family_name,
                                lastName: auth.additionalUserInfo.profile.given_name,
                                loginProvider: Constants.LOGIN_PROVIDER_GOOGLE,
                            },
                            auth.user.uid,
                        )
                            .then(data => {
                                resolve('Success');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
            } catch (error) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // user cancelled the login flow
                    reject('Google login process has been cancelled.');
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    reject('Signin in progress');
                    // operation (f.e. sign in) is in progress already
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    reject('PLAY_SERVICES_NOT_AVAILABLE');
                    // play services not available or outdated
                } else {
                    // some other error happened
                }
            }
        });
    },
    signInWithFacebook: async () => {
        return new Promise(async (resolve, reject) => {
            try {
                // Login the User and get his public profile and email id.
                const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                // If the user cancels the login process, the result will have a
                // isCancelled boolean set to true. We can use that to break out of this function.
                if (result.isCancelled) {
                    throw 'Facebook login process has been cancelled. Please try again';
                }

                // Get the Access Token
                const data = await AccessToken.getCurrentAccessToken();

                // If we don't get the access token, then something has went wrong.
                if (!data) {
                    throw 'Facebook login process has encounter an error when obtaining the access token';
                }

                // Use the Access Token to create a facebook credential.
                const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                auth()
                    .signInWithCredential(facebookCredential)
                    .then(auth => {
                        UserService.updateUserData(
                            {
                                firstName: auth.additionalUserInfo.profile.first_name,
                                lastName: auth.additionalUserInfo.profile.last_name,
                                loginProvider: Constants.LOGIN_PROVIDER_FACEBOOK,
                            },
                            auth.user.uid,
                        )
                            .then(data => {
                                resolve('success');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
            } catch (error) {
                reject(error);
            }
        });
    },
    signOut: () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (auth().currentUser == null) {
                    return; //already sign out
                }

                const currentUser = await firestore().collection('users').doc(auth().currentUser.uid).get();

                if (currentUser.data().loginProvider == Constants.LOGIN_PROVIDER_GOOGLE) {
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                }

                auth()
                    .signOut()
                    .then(() => resolve('Logout success'));
            } catch (error) {
                reject('Some Error occurs');
            }
        });
    },
};

export default UserService;
