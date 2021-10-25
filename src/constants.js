export const Constants = {
    //Login Provider
    LOGIN_PROVIDER_FIREBASE: 'password',
    LOGIN_PROVIDER_GOOGLE: 'google.com',
    LOGIN_PROVIDER_FACEBOOK: 'facebook.com',
    //AccountType
    ACCOUNT_TYPE: {
        CONSUMER: 'consumer',
        VENDOR: 'vendor',
    },
    BUSINESS_CATEGORY: {
        CAR_MAINTENANCE: 'car',
        DEVICE_MAINTENANCE: 'deviceRepair',
        EDUCATION_LESSON: 'educationLesson',
        EVENT: 'event',
        HEALTH_CARE: 'healthCare',
        HOME_MAINTENANCE: 'home',
        PERSONAL_CARE: 'personalCare',
        PET_CARE: 'petCare',
    },
    //Service Type,
    SERVICE_TYPE: {
        CAR_WASH_SERVICE: 'carWash',
        WIND_SCREEN_REPLACEMENT_SERVICE: 'windScreenReplacement',
        COMPUTER_REPAIR_SERVICE: 'computerRepair',
        PHONE_REPAIR_SERVICE: 'phoneRepair',
        FITNESS_SERVICE: 'fitness',
        LANGUAGE_COURSE_SERVICE: 'language',
        CATERING_SERVICE: 'catering',
        PHOTOGRAPHER_VIDEOGRAPHER_SERVICE: 'photographerVideographer',
        WEDDING_ORGANIZE_SERVICE: 'wedding',
        MEDICAL_CARE_SERVICE: 'medical',
        PSYCHOLOGIST_SERVICE: 'psychologist',
        PHYSICAL_THERAPY_SERVICE: 'physicalTherapy',
        CLEANING_SERVICE: 'cleaning',
        PLUMBER_SERVICE: 'plumber',
        ELECTRICAL_WIRING_SERVICE: 'electricalWiring',
        AIR_CONDITIONING_SERVICE: 'airCond',
        LANDSCAPE_SERVICE: 'landscapeGarden',
        INTERIOR_DESIGN_SERVICE: 'interiorDesign',
        PEST_CONTROL_SERVICE: 'pestControl',
        MASSAGE_SERVICE: 'massage',
        SALOON_SERVICE: 'saloon',
        PET_SALOON_SERVICE: 'petSaloon',
        PET_MEDICAL_SERVICE: 'petMedical',
    },
    //Questionnaire Type
    QUESTIONNAIRE_TYPE: {
        TEXT_ANSWER: 'textAnswer',
        MULTIPLE_CHOICE: 'multipleChoice',
        CHECK_BOX: 'checkBox',
    },
    //Service Status
    REQUEST_STATUS: {
        ACCEPTED: 'accepted',
        REJECTED: 'rejected',
        PENDING: 'pending',
    },
    SERVICE_STATUS: {
        WAITING_FOR_SERVICE: 'waitingForService',
        SERVICE_IN_PROGRESS: 'serviceInProgress',
        SERVICE_COMPLETED: 'serviceCompleted',
        CANCELLED_BY_VENDOR: 'cancelledByVendor',
        CANCELLED_BY_CUSTOMER: 'cancelledByCustomer',
    },
    NOTIFICATION_ACTION: {
        NO_ACTION: 'noAction',
        NAVIGATE_TO_REQUEST:'navigateToRequest',
        NAVIGATE_TO_REVIEW: 'navigateToReview',
        NAVIGATE_TO_PENDING_REQUEST: 'navigateToPendingRequest',

    }
};
