import firestore from '@react-native-firebase/firestore';

const ProviderService = {
    getPopularServiceOfTheMonthWithPagination: (lastVisibleDocument = null) => {
        return new Promise((resolve, reject) => {
            let popularService = null;

            if (!!lastVisibleDocument) {
                popularService = firestore()
                    .collection('serviceProviders')
                    .limit(2)
                    // Filter results
                    .orderBy('popularity.AUG_2021', 'desc')
                    .startAfter(lastVisibleDocument);
            } else {
                popularService = firestore()
                    .collection('serviceProviders')
                    .limit(2)
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
};

export default ProviderService;
