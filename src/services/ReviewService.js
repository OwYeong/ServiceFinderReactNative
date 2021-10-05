import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';

const ReviewService = {
    getAllReview: (providerId = auth().currentUser.uid) => {
        return new Promise((resolve, reject) => {
            let reviewCollection = firestore().collection('reviews');
            reviewCollection
                .where('serviceProviderId', '==', providerId)
                .orderBy('postedDateTime', 'desc')
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const reviews = [];

                        querySnapshot.forEach(docSnapshot => {
                            let review = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                                postedDateTime: docSnapshot.data().postedDateTime.toDate().toString(),
                            };
                            reviews.push(review);
                        });

                        const result = {
                            data: reviews,
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
                    console.log('Error -> ReviewService.getAllReview\n');
                    reject(error);
                });
        });
    },
};

export default ReviewService;
