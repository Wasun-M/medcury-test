import React, { useEffect } from "react";
import "./styles.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

export default function App() {
  const [events, setEvents] = React.useState([]);
  const [tempEvents, setTempEvents] = React.useState([]);

  useEffect(() => {
    (async () => {
      const responseFetchSlots = await axios.get(`http://localhost:3002/slots`);
      console.log("responseFetchSlots: ", responseFetchSlots.data)
      let { data } = responseFetchSlots;
      let eventsList = data.map(x => {
        let _obj = {
          title: x.status != "cancel" ? `${x.doctor} นัดตรวจ ${x.patient.name}` : `${x.patient.name} ยกเลิกนัดตรวจ`,
          start: getDate(x.startDisplayDate),
          end: getDate(x.endDisplayDate),
          backgroundColor: x.status != "cancel" ? "yellow" : "red",
        }
        return _obj;
      })
      setEvents(eventsList);
      setTempEvents(data);
      console.log("tempEvents: ", tempEvents)
    })();
  }, [])

  const getDate = (dayString) => {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    return dayString.replace("YEAR", year).replace("MONTH", month);
  }

  const handleChange = (event) => {
    let value = event.target.value
    let filterEvents = value != "all" ? tempEvents.filter(x => x.doctor_id == value) : tempEvents
    console.log("filterEvents: ", filterEvents)
    setEvents(filterEvents.map(x => {
      let _obj = {
        title: x.status != "cancel" ? `${x.doctor} นัดตรวจ ${x.patient.name}` : `${x.patient.name} ยกเลิกนัดตรวจกับหมอ ${x.doctor}`,
        start: getDate(x.startDisplayDate),
        end: getDate(x.endDisplayDate),
        backgroundColor: x.status != "cancel" ? "yellow" : "red",
      }
      return _obj;
    }))
  }
  return (
    <div className="container">
      <div className="mb-5 mt-5 m-auto w-50">
        <div className="choose-doctor">
          <label className="label-choose-doctor">
            เลือกหมอ
          </label>
          <select className="form-control" onChange={handleChange}>
            <option value="all" selected>ทั้งหมด</option>
            <option value="001">หมอ ก</option>
            <option value="002">หมอ ข</option>
          </select>
        </div>
      </div>
      <div className="content">
        <div className="App">
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            locale="TH"
            themeSystem="Simplex"
            plugins={[dayGridPlugin]}
            events={events}
            displayEventEnd="true"
          // eventContent={renderEventContent}
          />
        </div>
      </div>
    </div>
  );
}