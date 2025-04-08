# Restaurant Review App

A mobile application built with **React Native**, **Expo Router**, and various Firebase services, designed for users to view, save, and leave reviews for restaurants that are accessible in Finland. The app also integrates **Google Places API** and **Google Geocoding API** to fetch restaurant details and locations.

## Technologies Used

- **React Native**: A framework for building native mobile applications using JavaScript and React.
- **Expo Router**: A routing solution for **Expo** apps, used to handle navigation and routing within the app.
- **Firebase Realtime Database**: A cloud-hosted NoSQL database that allows syncing of data between users in real-time.
- **Firebase Authentication**: A service that helps with authenticating users via various login methods (email/password, Google, etc.).
- **Google Places API**: A service from Google to fetch data about places (restaurants in this case), including details like name, address, and location.
- **Google Geocoding API**: Converts addresses into geographical coordinates (latitude and longitude), which is used for mapping restaurant locations.

## Features

- **User Authentication**: Users can sign up and log in to the app using their email/password via **Firebase Authentication**.
- **Favorite Restaurants**: Users can view and save restaurants as favorites, and delete them from the list. All favorites are stored in **Firebase Realtime Database**.
- **Restaurant Search**: Integrated with the **Google Places API** to allow users to search and get details about nearby restaurants, including address, name, and location.
- **Location Mapping**: Utilizes the **Google Geocoding API** to convert restaurant addresses into geographical coordinates, which are then used for displaying the restaurant locations on the map.
- **Review System**: Users can add and view reviews for each restaurant.