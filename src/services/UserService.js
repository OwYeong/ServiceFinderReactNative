import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
            console.log(documentId)
            usersCollection
                .doc(documentId)
                .set({
                    ...data
                })
                .then(() => {
                    resolve('User Succesfully Registered!');
                })
                .catch(err=>{
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
};

export default UserService;
