import firestore from '@react-native-firebase/firestore';

const SearchService = {
    getAllServiceCategory: () => {
        return new Promise((resolve, reject) => {
            const serviceCategories = firestore().collection('serviceCategories');

            serviceCategories
                .get()
                .then(querySnapshot => {
                    const serviceCategories = [];

                    querySnapshot.forEach(docSnapshot => {
                        let service = {
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        };
                        serviceCategories.push(service);
                    });

                    resolve(serviceCategories);
                })
                .catch(error => {
                    console.log('Error -> SearchService.getAllServiceCategory\n');
                    reject(error);
                });
        });
    },
};

export default SearchService;
