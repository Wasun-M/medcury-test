Medcury Test

Stack
front-end -> React js
back-end -> node js

How to run front-end
  start from the root path
  1. cd frontend
  2. npm install
  3. npm start

How to run back-end
  start from the root path
  1. cd server
  2. npm install
  3. npm run dev


Api list 
1. 
- endpoint -> /doctors/slots 
- method -> GET 
- params -> startDate, endDate :formate "YYYY/MM/DD" 
2. 
- endpoint -> /reserve 
- method -> POST 
- body -> { "tel": string, "pin": string } 
- example -> { "tel": string, "pin": string }
3. 
- endpoint -> /reserve/cancel 
- method -> POST body -> { "id": string } 
- example -> { "id": "465b81fc-4c23-405d-82cb-c88b45837515" } 
4. 
- endpoint -> /doctors/slots/:id method -> 
- GET params -> id: string 
- example -> /doctors/slots/001
    
  **** ข้อมูลที่จะแสดงหน้า front-end จะมาจากการยิง API เส้น /reserve เพราะฉะนั้นจะต้อง Insert Data ก่อนจึงจะเห็นตารางการจองใน ปฏิทิน ****
               
               
               
               
               
               
               
               
            
