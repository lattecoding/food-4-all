# Food 4 All

Food 4 All is a user-friendly web application designed to help users effortlessly search for food options and access information about local restaurants. Whether you're craving Italian, searching for the best vegan options, or planning a night out with friends, Food 4 All offers detailed restaurant data including menus, ratings, and user reviews, ensuring you make the perfect choice every time.

## Table of Contents

- [Live Web Application](#live-web-application)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Future Developments](#future-developments)
- [Contributions](#contributions)
- [Authors](#authors)
- [License](#license)


## Live Web Application
Click here to view the live website of Food 4 All: https://food-4-all.onrender.com

## Features
- Search Functionality: Users can search for restaurants by type of cuisine, zip code, and radius (miles).
- Detailed Information: Each restaurant listing provides detailed information including address, contact info, average cost, menu, and user-submitted ratings.
- Responsive Design: Optimized for both desktop and mobile devices, ensuring a seamless user experience on any device.

## Technologies Used
- Front End: HTML, CSS, TypeScript, React
- Back End: Node.js, Express.js
- Database: MongoDB
- APIs: Google Maps API for location-based searches

## Installation

1. Clone the Repository

```
git clone https://github.com/yourusername/food4all.git
cd food4all
```

2. Install Dependencies

```
npm install
```

3. Build the application
```
npm run build
```

4. Seed the Database
```
npm run seed
```

3. Environment Variables - Create a .env file in the root directory and add the following:

```
MONGODB_URI='mongodb://127.0.0.1:27017/food4all-db'
JWT_SECRET_KEY=''
```

4. Run the Application

```
npm run start:dev
```

5. Visit http://localhost:3000 in your web browser.

## Contributions

Contributions are welcome!

## Authors

Food 4 All was created by Luis DeJesus, Jessica Gonnella, Netra Naik, and Lori Morra:

Luis - https://github.com/lattecoding
Jessica - https://github.com/Jessica-Lee1424
Netra - https://github.com/naiknetra
Lori - https://github.com/omgxlori

## License
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)
