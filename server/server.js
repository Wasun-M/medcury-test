const express = require('express')
const app = express()
const slots = require('./db')
const bodyParser = require('body-parser')
const arthmetic = require("./helper");
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// use it before all route definitions
app.use(cors({ origin: '*' }));

const doctors = require('./doctors.json')
const patients = require('./patients.json')
const _date = require('date-and-time')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World')
})

const configTime = [
    {
        "doctor": "หมอ ก",
        "doctor_id": "001",
        "start": "08:00",
        "end": "09:00",
    }, {
        "doctor": "หมอ ก",
        "doctor_id": "001",
        "start": "09:00",
        "end": "10:00",
    }, {
        "doctor": "หมอ ก",
        "doctor_id": "001",
        "start": "10:00",
        "end": "11:00",
    }, {
        "doctor": "หมอ ก",
        "doctor_id": "001",
        "start": "11:00",
        "end": "12:00",
    }, {
        "doctor": "หมอ ข",
        "doctor_id": "002",
        "start": "13:00",
        "end": "13:30",
    }, {
        "doctor": "หมอ ข",
        "doctor_id": "002",
        "start": "13:30",
        "end": "14:00",
    }, {
        "doctor": "หมอ ข",
        "doctor_id": "002",
        "start": "14:00",
        "end": "14:30",
    }, {
        "doctor": "หมอ ข",
        "doctor_id": "002",
        "start": "14:30",
        "end": "15:00",
    }
]

const dayOfWeekDoctor = [
    {
        "doctor_id": "001",
        "day_of_week": [1, 3, 5],
        "full_slot": 4
    },
    {
        "doctor_id": "002",
        "day_of_week": [2, 4, 6],
        "full_slot": 4
    },
]

app.listen(3002, () => {
    console.log('Start server at port 3002.')
})

app.get('/slots', (req, res) => {
    let request = req.query;
    let allSlots = slots.filter(x => {
        return x
    });
    let responseAry = [];
    allSlots.map(x => {
        x.slots.map(g => {
            responseAry.push(g)
        })
    });
    res.json(responseAry)
})

app.get('/doctors/slots', (req, res) => {
    let request = req.query;
    let startDate = request.startDate;
    let endDate = request.endDate;
    let fromDate = new Date(startDate);
    let toDate = new Date(endDate);
    let allSlots = slots.filter(x => {
        let checkDate = new Date(x.date);
        if (checkDate >= fromDate && checkDate <= toDate) {
            return x
        }
    });
    let responseAry = [];
    allSlots.map(x => {
        x.slots.map(g => {
            responseAry.push(g)
        })
    });
    res.json(responseAry)
})

app.post('/reserve', (req, res) => {
    let request = req.body;
    let patient = patients.find(x => x.tel == request.tel && x.pin == request.pin);
    if (!patient) {
        res.status(500).json({
            message: "User is not found !!"
        })
        return;
    }
    let dateIndex = new Date();
    let isCanReserveSlot = false;

    while (!isCanReserveSlot) {
        console.log("dateOfWeek", dateIndex.getDay())
        if(dateIndex.getDay() == 0){
            let _tomorrow = new Date();
            _tomorrow.setDate(dateIndex.getDate() + 1);
            dateIndex = _tomorrow;
            continue;
        }
        let getFullSlot = dayOfWeekDoctor.find(x => {
            let index = x.day_of_week.indexOf(dateIndex.getDay());
            if(index > -1){
                return x;
            }
        })
        console.log('getFullSlot: ', getFullSlot)
        let formatDate = _date.format(dateIndex, 'YYYY-MM-DD');
        let dateKey = _date.format(dateIndex, 'YYYY/MM/DD');
        let allSlots = slots.find(x => x.date == dateKey);
        console.log("allSlots: ", allSlots)
        if (!allSlots) {
            let filterSlotByDoctorId = configTime.filter(x => x.doctor_id == getFullSlot.doctor_id);
            let firstSlot = filterSlotByDoctorId[0];
            let objSlot = {
                id: uuidv4(),
                doctor_id: firstSlot.doctor_id,
                doctor: firstSlot.doctor,
                start: firstSlot.start,
                end: firstSlot.end,
                timeSlot: `${firstSlot.start}-${firstSlot.end}`,
                date: dateKey,
                startDisplayDate: `${formatDate}T${firstSlot.start}:00`,
                endDisplayDate: `${formatDate}T${firstSlot.end}:00`,
                patient,
                status: 'reserved'
            }
            let arraySlot = [];
            arraySlot.push(objSlot)
            slots.push({
                date: dateKey,
                slots: arraySlot
            })
            isCanReserveSlot = true;
            console.log("slots: ", slots)
        } else {
            if (allSlots.slots.length == getFullSlot.full_slot) {
                let _tomorrow = new Date();
                _tomorrow.setDate(dateIndex.getDate() + 1);
                dateIndex = _tomorrow;
            } else {
                for (let config of configTime.filter(x => x.doctor_id == getFullSlot.doctor_id)) {
                    let findNotEmptySlot = allSlots.slots.find(x => x.start == config.start && x.end == config.end);
                    if (findNotEmptySlot) {
                        continue;
                    } else {
                        allSlots.slots.push({ 
                            id: uuidv4(),
                            doctor_id: config.doctor_id,
                            doctor: config.doctor,
                            start: config.start,
                            end: config.end,
                            timeSlot: `${config.start}-${config.end}`,
                            date: dateKey,
                            startDisplayDate: `${formatDate}T${config.start}:00`,
                            endDisplayDate: `${formatDate}T${config.end}:00`,
                            patient,
                            status: 'reserved'
                        });
                        isCanReserveSlot = true;
                        break;
                    }
                }
            }
        }
    }

    res.status(201).json(slots)
})

app.post('/reserve/cancel', (req, res) => {
    let request = req.body;
    let id = request.id;
    let cancelObj = {};
    slots.map(x => {
        x.slots.map(x => {
            if (x.id == id) {
                x.status = 'cancel'
                cancelObj = x;
            }
        })
    });
    console.log("updateSlot: ", cancelObj)
    res.status(200).json(cancelObj)
})

app.get('/doctors/slots/:id', (req, res) => {
    let id = req.params.id
    let _slots = slots;
    let response = [];
    for (let slot of _slots) {
        let findSlots = slot.slots.filter(x => x.doctor_id == id)
        response.push(findSlots);
    }
    let filterArray = [];
    response.map(x => {
        x.map(g => {
            filterArray.push(g);
        })
    })
    res.status(200).json(filterArray)
})