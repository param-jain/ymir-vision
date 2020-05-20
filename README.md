# ymir-vision
Handwriting Recognition using Google Vision API


# App Name: Ymir Vision
# Framework Used: React Native 
# Platform Supported: Android, IOS

# Github Link: https://github.com/param-jain/ymir-vision

# Working Video: https://drive.google.com/file/d/187SolEOuwMFg3Votlad7nnrXArTA3whF/view?usp=sharing

# Steps to Check the Working (Running Code Not Necessary):
1. Download Expo App from Play Store or App Store
	Expo Link Playstore: https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_IN
	Expo Link Appstore: https://apps.apple.com/us/app/expo-client/id982107779
2. Click on https://exp.host/@param.jain/ymir-vision
 
# Steps to Reproduce Working Code:
1. Clone or Download the Github Repo  
2. Run yarn in the Root Directory to install Dependencies
3. Hit expo start to Run the Project

*I have added Config Keys in config folder, so no need to add anything from your end. I’ll remove it after review.

# Project Coverage: Breakdown + Bonus Points

# About Git - I locally git committed and forgot to push it on remote. But for “Tracking the Thought Process” part, here’s my go through:
1. As I needed to hit Google Vision API, first I made Console Ready with all the required APIs - Firebase, GCP
2. Then for GV API, image was needed to be uploaded through the App. Also the Problem Statement stated to show list of Previous Results. 
3. That’s why, I first uploaded the image to RN App and then to Firebase Storage -> Returned Image url from there.
4. Then to get the results, I used fetch command to get Vision API response.
5. Once I received the response, I made a Graphql Query to Hasura Database where I stored image_uri with description.
6. Lastly, I made a screen called as List and queried Hasura Db to retrieve the past results and simply populated it. 

# Screenshots:
https://drive.google.com/file/d/1peXgchKp7EGkQ4Lt_wsqFeYxw9-apd65/view?usp=sharing
https://drive.google.com/file/d/1r22cALMWjLaUOe2wKDbUc6vShUg1NNwW/view?usp=sharing
https://drive.google.com/file/d/187SolEOuwMFg3Votlad7nnrXArTA3whF/view?usp=sharing

# Relevant Links:
1. Hasura Console (Hosted on Heroku): https://ymir-vision.herokuapp.com/console/
