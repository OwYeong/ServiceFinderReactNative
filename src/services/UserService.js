import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';

import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk-next';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '@slices/loginSlice';
import {setLoginBlock} from '@slices/appSlice';
import store from '../../store';

const UserService = {
    registerAccount: (firstName, lastName, email, password) => {
        return new Promise((resolve, reject) => {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(authUser => {
                    console.log('User account created & signed in!');
                    console.log(authUser);

                    store.dispatch(setLoginBlock(true));

                    const usersCollection = firestore().collection('users');

                    usersCollection
                        .doc(authUser.user.uid)
                        .set({
                            firstName: firstName,
                            lastName: lastName,
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
                                    console.log('verification email successfully sent');

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
    createUserDataIfNotExist: (data, documentId) => {
        return new Promise(async (resolve, reject) => {
            const usersCollection = firestore().collection('users');

            let document = await usersCollection.doc(documentId).get();

            if (!!document && document.exists) {
                //Already exist
                resolve('document already exist');
                return;
            }

            usersCollection
                .doc(documentId)
                .set({
                    ...data,
                })
                .then(() => {
                    resolve('User data created');
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
    signInWithEmail: (email, password) => {
        return new Promise(async (resolve, reject) => {
            store.dispatch(setLoginBlock(true));
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(authUser => {
                    console.log(authUser);
                    if (!authUser.user.emailVerified) {
                        

                        //Signout silently as the account is automatically sign in when creating.
                        auth()
                            .signOut()
                            .then(() => {
                                console.log('Silently Logged outz.');
                                reject('Please verify your email and try again.');
                            })
                            .catch(err => {
                                console.log('Silent Loggout Error.');
                            });

                        return;
                    }
                    
                    store.dispatch(setLoginBlock(false));
                    resolve('Success');
                })
                .catch(error => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error);

                    reject('The email or password is incorrect.');
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
                    .then(authUser => {
                        console.log('gmail inside');
                        console.log(authUser);
                        UserService.createUserDataIfNotExist(
                            {
                                firstName: authUser.additionalUserInfo.profile.family_name,
                                lastName: authUser.additionalUserInfo.profile.given_name,
                                email: authUser.additionalUserInfo.profile.email,
                                loginProvider: Constants.LOGIN_PROVIDER_GOOGLE,
                            },
                            authUser.user.uid,
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
                    .then(authUser => {
                        UserService.createUserDataIfNotExist(
                            {
                                firstName: authUser.additionalUserInfo.profile.first_name,
                                lastName: authUser.additionalUserInfo.profile.last_name,
                                email: authUser.additionalUserInfo.profile.email,
                                loginProvider: Constants.LOGIN_PROVIDER_FACEBOOK,
                            },
                            authUser.user.uid,
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
    logOut: () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (auth().currentUser == null) {
                    return; //already sign out
                }
                console.log('my uid is ' + auth().currentUser.uid);
                const currentUser = await firestore().collection('users').doc(auth().currentUser.uid).get();

                if (currentUser.data().loginProvider == Constants.LOGIN_PROVIDER_GOOGLE) {
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                }

                auth()
                    .signOut()
                    .then(() => resolve('Logout success'));
            } catch (error) {
                console.log(error);
                reject('Some Error occurs');
            }
        });
    },
    fetchLoggedInUserDataToRedux: () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (auth().currentUser == null) {
                    reject('User not logged in');
                }

                const currentUserEmail = auth().currentUser.email;

                const currentUser = await firestore().collection('users').doc(auth().currentUser.uid).get();

                const loggedInUserData = {
                    email: currentUserEmail,
                    ...currentUser.data(),
                };

                store.dispatch(setUserInfo(loggedInUserData));
            } catch (error) {
                reject('Some Error occurs');
            }
        });
    },
};

export default UserService;