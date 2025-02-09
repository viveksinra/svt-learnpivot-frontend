export const allStates= [ {label:"Alabama",id:"AL"},
{label:"Alaska",id:"AK"},
{label:"Arizona",id:"AZ"},
{label:"Arkansas",id:"AR"},
{label:"California",id:"CA"},
{label:"Colorado",id:"CO"},
{label:"Connecticut",id:"CT"},
{label:"Delaware",id:"DE"},
{label:"Florida",id:"FL"},
{label:"Georgia",id:"GA"},
{label:"Hawaii",id:"HI"},
{label:"Idaho",id:"ID"},
{label:"Illinois",id:"IL"},
{label:"Indiana",id:"IN"},
{label:"Iowa",id:"LA"},
{label:"Kansas",id:"KS"},
{label:"Kentucky",id:"KY"},
{label:"Louisiana",id:"LA"},
{label:"Maine",id:"ME"},
{label:"Maryland",id:"MD"},
{label:"Massachusetts",id:"MA"},
{label:"Michigan",id:"MI"},
{label:"Minnesota",id:"MN"},
{label:"Mississippi",id:"MS"},
{label:"Missouri",id:"MO"},
{label:"Montana",id:"MT"},
{label:"Nebraska",id:"NE"},
{label:"Nevada",id:"NV"},
{label:"New Hampshire",id:"NH"},
{label:"New Jersey",id:"NJ"},
{label:"New Mexico",id:"NM"},
{label:"New York",id:"NY"},
{label:"North Carolina",id:"NC"},
{label:"North Dakota",id:"ND"},
{label:"Ohio",id:"OH"},
{label:"Oklahoma",id:"OK"},
{label:"Oregon",id:"OR"},
{label:"Pennsylvania[",id:"PA"},
{label:"Rhode Island",id:"RI"},
{label:"South Carolina",id:"SC"},
{label:"South Dakota",id:"SD"},
{label:"Tennessee",id:"TN"},
{label:"Texas",id:"TX"},
{label:"Utah",id:"UT"},
{label:"Vermont", id:"VT"},
{label:"Virginia",id:"VA"},
{label:"Washington",id:"WA"},
{label:"West Virginia",id:"WV"},
{label:"Wisconsin",id:"WI"},
{label:"Wyoming",id:"WY"}]

export const allGenders = [{label:"Female", id:"Female"},{label:"Male", id:"Male"},{label:"Non-Binary", id:"Non-Binary"},{label:"Transgender Male", id:"TransgenderMale"},{label:"Transgender Female", id:"TransgenderFemale"}]


export const allRelation = [{label:"Friend",id:"friend"},{label:"Father",id:"father"},{label:"Mother",id:"mother"},{label:"Brother",id:"brother"},{label:"Sister",id:"sister"},{label:"Cousin",id:"cousin"},{label:"Physician",id:"physician"},{label:"Mental Health Provider",id:"mentalHealthProvider"},{label:"Dentist",id:"dentist"}, {label:"Others",id:"others"}]

export const allJobRole = [{label:"Admin",id:"admin"},{label:"C.E.O.",id:"ceo"},{label:"Building Manager",id:"buildingManager"},{label:"Caregiver",id:"caregiver"},{label:"Cook",id:"cook"},{label:"Outdoor Worker",id:"outdoorWorker"},{label:"Indoor Worker",id:"indoorWorker"},{label:"Doctor",id:"doctor"},{label:"Accountant",id:"accountant"},{label:"Housekeeper",id:"housekeeper"},{label:"Other",id:"other"}]


export const todayDate = ()=> {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd
    return today;
}
export const timZone = ()=>{
    let date = new Date();
    let offsetMinutes = date.getTimezoneOffset();
    let offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    let offsetMinutesFormatted = Math.abs(offsetMinutes) % 60;
    let offsetSign = offsetMinutes > 0 ? "-" : "+";
    let offsetString = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutesFormatted.toString().padStart(2, "0")}`;
    return offsetString;
}
export const  getTodayDateRangeWithTime = (today)=> {
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999); 
    return {
      startDate: startDate,
      endDate: endDate
    }
  }