import {Constants} from '~constants';

const CommonFunction = {
    getDisplayNameForServiceType: serviceType => {
        var displayName = '';

        switch (serviceType) {
            case Constants.CAR_WASH_SERVICE:
                displayName = 'Car Wash Service';
                break;
            case Constants.WIND_SCREEN_REPLACEMENT_SERVICE:
                displayName = 'Wind Screen Replacement Service';
                break;
            case Constants.COMPUTER_REPAIR_SERVICE:
                displayName = 'Computer Repair Service';
                break;
            case Constants.PHONE_REPAIR_SERVICE:
                displayName = 'Phone Repair Service';
                break;
            case Constants.FITNESS_SERVICE:
                displayName = 'Fitness Training Service';
                break;
            case Constants.LANGUAGE_COURSE_SERVICE:
                displayName = 'Language Course Service';
                break;
            case Constants.CATERING_SERVICE:
                displayName = 'Catering Service';
                break;
            case Constants.PHOTOGRAPHER_VIDEOGRAPHER_SERVICE:
                displayName = 'Photographer/Videographer Service';
                break;
            case Constants.WEDDING_ORGANIZE_SERVICE:
                displayName = 'Wedding Organize Service';
                break;
            case Constants.MEDICAL_CARE_SERVICE:
                displayName = 'Medical Care Service';
                break;
            case Constants.PSYCHOLOGIST_SERVICE:
                displayName = 'Psychologist Service';
                break;
            case Constants.PHYSICAL_THERAPY_SERVICE:
                displayName = 'Physical Therapy Service';
                break;
            case Constants.CLEANING_SERVICE:
                displayName = 'Cleaning Service';
                break;
            case Constants.PLUMBER_SERVICE:
                displayName = 'Plumber Service';
                break;
            case Constants.ELECTRICAL_WIRING_SERVICE:
                displayName = 'Electrical/Wiring Service';
                break;
            case Constants.AIR_CONDITIONING_SERVICE:
                displayName = 'Air Conditioning Service';
                break;
            case Constants.LANDSCAPE_SERVICE:
                displayName = 'Garden Landscape Service';
                break;
            case Constants.INTERIOR_DESIGN_SERVICE:
                displayName = 'Interior Design Service';
                break;
            case Constants.PEST_CONTROL_SERVICE:
                displayName = 'Pest Control Service';
                break;
            case Constants.MASSAGE_SERVICE:
                displayName = 'Massage Service';
                break;
            case Constants.SALOON_SERVICE:
                displayName = 'Saloon Service';
                break;
            case Constants.PET_SALOON_SERVICE:
                displayName = 'Pet Saloon Service';
                break;
            case Constants.PET_MEDICAL_SERVICE:
                displayName = 'Pet Medical Service';
                break;
            default:
        }

        return displayName;
    },
};

export default CommonFunction;
