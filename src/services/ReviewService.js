import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Constants} from '~constants';
import storage from '@react-native-firebase/storage';
import {setProviderInfo} from '@slices/loginSlice';
import store from '../../store';
import UserService from './UserService';
import firebase from '@react-native-firebase/app';
import NotificationService from './NotificationService';
import ProviderService from './ProviderService';
import RequestService from './RequestService';

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
    getReviewByRequestId: requestId => {
        return new Promise((resolve, reject) => {
            let reviewCollection = firestore().collection('reviews');
            reviewCollection
                .where('requestId', '==', requestId)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        let review = {};
                        querySnapshot.forEach(docSnapshot => {
                            review = {
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                                postedDateTime: docSnapshot.data().postedDateTime.toDate().toString(),
                            };
                        });

                        resolve(review);
                    } else {
                        resolve(null);
                    }
                })
                .catch(error => {
                    console.log('Error -> ReviewService.getReviewById\n');
                    reject(error);
                });
        });
    },
    createReview: data => {
        return new Promise((resolve, reject) => {
            try {
                const reviewsCollection = firestore().collection('reviews');

                reviewsCollection
                    .add({
                        ...data,
                    })
                    .then(async docRef => {
                        console.log('Request data successfully created!');

                        try {
                            const targetUserInfo = await UserService.getUserInfo(data.serviceProviderId);

                            if (!!targetUserInfo.fcmToken) {
                                console.log('sending notification to' + targetUserInfo.fcmToken);

                                await NotificationService.sendNotificationToDevice(
                                    targetUserInfo.fcmToken,
                                    `You have received an new reviews`,
                                    `You have received an ${data.numOfStar} star review from your customer.`,
                                );
                            }
                            //Update Request
                            await RequestService.updateRequest({isReviewSubmitted: true}, data.requestId);

                            const providerInfo = await ProviderService.getProviderByIdOneTimeRead(
                                data.serviceProviderId,
                            );

                            const oldTotalNumOfReview = Object.values(providerInfo.starStats).reduce((a, b) => a + b);
                            //Formula to calculate average without knowing total sum. adopted from https://math.stackexchange.com/questions/2759743/calculating-average-without-knowing-number-of-elements
                            const newAverageRating =
                                (oldTotalNumOfReview * providerInfo.averageRatings + data.numOfStar) /
                                (oldTotalNumOfReview + 1);
                            await ProviderService.updateProviderData(
                                {
                                    averageRatings: newAverageRating,
                                    [`starStats.numOf${data.numOfStar}Star`]:
                                        firebase.firestore.FieldValue.increment(1),
                                },
                                data.serviceProviderId,
                            );

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
                console.log('errr');
                console.log(err);
            }
        });
    },
};

export default ReviewService;
