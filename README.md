# Food 4 All

## Table of Contents
- [License](#license)
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributions](#contributions)
- [Testing](#testing)
- [GitHub](#github)
- [Email Author](#email-author)
- [Video Demo](#video-demo)

## License
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description
Cookify is a web application that helps users find recipes to make using a Spoonaculator API. We also implemented a YouTube API to easily search videos. The idea is you find a recipe to make, if you get stuck and need a video guide, you can quickly search how to complete a step.

## Installation
MERN

## Usage
Learn to cook something new!

## Contributions
Lori - https://github.com/omgxlori
Netra - https://github.com/naiknetra
Jessica - https://github.com/Jessica-Lee1424
Luis - https://github.com/lattecoding

## Testing

[Testing]inscturtions on how to install

## GitHub
[GitHub](https://github.com/lattecoding/food-4-all)

## Email Author
[Email Author](mailto:Project3@test.mail)

## Video Demo
(put a video demo here)


#######################
To Do to convert to GraphQL
- typeDefs.ts
    define all of types, queries, and mutations here
    look at API calls in original app
        two kinds we can make in graphQL:
        query - get request (just reading stuff, not changing anything)
        mutations - put, post, delete (changing the original)

    these don't say HOW to do anything, they just say what will be returned for a given request

- resolvers.ts
    where we handle how to do the promises defined on the typeDefs
    should have a function for each of the queries and mutations in tyepDefs
    import models for database (will be Mongoose)

- server.ts
    apollo server library comes into play here
        server on backend code. will use boilerplate code to setup as middleware wrapped around express

- graphQL server, can use mutations to build the client side code

Debugging:
    if returns null, look at database to see if adds user, then look at resolvers
    add console logs to see where errors are


    start with models, then do the schema - typeDefs, then resolvers, server Apollo files
