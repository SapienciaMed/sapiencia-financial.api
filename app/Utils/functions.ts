export function getStringDate(date: Date): string {

    let day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let strMonth = "";
    let strDay = "";
  
    if (month < 10) {
      strMonth = `0${month}`;
    } else {
      strMonth = month.toString();
    }
    if (day < 10) {
      strDay = `0${day}`;
    } else {
      strDay = day.toString();
    }
    return `${year}-${strMonth}-${strDay}`;
  }