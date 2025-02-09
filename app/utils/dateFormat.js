function formatDateToLong(dateStr) {
  if (!dateStr) {
      return "";
  }
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
  });
  return formattedDate;
}

function formatDateToShortMonth(dateStr) {
  if (!dateStr) {
      return "";
  }
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short", // Use "short" to get Jan, Feb, etc.
      day: "numeric",
  });
  return formattedDate;
}

function formatDateToMmDdYyyy(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatDateToISO(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

function convertTimeTo12HourFormat(time) {
  const [hour, minute] = time.split(':');
  let period = 'AM';

  let hour12 = parseInt(hour);
  if (hour12 >= 12) {
      period = 'PM';
      if (hour12 > 12) {
          hour12 -= 12;
      }
  }

  const formattedTime = `${hour12.toString().padStart(2, '0')}:${minute} ${period}`;
  return formattedTime;
}

function convertTimeTo24HourFormat(timeString) {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":");

  let hours24 = parseInt(hours, 10);

  if (period === "PM" && hours24 !== 12) {
      hours24 += 12;
  } else if (period === "AM" && hours24 === 12) {
      hours24 = 0;
  }

  return `${hours24.toString().padStart(2, "0")}:${minutes}`;
}

function formatTimeWithTimeZone(dateString) {
  if (!dateString) {
      return "";
  }
  const date = new Date(dateString);

  const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short"
  };

  const formattedTime = date.toLocaleString("en-GB", options);

  return formattedTime;
}

function setTimeToZero(inputDateString) {
  const inputDate = new Date(inputDateString);
  const formattedDate = new Date(inputDate);
  formattedDate.setHours(0, 0, 0, 0);

  return formattedDate;
}

module.exports = {
  formatDateToMmDdYyyy,
  formatDateToLong,
  setTimeToZero,
  formatDateToShortMonth,
  formatDateToISO,
  convertTimeTo12HourFormat,
  convertTimeTo24HourFormat,
  formatTimeWithTimeZone
};
