# How to run

1) Do `npm i` to install all the packages
2) Install redis
    ```
    sudo apt-get update
    sudo apt-get install redis
    ```
3) Run redis with `sudo service redis-server start`
4) Run the microservice with `npm run dev`


# How to test
1) Install Postman and Postman Agent
2) Select "New" and choose "Socket.io"
3) Create **two** of the above instance in Postman (two tabs), both with the address `ws://localhost:3003`
4) In the "Events" tab, create and listen to the "matchUpdate" event
5) In the "Message" tab input:
    
    For first instance:

    `{"userId": "this1", "topic":"database", "difficulty":"easy"}`

    ---
    and for second instance:

    `{"userId": "this2", "topic":"database", "difficulty":"easy"}`
6) Right below the "Message" input area, above the Response UI in Postman, change "Text" to "JSON"
7) Beside the "Send" button, put there "requestMatch"
8) Click "Send" you should see at the Request part in Postman a match found message.


