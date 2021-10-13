import {Constants} from '~constants';

const CommonFunction = {
    getDisplayNameForServiceType: serviceType => {
        var displayName = '';

        switch (serviceType) {
            case Constants.SERVICE_TYPE.CAR_WASH_SERVICE:
                displayName = 'Car Wash Service';
                break;
            case Constants.SERVICE_TYPE.WIND_SCREEN_REPLACEMENT_SERVICE:
                displayName = 'Wind Screen Replacement Service';
                break;
            case Constants.SERVICE_TYPE.COMPUTER_REPAIR_SERVICE:
                displayName = 'Computer Repair Service';
                break;
            case Constants.SERVICE_TYPE.PHONE_REPAIR_SERVICE:
                displayName = 'Phone Repair Service';
                break;
            case Constants.SERVICE_TYPE.FITNESS_SERVICE:
                displayName = 'Fitness Training Service';
                break;
            case Constants.SERVICE_TYPE.LANGUAGE_COURSE_SERVICE:
                displayName = 'Language Course Service';
                break;
            case Constants.SERVICE_TYPE.CATERING_SERVICE:
                displayName = 'Catering Service';
                break;
            case Constants.SERVICE_TYPE.PHOTOGRAPHER_VIDEOGRAPHER_SERVICE:
                displayName = 'Photographer/Videographer Service';
                break;
            case Constants.SERVICE_TYPE.WEDDING_ORGANIZE_SERVICE:
                displayName = 'Wedding Organize Service';
                break;
            case Constants.SERVICE_TYPE.MEDICAL_CARE_SERVICE:
                displayName = 'Medical Care Service';
                break;
            case Constants.SERVICE_TYPE.PSYCHOLOGIST_SERVICE:
                displayName = 'Psychologist Service';
                break;
            case Constants.SERVICE_TYPE.PHYSICAL_THERAPY_SERVICE:
                displayName = 'Physical Therapy Service';
                break;
            case Constants.SERVICE_TYPE.CLEANING_SERVICE:
                displayName = 'Cleaning Service';
                break;
            case Constants.SERVICE_TYPE.PLUMBER_SERVICE:
                displayName = 'Plumber Service';
                break;
            case Constants.SERVICE_TYPE.ELECTRICAL_WIRING_SERVICE:
                displayName = 'Electrical/Wiring Service';
                break;
            case Constants.SERVICE_TYPE.AIR_CONDITIONING_SERVICE:
                displayName = 'Air Conditioning Service';
                break;
            case Constants.SERVICE_TYPE.LANDSCAPE_SERVICE:
                displayName = 'Garden Landscape Service';
                break;
            case Constants.SERVICE_TYPE.INTERIOR_DESIGN_SERVICE:
                displayName = 'Interior Design Service';
                break;
            case Constants.SERVICE_TYPE.PEST_CONTROL_SERVICE:
                displayName = 'Pest Control Service';
                break;
            case Constants.SERVICE_TYPE.MASSAGE_SERVICE:
                displayName = 'Massage Service';
                break;
            case Constants.SERVICE_TYPE.SALOON_SERVICE:
                displayName = 'Saloon Service';
                break;
            case Constants.SERVICE_TYPE.PET_SALOON_SERVICE:
                displayName = 'Pet Saloon Service';
                break;
            case Constants.SERVICE_TYPE.PET_MEDICAL_SERVICE:
                displayName = 'Pet Medical Service';
                break;
            default:
                displayName = '';
        }

        return displayName;
    },
    getDisplayNameForBusinessCategory: businessCategory => {
        var displayName = '';

        switch (businessCategory) {
            case Constants.BUSINESS_CATEGORY.CAR_MAINTENANCE:
                displayName = 'Car Maintenance Service';
                break;
            case Constants.BUSINESS_CATEGORY.DEVICE_MAINTENANCE:
                displayName = 'Device Repair Service';
                break;
            case Constants.BUSINESS_CATEGORY.EDUCATION_LESSON:
                displayName = 'Education Lesson Service';
                break;
            case Constants.BUSINESS_CATEGORY.EVENT:
                displayName = 'Events Service';
                break;
            case Constants.BUSINESS_CATEGORY.HEALTH_CARE:
                displayName = 'Health Care Service';
                break;
            case Constants.BUSINESS_CATEGORY.HOME_MAINTENANCE:
                displayName = 'Home Maintenance Service';
                break;
            case Constants.BUSINESS_CATEGORY.PERSONAL_CARE:
                displayName = 'Personal Care Service';
                break;
            case Constants.BUSINESS_CATEGORY.PET_CARE:
                displayName = 'Pet Care Service';
                break;
            default:
                displayName = '';
        }

        return displayName;
    },
};

export default CommonFunction;
