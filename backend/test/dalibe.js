function getFlightData () {
    const monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct","Nov", "Dec"];


    const todaysDate = new Date();
    const currMonth = todaysDate.getMonth();
    todaysDate.setMonth(currMonth + 1);
    const nextMonth =  todaysDate.getMonth();
    const day = todaysDate.getDate();
    const year = todaysDate.getFullYear();

    console.log(typeof(42));

    console.log(`${day} ${monthNames[nextMonth]} ${year}`);
}

getFlightData();