# fitbit-service

Simple microservice with an endpoint containing latest heart rate measurement.  Caches measurement with a 2 hour expiration.

### Usage

```
git clone git@github.com:tylerhaun/fitbit-service.git
cd fitbit-service
npm i
```
Create a .env file with variable `FITBIT_BEARER_TOKEN`.  
To obtain:
1. go to [https://www.fitbit.com/]
2. open the dev console
3. log into your fitbit account, 
4. find and click on a request to [https://web-api.fitbit.com/]
5. Copy the token from the authorization header under the request
  `authorization: Bearer {copy this}`
  to the .env file
```
npm run start
```

#### Debugging
This app uses the [debug library](https://www.npmjs.com/package/debug).
Set `DEBUG=*` in the .env file to enable debug logs

### API
`GET /latest-heart-rate`
returns `{"latestHeartRate":Number}`
