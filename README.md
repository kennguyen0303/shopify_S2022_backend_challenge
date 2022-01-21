# shopify_S2022_backend_challenge
![ci workflow](https://github.com/kennguyen0303/shopify_S2022_backend_challenge//actions/workflows/node.yml/badge.svg)

## Description: 

An back-end for a logistic company for managing inventory and items. The backend provides CRUD operations for defining an item, add/remove items into an inventory (Basic requirements) and an ability to generate report such as `get the Most out of stock items for a given time` (Extra feature)

## Requirements for running and testing the app:
1. Docker and Docker-compose
2. Postman for API testing

## A. To start:
1. `cd integration`
2. `sudo docker-compose up --build`

## b. Running tests:
#### 1. `sudo docker ps`
#### 2.  In a new terminal, Copy the `container_id` of the container called `integration_web-server`
#### 3. Next, run the following to get into the back-end container `sudo docker exec -it <paste_the_id_here> /bin/sh` 
#### 4. You should now inside `home/node/app/backend` as below

![image](https://user-images.githubusercontent.com/60043570/150525007-e3a12908-dea6-4a40-90e2-1353f31be75d.png)

#### 5. Run command `npm test`

=> Should expect all tests passed

![image](https://user-images.githubusercontent.com/60043570/150525166-ec63a765-709b-46e4-838d-22d6105aab29.png)
![image](https://user-images.githubusercontent.com/60043570/150527016-0f626751-80e5-4a5d-8609-c7d050420433.png)

### API documentation:
#### Approach 1: postman
Postman json: https://www.postman.com/collections/b63906b585d3f90cc13c 

For trying APIs with Postman, please download the JSON and import the JSON into your Postman.

#### Approach 2: on browser (After run docker-compose up --build)

Access: http://localhost:3000/swagger/

### Check the Postgres Database with PGAdmin

1. Go to browser and access `http://localhost:5050/browser/`
2. Create a server 

![image](https://user-images.githubusercontent.com/60043570/150526087-f9c1e3b6-e63b-4dc6-86ec-3ef2e9724395.png)

3. Configure the server: as below, 
### password: `shopify`
![image](https://user-images.githubusercontent.com/60043570/150526163-c7578781-8be2-434e-804e-19a7bd908702.png)

Have question ? Please feel free to open an issue!
