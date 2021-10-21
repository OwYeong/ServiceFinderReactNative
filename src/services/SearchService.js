import firestore from '@react-native-firebase/firestore';
import CommonFunction from '@utils/CommonFunction';
import store from '../../store';

// ~1 km of lat and lon in degrees (not 100% accurate, approximately only)
//adopted from : https://stackoverflow.com/questions/4000886/gps-coordinates-1km-square-around-a-point
let latDegreeFor1Km = 0.008983;
let lonDegreeFor1Km = 0.01506;

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
    searchProviderInCustomerLocation: (searchKeyword = '', lastVisibleDocument = null) => {
        return new Promise((resolve, reject) => {
            // let searchResult = null;
            // Firebase does not support query that uses a fieldvalue.
            // In our case, we need serviceCoverage field value when querying the service providers within the area of customer doorstep
            // Its is best to be done using firebaseCloud function or a custom backend server with firebase admin SDK.
            // Since, firebaseCloud function required payment option and we do not have a custome backend application
            // We will temperory do the location filter in frontend.

            // if (!!lastVisibleDocument) {
            //     popularService = firestore()
            //         .collection('serviceProviders')
            //         .limit(10)
            //         // Filter results
            //         .orderBy('popularity.AUG_2021', 'desc')
            //         .startAfter(lastVisibleDocument);
            // } else {
            //     popularService = firestore()
            //         .collection('serviceProviders')
            //         .limit(10)
            //         // Filter results
            //         .orderBy('popularity.AUG_2021', 'desc');
            // }

            var serviceProviderCollection = firestore().collection('serviceProviders').orderBy('businessName');

            var providerWithinAreaOfCustomerLocation = [];

            serviceProviderCollection
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        console.log('last visible document');
                        console.log(lastVisibleDocument);
                        try {
                            var searchResult = [];

                            querySnapshot.forEach(docSnapshot => {
                                let provider = {
                                    id: docSnapshot.id,
                                    ...docSnapshot.data(),
                                };
                                let providerCoverageDistance = provider.serviceCoverage.coverageDistance;
                                let providerCoor = provider.serviceCoverage.addressCoor;

                                let userCoor = store.getState().loginState.userInfo.serviceAddress.addressCoor;

                                let lowLatThreshold = userCoor.latitude - latDegreeFor1Km * providerCoverageDistance;
                                let lowLonThreshold = userCoor.longitude - lonDegreeFor1Km * providerCoverageDistance;

                                let highLatThreshold = userCoor.latitude + latDegreeFor1Km * providerCoverageDistance;
                                let highLonThreshold = userCoor.longitude + lonDegreeFor1Km * providerCoverageDistance;

                                console.log(providerCoor.latitude + ',' + providerCoor.longitude);

                                var isAnyMatch = false;
                                //Search Filter, Temperory (search filter in front-end is not suitable)

                                //Allow business name search
                                if (provider.businessName.toLowerCase().includes(searchKeyword.toLowerCase())) {
                                    isAnyMatch = true;
                                }

                                //Allow service type search
                                if (
                                    CommonFunction.getDisplayNameForServiceType(provider.serviceType)
                                        .toLowerCase()
                                        .includes(searchKeyword.toLowerCase())
                                ) {
                                    isAnyMatch = true;
                                }

                                //if nothing match, skip this
                                if (!isAnyMatch) {
                                    return;
                                }

                                //Location Filter, Temperatory here.
                                if (
                                    providerCoor.latitude > lowLatThreshold &&
                                    providerCoor.latitude < highLatThreshold &&
                                    providerCoor.longitude > lowLonThreshold &&
                                    providerCoor.longitude < highLonThreshold
                                )
                                    providerWithinAreaOfCustomerLocation.push(provider);
                            });
                            
                            const paginationLimit = 10;

                            if (!!lastVisibleDocument) {
                                lastVisibleDocumentIndex = providerWithinAreaOfCustomerLocation.findIndex(element => {
                                    return element.id == lastVisibleDocument.id;
                                });

                                searchResult = providerWithinAreaOfCustomerLocation.slice(
                                    lastVisibleDocumentIndex + 1,
                                    lastVisibleDocumentIndex + 1 + paginationLimit,
                                );
                            } else {
                                searchResult = providerWithinAreaOfCustomerLocation.slice(0, paginationLimit);
                            }
                            var result = {};

                            if (searchResult.length > 0) {
                                result = {
                                    lastVisibleDocument: searchResult[searchResult.length - 1],
                                    data: searchResult,
                                };
                            } else {
                                result = {
                                    lastVisibleDocument: lastVisibleDocument,
                                    data: [],
                                };
                            }

                            
                        } catch (err) {
                            
                            console.log('error');
                            console.log(err);
                        }
                        console.log('resuls is')
                        console.log(result)
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

export default SearchService;
