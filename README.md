# shopify_S2022_backend_challenge
![ci workflow](https://github.com/kennguyen0303/shopify_S2022_backend_challenge//actions/workflows/node.yml/badge.svg)

## Description: 

An back-end for a logistic company for managing inventory and items. The backend provides CRUD operations for defining an item, add/remove items into an inventory (Basic requirements) and an ability to generate report such as `get the Most out of stock items for a given time` (Extra feature)


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


API documentation:
Postman json: https://www.postman.com/collections/b63906b585d3f90cc13c 
