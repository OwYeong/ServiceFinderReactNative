import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("firebase_admin_private_key.json")
firebase_admin.initialize_app(cred)

carWash1 = "ezYmEBCIrCS0H11eyNDgqQC5hlg2"
carWash2 = "PHQqjtdLamPbRMvkIQtkVvNqkYt2"

windscreenreplacement1 = "TxdtUumU4wYSLOmpdMHOhmbSthu1"

computerRepair1 = "1zrbjfjSXmbNOCEftJ0b5mQkpUb2"

phoneRepair1 = "rtDvgIJmbMZfx2o0txUdIPc3jRl1"

fitnessCourse1 = "lQeTmL3F6BaDlr8Dl5vLm9okApV2"

languageCourse1 = "cX2XOZ3IlUf50wmkxhnV3kN8eez2"

cateringOrganize1 = "VJ3XrZjvwxbUHkClYd0ktmIhw0z1"

photographervideographer1 = "8Og3TfPTaLPXkHoDad1ptLEcwZt1"

weddingOrganize1 = "r0vcHrmz2UckELjFXapFbjZq80G3"

service_provider_dummies = [
    {"uid": carWash1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Car Wash',
         'lastName': 'Provider',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Car Wash\\n- Car Polish\\n- Car Cleaning\\n
         ''',
         'additionalForm': [
             {
                 'questionType': 'textAnswer',
                 'options': [],
                 'id': 1,
                 'questionName': 'How many cars do you want to service?'
             },
             {
                 'questionType': 'multipleChoice',
                 'id': 2,
                 'options': [
                     {'optionId': 1, 'optionName': 'Mpv'},
                     {'optionName': 'Sedan', 'optionId': 2},
                     {'optionName': 'Suv', 'optionId': 3}

                 ],
                 'questionName': 'What is the size of your car?'
             },
             {
                 'id': 3,
                 'options': [
                     {'optionName': 'Car Wash', 'optionId': 1},
                     {'optionName': 'Car Polish', 'optionId': 2},
                     {'optionName': 'Car Cleaning', 'optionId': 3}
                 ],
                 'questionName': 'What service you need?', 'questionType': 'checkBox'
             }
         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FezYmEBCIrCS0H11eyNDgqQC5hlg2%2FcoverImage.png?alt=media&token=437554bf-6c93-4433-9a7a-7223e4b32682',
         'withAdditionalForm': True,
         'businessCategory': 'car',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FezYmEBCIrCS0H11eyNDgqQC5hlg2%2FbusinessLogo.png?alt=media&token=4652a4b9-db46-4199-9b2a-147e0c4bea24',
         'serviceType': 'carWash',
         'averageRatings': 0,
         'priceEnd': '100',
         'totalEarnings': 1500,
         'businessDesc': '''CARs International has been operating in the car beauty care services in all the majority of the shopping malls since 1973. \\n\\nCARs offers many ranges of professional restoration services, each carried out to the utmost level of care and quality according to the ISO:9001 tenets.  Car owners can have their vehicles pampered with services such as paint restoration and protection, paint sealant treatment, vacuuming, interior and engine cleaning.''',
         'popularity': {
             'AUG_2021': 4,
             'SEP_2021': 5,
             'OCT_2021': 3,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '20',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'Happy Car Wash Sdn Bhd',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": carWash2,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Car Wash',
         'lastName': 'Provider',
         'phoneNumber': '+0312345678'
     },
        'providerInfo': {
            'phoneNumber': '+0312345678',
            'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Car Washing\\n- Car Waxing\\n- Car Vacuum\\n
         ''',
         'additionalForm': [
             {
                 'questionType': 'textAnswer',
                 'options': [],
                 'id': 1,
                 'questionName': 'How many cars do you want to service?'
             },
             {
                 'questionType': 'multipleChoice',
                 'id': 2,
                 'options': [
                     {'optionId': 1, 'optionName': 'Mpv'},
                     {'optionName': 'Sedan', 'optionId': 2},
                     {'optionName': 'Suv', 'optionId': 3}

                 ],
                 'questionName': 'What is the size of your car?'
             },
             {
                 'id': 3,
                 'options': [
                     {'optionName': 'Car Wash', 'optionId': 1},
                     {'optionName': 'Car Waxing', 'optionId': 2},
                     {'optionName': 'Car Vacuum', 'optionId': 3}
                 ],
                 'questionName': 'What service you need?', 'questionType': 'checkBox'
             }
         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FPHQqjtdLamPbRMvkIQtkVvNqkYt2%2FcoverImage.png?alt=media&token=d52a6bbb-2d07-424f-8b52-28d1d7cf7540',
         'withAdditionalForm': True,
         'businessCategory': 'car',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FPHQqjtdLamPbRMvkIQtkVvNqkYt2%2FbusinessLogo.png?alt=media&token=a3ea8b55-4fb4-42cf-a4b3-3087e40f49cf',
         'serviceType': 'carWash',
         'averageRatings': 4.7,
         'priceEnd': '150',
         'totalEarnings': 1500,
         'businessDesc': '''C2W GLOBAL SDN BHD, Is the first company that is currently operating as a mobile car wash and sanitation service in Malaysia. Call2wash has been providing automobile detailing and disinfection service around Klang Valley for the past 7 years. We are driven by market demand to provide excellent vehicle wash solutions, for passenger vehicles and commercial vehicles. Call2wash has made it all possible bringing the car wash right to your car park. Turning it conveniently into a wash bay with our rider at your doorstep.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 2,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 1
         },
         'priceStart': '30',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'Call2Wash Sdn Bhd',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": windscreenreplacement1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Wind Screen',
         'lastName': 'Replacement',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Wind Screen replacement\\n- Wind Screen Sun Shade\\n
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FTxdtUumU4wYSLOmpdMHOhmbSthu1%2FcoverImage.png?alt=media&token=7114550c-aa0a-4e8c-a051-5164026c1889',
         'withAdditionalForm': False,
         'businessCategory': 'car',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FTxdtUumU4wYSLOmpdMHOhmbSthu1%2FbusinessLogo.png?alt=media&token=f96bbe9e-a3ac-4e80-9ac6-1e9eac919491',
         'serviceType': 'windScreenReplacement',
         'averageRatings': 0,
         'priceEnd': '1000',
         'totalEarnings': 1500,
         'businessDesc': '''HUNG TAI TRADING which commenced business in 1989, was incorporated on 17 June the same year. Started humbly in a one-shop retail outlet, specialized in the retailing of auto parts and car accessories, it enjoyed progressive growth to enable it to incorporate HUNG TAI Import & Export (M) Sdn. Bhd.on 1 July 2003 to take over all the operations of HUNG TAI TRADING. The company was an import and export wholesaler of auto parts slot in and car accessories serving the Malaysian automotive industry.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '200',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'Brothers Factory Outlet',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": computerRepair1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Computer',
         'lastName': 'Repair',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Computer Repair\\n- HardWare replacement\\n- Os Reformatting\\n
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2F1zrbjfjSXmbNOCEftJ0b5mQkpUb2%2FcoverImage.png?alt=media&token=f3d837ea-6fef-44d0-bbf8-84e2656423e4',
         'withAdditionalForm': False,
         'businessCategory': 'deviceRepair',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2F1zrbjfjSXmbNOCEftJ0b5mQkpUb2%2FbusinessLogo.png?alt=media&token=28f21ac1-970d-422e-8a8f-0b84557f6f75',
         'serviceType': 'computerRepair',
         'averageRatings': 0,
         'priceEnd': '300',
         'totalEarnings': 1500,
         'businessDesc': '''Tech Hypermart Sdn. Bhd. began its journey as an established computer hardware distributor company in Malaysia in 1997. Throughout the many years we have been in service, Techhypermart has grown steadily and profitably, making a name for ourselves among leading IT technology companies within Malaysia. The company was selected as an authorized IPP (Intel Premium Provider) by Intel in 2002, which identifies us as the preferred source for Intel products and technologies. \\nAdditionally, Tech Hypermart Sdn. Bhd. is also entitled as the Premier Business Partner of Hewlett Package (HP), Preference Reseller of Epson, Authorized Dealer of LG, Canon products and many more. Here at Techhypermart, our products and services are designed to satisfy the needs of a wide variety of consumers - from casual to tech-savvy - with well-trained associates who offer technical solutions in an immersive shopping environment. Uniquely focused on computers and other IT related products, Techhypermart offers more computers and electronic devices than any other retailer and IT repair services that are second to none. We are committed to providing high quality products and services, keeping the needs of our customers, suppliers and employees at the forefront of our mind.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '150',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'TechHypermart Sdn Bhd',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": phoneRepair1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Phone',
         'lastName': 'Repair',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Phone Repair\\n- Screen Protector install
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FrtDvgIJmbMZfx2o0txUdIPc3jRl1%2FcoverImage.png?alt=media&token=c93a9a58-c31e-4f98-bbea-5a403edd88c7',
         'withAdditionalForm': False,
         'businessCategory': 'deviceRepair',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FrtDvgIJmbMZfx2o0txUdIPc3jRl1%2FbusinessLogo.png?alt=media&token=8f90aec1-e6af-406d-9e6e-09761aa0175f',
         'serviceType': 'phoneRepair',
         'averageRatings': 0,
         'priceEnd': '100',
         'totalEarnings': 1500,
         'businessDesc': '''We always provide the most competitive & affordable market price! We ensure you with our best level of services, offline and online shopping satisfaction with most efficient delivery within Malaysia! Wide range of variety with over 1000 SKUs which including more than 30 brands of smartphone, tablet, gadgets, accessories, IOT (Internet Of Thing), Smarthome & wearables which are available at affordable market price with ready stocks! Live Demo are available to touch & feel before purhcase at all our outlets. \\nWe only provide original manufacturer sets and original imported set. We do supply attractive, useable and quality accessories which more than 300 wide range of choices and price starts from RM1 (Daily Promotion)! All device come with official / in-house warranty. Original Malaysia Set device with 1 year to 2 years Official Warranty by Authorised Service Center & Original Imported Set device with 2 Years In-House Warranty By Mobile 2 Go [ Mobile To Go Sdn Bhd (1222138-D) ] Accessories choices included the latest Gadgets / Audio Speaker / Bluetooth Portable / Power bank / External Storage / Sport Electronics Gadgets / Home & Living Assistant and Many more!''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '50',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'R&K Mobile Repair Center',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": fitnessCourse1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Fitness',
         'lastName': 'Course',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Personal Fitness Training\\n- Yoga course
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FlQeTmL3F6BaDlr8Dl5vLm9okApV2%2FcoverImage.png?alt=media&token=1e7f2926-034e-4285-bbb2-f0b194ac980c',
         'withAdditionalForm': False,
         'businessCategory': 'educationLesson',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FlQeTmL3F6BaDlr8Dl5vLm9okApV2%2FbusinessLogo.png?alt=media&token=4cefdc02-e424-46dd-aaa9-dd1209d7de15',
         'serviceType': 'fitness',
         'averageRatings': 0,
         'priceEnd': '150',
         'totalEarnings': 1500,
         'businessDesc': '''Fitness First is an international fitness centre brand founded in 1993 in the United Kingdom. The company owned and operated its clubs around the world, until financial pressures saw parts of the company sold off to various owners in different regions between 2016 and 2017.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '100',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'Fitness First',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": languageCourse1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Language',
         'lastName': 'Course',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Chinese Lesson\\n- English Lesson\\n- Tamil Lesson\\n- Malay Lesson
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FcX2XOZ3IlUf50wmkxhnV3kN8eez2%2FcoverImage.png?alt=media&token=20a262d4-589c-40b0-b022-e2eb8b685fa7',
         'withAdditionalForm': False,
         'businessCategory': 'educationLesson',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FcX2XOZ3IlUf50wmkxhnV3kN8eez2%2FbusinessLogo.png?alt=media&token=29c20a6c-d343-4aff-aa73-001e8261b850',
         'serviceType': 'language',
         'averageRatings': 0,
         'priceEnd': '50',
         'totalEarnings': 1500,
         'businessDesc': '''The YMCA KL, short for the Young Men’s Christian Association of Kuala Lumpur is a Voluntary, International, Christian, ecumenical movement that endeavours to echo the cultural identity of the Nation in which it exists and serves. It is a well-established autonomous non-profit Christian charity organization, founded on 27th of October 1905. We began with the core intention of initiating cause driven awareness by serving the evolving community at large in Klang Valley for more than a century through sustaining the true balance in Body, Mind and Spirit as the essential core personal values of each individual that experience the YMCA. Aside from being one of the earliest non-profit organizations in Malaysia with a crucial philanthropic legacy, the YMCA of Kuala Lumpur is also a Membership organisation that welcomes individuals of all ages, genders, races, ethnicities, religions, and abilities to experience self-growth and empowerment. Our programmes, activities, courses, projects and events are driven by our Causes for Members to embrace diversity, encourage harmony and emulating core family values through a healthy lifestyle of learning, training and personal development.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '10',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'YMCA KL',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": cateringOrganize1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Catering',
         'lastName': 'Organize',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Halal Catering Services\\n- Non-Halal Catering Services\\n- Vegeteran Catering Services
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FVJ3XrZjvwxbUHkClYd0ktmIhw0z1%2FcoverImage.png?alt=media&token=a43f68f5-c935-4b20-8204-d8faf8f8740a',
         'withAdditionalForm': False,
         'businessCategory': 'event',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2FVJ3XrZjvwxbUHkClYd0ktmIhw0z1%2FbusinessLogo.png?alt=media&token=e3e1c2f8-3bff-45fc-819c-563b22957784',
         'serviceType': 'catering',
         'averageRatings': 0,
         'priceEnd': '500',
         'totalEarnings': 1500,
         'businessDesc': '''We are committed to only provide the best catering services to our customers. As one of the leading food catering services provider in Malaysia, we have extended our food catering services to a wide selection of customer, ranging from private parties, wedding events to corporate functions.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '100',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'Retro Catering Sdn Bhd',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": photographervideographer1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Photographer',
         'lastName': 'Videographer',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Cameraman Service\\n- Wedding Videographer\\n- Video/Photo Editing
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2F8Og3TfPTaLPXkHoDad1ptLEcwZt1%2FcoverImage.png?alt=media&token=7a674cc8-526b-4034-bfcf-f0b244bb7637',
         'withAdditionalForm': False,
         'businessCategory': 'event',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2F8Og3TfPTaLPXkHoDad1ptLEcwZt1%2FbusinessLogo.png?alt=media&token=301a1a75-9b56-42a5-af92-9b535f1e0d69',
         'serviceType': 'photographerVideographer',
         'averageRatings': 0,
         'priceEnd': '200',
         'totalEarnings': 1500,
         'businessDesc': '''We are Thomas photography — a team of experts at the intersection of the tech and creative spaces. We’re driven by a singular passion and purpose: to help photographers succeed and thrive. We are passionate about finding new ways to provide the photography community the tools and resources they need to share their work and grow their business. Our work is never done.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '80',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'Thomas Photography Sdn Bhd',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },
    {"uid": weddingOrganize1,
     'userInfo': {
         'loginProvider': 'password',
         'isFirstTimeUser': False,
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'accType': 'vendor',
         'isBusinessProfileSetup': True,
         'firstName': 'Wedding',
         'lastName': 'Organize',
         'phoneNumber': '+0312345678'
     },
     'providerInfo': {
         'phoneNumber': '+0312345678',
         'firstJoined': firestore.firestore.SERVER_TIMESTAMP,
         'businessServiceDesc': '''
         We provide services such as :\\n- Wedding Makeup\\n- Wedding Organizing\\n- Wedding Hair Stylist
         ''',
         'additionalForm': [

         ],
         'coverImgUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2Fr0vcHrmz2UckELjFXapFbjZq80G3%2FcoverImage.png?alt=media&token=9565d320-b945-45ac-bc5c-0af9d04d7900',
         'withAdditionalForm': False,
         'businessCategory': 'event',
         'businessLogoUrl': 'https://firebasestorage.googleapis.com/v0/b/servicefinder-84d4d.appspot.com/o/userData%2Fr0vcHrmz2UckELjFXapFbjZq80G3%2FbusinessLogo.png?alt=media&token=b6c88531-34f8-463a-a48b-2decec934cb3',
         'serviceType': 'wedding',
         'averageRatings': 0,
         'priceEnd': '1000',
         'totalEarnings': 1500,
         'businessDesc': '''MY Wedding Planner Sdn Bhd (previously known as Fabulous Wedding Wonders*) is a wedding planner company in Malaysia providing wedding planning and consultation services in Malaysia. Having actively planned weddings for couples regardless of race, creed and colour, and even mixed marriages from different countries, MY Wedding Planner promises the creativity, vibrancy and talent of dedicated and skilled professionals to bring your beautiful and utterly memorably dream wedding to life.  We are your DREAM WEDDING MAKER. * Fabulous Wedding Wonders (Wedding Planner Malaysia company) was formed in 2005. With many years of experiences in wedding planning, Fabulous Wedding Wonders is preparing to serve our clients better. This is why MY Wedding Planner Sdn Bhd is born.''',
         'popularity': {
             'AUG_2021': 0,
             'SEP_2021': 0,
             'OCT_2021': 0,
             'NOV_2021': 0,
             'DEC_2021': 0,
             'JAN_2022': 0,
             'FEB_2022': 0,
             'MAR_2022': 0,
             'APR_2022': 0,
         },
         'jobsCompleted': 100.0,
         'starStats': {
             'numOf5Star': 0,
             'numOf3Star': 0,
             'numOf2Star': 0,
             'numOf1Star': 0,
             'numOf4Star': 0
         },
         'priceStart': '500',
         'serviceCoverage': {
             'addressCoor': {
                 'longitude': 101.5406627766788,
                 'latitude': 2.9899280849281125
             },
             'coverageDistance': '15',
             'addressFullName': 'Kota Kemuning, 40460 Klang, Selangor'
         },
         'businessName': 'My Wedding Planner Sdn Bhd',
         'dateNotAvailable': [],
         'workingHours': {'startHour': 9, 'endHour': 18},

     }
     },

]


# Start listing users from the beginning, 1000 at a time.
page = auth.list_users()
while page:
    for user in page.users:
        print('User: ')
        print(user.__dict__)
    # Get next batch of users.
    page = page.get_next_page()

for provider in service_provider_dummies:
    user = auth.update_user(
        provider["uid"],
        email_verified=True,)
    print('Sucessfully updated user: {0}'.format(user.uid))


database = firestore.client()
# col_ref is CollectionReference

for provider in service_provider_dummies:
    database.collection('users').document(
        provider['uid']).set(provider["userInfo"])
    database.collection('serviceProviders').document(
        provider['uid']).set(provider["providerInfo"])

    print("setting for " + provider["uid"])


# col_ref = database.collection('serviceProviders')
# results = col_ref.where('accType', '==', 'vendor').get()  # one way to query

# for item in results:
#     print(item.to_dict())
#     print(item.id)
