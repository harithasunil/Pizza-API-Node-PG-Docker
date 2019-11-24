# Node JS, Express, Postgres, Docker !

* Steps

* 1. Clone this repository.

* 2. Build Docker Image.
```
docker build . -t <username>/pizza-api
```
* 3. Run the Container.
```
docker run -p 8010:8010 -d <username>/pizza-api
```
* 4. Check the server.
```
http://127.0.0.1:8010
```

* 5. To Run Mocha Test Cases
```
npm test
```
* 6. To test the APIs Simply
```
npm start
```