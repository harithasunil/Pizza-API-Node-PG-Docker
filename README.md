# Node JS, Express, Postgres, Docker !

* Steps

* 1. Clone this repository.

* 2. Update config/config.json with your database connection details

* 3. Build Docker Image.
```
docker build . -t <username>/pizza-api
```
* 4. Run the Container.
```
docker run -p 8010:8010 -d <username>/pizza-api
```
* 5. Check the server.
```
http://127.0.0.1:8010
```

# Without Docker Image.

* 1. To Run Mocha Test Cases
```
npm test
```
* 2. To test the APIs Simply
```
npm start
```