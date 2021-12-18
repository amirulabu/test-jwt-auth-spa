# JWT Auth SPA with HTTP-only cookies

## About

- this repo is an example on how to implement JWT stateless sessions on the server side using Nestjs and client side using React
## Problem

- storing session credentials (jwt, random hash, etc) in local storage and non-http-only cookies is BAD

## Solution

- Access token and refresh token as per OAuth 2.0, but both not sent directly to client. 
  - access token is sent from server via json, will be stored in client side javascript, meaning its a variable but no open to global
  - refresh token is sent to client in form of http-only cookie and it is automatically sent with every request (or only refresh endpoint)
  - the access token is refreshed when the token is expired or a page load happens by sending a POST request to `/refresh` 

## References

- Ben Awad's video (JWT Authentication Node.js Tutorial with GraphQL and React)[https://www.youtube.com/watch?v=25GS0MLT8JU] and [code](https://github.com/benawad/jwt-auth-example)
- Jake Engel's article [NestJS — Access & Refresh Token JWT Authentication](https://javascript.plainenglish.io/nestjs-implementing-access-refresh-token-jwt-authentication-97a39e448007) and [code](https://github.com/jengel3/nestjs-auth-example)
- Matthias Schild's article [JWT authentication with NestJS and HTTP-only cookies](https://matthiasschild.medium.com/jwt-authentication-with-nestjs-and-http-only-cookies-a338f5baeff9)
