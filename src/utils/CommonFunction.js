import { Constants } from "~constants";

const CommonFunction = {
    getDisplayNameForServiceType: (serviceType)=>{
        var displayName = ''

        switch (serviceType){
            case Constants.SALOON_SERVICE:
                displayName = 'Saloon Service'
                break
            default: 

        }

        return displayName;
    }
}   

export default CommonFunction;