import firestore from '@react-native-firebase/firestore';

const ProviderService = {
    getPopularServiceOfTheMonthWithPagination: (lastVisibleDocument = null) => {
        return new Promise((resolve, reject) => {
            const popularService = firestore()
                .collection('serviceProviders')
                // Filter results
                .orderBy('popularity.AUG_2021', 'desc')
                .limit(25);

            if (!!lastVisibleDocument) {
                popularService.startAfter(lastVisibleDocument);
            }

            popularService
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        const newLastVisibleDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
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
