import axios from 'axios';
import {TOM_TOM_TOKEN} from "@env"

const MapService = {
    searchAddress: (query) => {
        return new Promise((resolve, reject) => {
            const encodedQuery = encodeURIComponent(query);

            axios.get(`https://api.tomtom.com/search/2/search/${encodedQuery}.json?countrySet=MY&key=${TOM_TOM_TOKEN}`)
            .then(response => {
                console.log('getting data from axios');
                
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            });
        });
    },
    findAddressByGeoCode: (latLong) => {
        return new Promise((resolve, reject) => {
            const encodedQuery = encodeURIComponent(latLong);
            console.log(encodedQuery)

            axios.get(`https://api.tomtom.com/search/2/reverseGeocode/${encodedQuery}.json?countrySet=MY&key=${TOM_TOM_TOKEN}`)
            .then(response => {
                console.log('getting data from axios');
                
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            });
        });
    }
};

export default MapService;
