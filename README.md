# todo-redis

this is a simple implementation for a todo app api. 

**currently under development, right now most of the stuff is not implemented. uploading it step by step.**

## tech stack
- node/express as software layer
- redis for db persistence
  - which runs in a docker container
- supertest for http based testing
- chai for unit based testing


## todo
- db layout doc
- DOC
- build up user & notebook objects (data model), see express mvc or data modelling
- logging: https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make
- code reorg to lib/
- input validation all fields 
  - post
  - request params
  - url parts



## setup
- install:

```
npm install
```

- start api:

```
npm start
# or
nodemon index.js
```

- start redis:

```
docker run --name redis -it -p 6379:6379 redis
# will run on port 6379 per default
```

## testing

at first have a look at the package.json for all script calls.

- redis container
```
npm run redis:start
npm run redis:stop
npm run redis:restart # will restart container so wipes data
```

- run tests
```
npm run test:unit # test validation functions
npm run test:http # test http api with http calls
```

- sampledata
```
npm run sampledata
```

## example http calls
- register new user:
```
http POST localhost:3001/user name="randomuser" mail="mail@mail.de" password="xxxxxx"
```

- activate user:
```
http -a test@test.de:xxxxxx http://localhost:3001/user/activation/1683_1494934471863
```

- get user details:
```
http -a test@test.de:xxxxxx http://localhost:3001/user/1
```

- delete user:
```
http -a test@test.de:xxxxxx DELETE http://localhost:3001/user/1
```

- update user:
```
http -a test@test.de:xxxxxx PUT http://localhost:3001/user/1 name="xxxrandomuser" mail="test@test.de" password="xxxxxx"
```

- get user id after login:
```
http -a test@test.de:xxxxxx http://localhost:3001/user
```

- create or update a notebook with its entries:
```
http -a test@test.de:xxxxxx POST http://localhost:3001/notebook/1/test payload='["score1", "text1", "score2", "text2"]'
```

- get all content from a notebook:
```
http -a test@test.de:xxxxxx http://localhost:3001/notebook/1/test
```

- delete a notebook:
```
http -a test@test.de:xxxxxx DELETE http://localhost:3001/notebook/1/test
```


## db schema
- keys:
  - next_user_id => last used id for a new user (simple counter)

- hashes:
  - user_list
    contains (key, value):
    - mail
    - id
    example:
    user_list => 
      - bla@bla.de: 1
      - bla2@bla2.de: 2

  - user:userid
    containes (key,value):
    - mail
    - name
    - status
    - pwhash
    example:
    user:1 =>
      - mail: bla@bla.de
      - name: Paule
      - status: 0
      - pwhash: 58t4r4uh
    user:2 =>
      - mail: bla2@bla2.de
      - name: Paule2
      - status: 0
      - pwhash: 58t4r4uh

  - activation_link


