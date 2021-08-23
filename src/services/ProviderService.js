import firestore from '@react-native-firebase/firestore';

const ProviderService = {
    getPopularServiceOfTheMonth: () => {
        firestore()
            .collection('serviceProviders')
            // Filter results
            .orderBy('popularity.AUG_2021', 'desc')
            .get()
            .then(querySnapshot => {
                /* ... */
                console.log('--------------------')
                querySnapshot.forEach(function(documentSnapshot) { 
                    console.log(documentSnapshot.data());
                });
            });
    },
};

export default ProviderService;