# YouTweet

## Overview
This BACKEND project is a server that allows users to post tweets (like Twitter) and upload videos (like YouTube). Users can perform various operations on their tweets and videos, such as liking, commenting, and sharing.

## Features
- **User Authentication**: Signup, login, and JWT-based authentication.
- **Tweet Operations**: Users can post, edit, delete, like, and comment on tweets.
- **Video Operations**: Users can upload, delete, like, and comment on videos.
- **Follow System**: Users can follow/unfollow others.
- **Search & Explore**: Discover trending tweets and videos.

## Tech Stack
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Storage**: Cloudinary/AWS S3 (for videos)
- **Real-time Features**: WebSockets for notifications

## Installation

### Prerequisites
- Node.js & npm
- MongoDB
- Cloudinary

### Steps
1. Clone the repository:
   
        git clone https://github.com/nitinredddy/YouTweet.git
        cd YouTweet
   
2. Install dependencies:
   
        npm install
   
3. Configure environment variables in a `.env` file:
   
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_secret_key
        CLOUDINARY_API_KEY=your_api_key
        CLOUDINARY_API_SECRET=your_api_secret
   
4. Start the server:
   
        npm start
   

## API Endpoints

### Authentication
For detailed API endpoints and usage, you can head to the PostmanAPI folder and download the YouTweet.postman_collection.json
To import:
1. Open Postman.
2. Click **Import**.
3. Select the downloaded `.json` file.

