function set_day(index){

    document.getElementById("day").selectedIndex  = document.getElementById("week_dates")[index];


    let week_dates = document.getElementById("week_dates");
    console.log("week_dates", week_dates.value);

    /*
    const week_array = week_dates.split(",");
    console.log(week_array);

    console.log("week_dates", document.getElementById("week_dates").value[index]);

    console.log("substring", document.getElementById("week_dates").value.substring(0,10));
    console.log("index", index);

    */

}

function daily_weekly(type){

    if (type === 'daily')
    {
        document.getElementById("weekly").checked = false;
    }
    else
    {
        document.getElementById("daily").checked = false;
    }
}

let reminder_checkbox = 0;
function occurence(){
    reminder_checkbox ++;

    if (reminder_checkbox % 2 === 1)
    {
         document.querySelector(".occurence").style.display = "block";
    }
    else
    {
        document.querySelector(".occurence").style.display = "None";
        document.getElementById("daily").checked = false;
        document.getElementById("weekly").checked = false;
    }

    document.getElementById("end_month").selectedIndex  = document.getElementById("month").selectedIndex;
    document.getElementById("end_day").selectedIndex  = document.getElementById("day").selectedIndex;
 }



function create_event(hour, min){

    document.querySelector(".create_event").style.display = "block";

    document.getElementById("hour_start").selectedIndex  = hour + 1;
    document.getElementById("hour_end").selectedIndex  = hour + 2;

    document.getElementById("minute_start").selectedIndex  = 1;
    document.getElementById("minute_end").selectedIndex  = 1;

    let raw_date = document.getElementById("current_date").value;
    let month = raw_date.substring(0,2);
    document.getElementById("month").selectedIndex  = month;
}


    /* JavaScript so my scrollbar of calendar starts at 8:00 AM */
    window.onload = function() {
    var gridContainer = document.getElementById('grid_container');
    var contentHeight = gridContainer.scrollHeight;
    var containerHeight = gridContainer.clientHeight;
    gridContainer.scrollTop = (contentHeight - containerHeight) / 1.63;
};


