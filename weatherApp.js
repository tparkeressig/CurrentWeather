var weather, city, state, temp, far, forecast, humidity, weather, rain, zipCode, zipCode1;

var text; //sunny, rainy, etc
var int; // number to make day function for 7 day forecast 

var makeWrapper;

var removeButton = document.getElementById("buttongo");
var removeInput = document.getElementById("zipcode");
var bool = true;
var bool2 = true;
var bool3 = true;
var bool4 = true;
var dummyBool = false;
var dummyBool2 = false;
var objBool = true;

function getZip() {
    var script = document.createElement("script");
    
    if (bool == true) {
        zipCode = document.getElementById("zipcode").value;
        bool = false;
        objBool = true;
    }
    else {
        zipCode = document.getElementById("editInput").value;
        objBool = true;
    }
        script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+zipCode+", United States')&format=json&callback=callbackFunction";
        document.body.appendChild(script);    
}

//get the info from yahoo  api
function callbackFunction(JSONdata) {
    console.log(JSONdata);
    weather = JSONdata;
    
    city = weather.query.results.channel.location.city;
    state = weather.query.results.channel.location.region;
    temp = weather.query.results.channel.item.condition.temp;
    far =
weather.query.results.channel.units.temperature;
    
    var humidity = weather.query.results.channel.atmosphere.humidity;
    var windSpeed = weather.query.results.channel.wind.speed;
    
    //need these separate
    
    //get general object for one day
    forecast = weather.query.results.channel.item.forecast; //can access forecast array depending on day later
    
    displayData(city, state, temp, far, forecast); //display for left side
    makeWrapper = document.createElement("div");
    makeWrapper.id = "wrapperDiv";
    document.getElementById("right_col").appendChild(makeWrapper);
    
     if (dummyBool2 == true) {
         var updateWeeklyWeather = document.getElementById("wrapperDiv");
         document.getElementById("right_col").removeChild(updateWeeklyWeather);
    }
    dummyBool2 = true;
    
    for(var i = 0; i < 10; i++) {
        getWeek(i, humidity, windSpeed); //make 1 new weather object        
    }// outputs weather data for all days  
}


function removeData() {
    
    var remAskID = document.getElementById("askID");
    var remZipCity = document.getElementById("zipcity");
    document.getElementById("left_col").removeChild(remAskID);
    document.getElementById("left_col").removeChild(remZipCity);
    

    document.getElementById("right_col").removeChild(removeButton);
    document.getElementById("right_col").removeChild(removeInput);
} //clear contents of left column, i.e move text box to the wrighte



function displayData(city, state, temp, far, forecast) {
    if (bool2 == true) {
        removeData();
        bool2 = false;
    }
    
    var node = document.createElement("p");
    node.id = "new_Node";
    var breaknode = document.createElement("br");
    var breaknode2 = document.createElement("br");
    var currentDiv = document.getElementById("left_col");
    var textnode = document.createTextNode(city+", "+state);
  
   
    //new paragraph for the farenheit values
    var paraNode = document.createElement("p"); //for the farenheit text
    var paraNodeSymF = document.createElement("p"); //for faren label
    paraNode.id = "farenNode";
    paraNodeSymF.id = "farenSymbol";
    var tempNode = document.createTextNode(temp+"\xB0");
    var farensymbol = document.createTextNode("Fahrenheit");
    
    //new paragraph for the celsius values
    var paraNode2 = document.createElement("p");
    var paraNodeSymC = document.createElement("p");
    paraNodeSymC.id = "celSymbol";
    paraNode2.id = "celNode";
    var getCel = changeCel(temp); //has celsius
    var celTempNode = document.createTextNode(getCel+"\xB0");
    var celsymbol = document.createTextNode("Celsius");

    
    //CLEAR CONTENTS OF CURRENTDIV AT A CERTAIN TIME
    if (dummyBool == true) {
        var updateCurrentWeather = document.getElementById("new_Node");
        currentDiv.removeChild(updateCurrentWeather);
        var removeButtonPara = document.getElementById("buttonPara");
        currentDiv.removeChild(removeButtonPara);
    }
    dummyBool = true;
    
    //all this 
    paraNode.appendChild(tempNode); 
    paraNodeSymF.appendChild(farensymbol);
    
    paraNode2.appendChild(celTempNode); 
    paraNodeSymC.appendChild(celsymbol); 
    
    node.appendChild(textnode);
    node.appendChild(breaknode);
    
    node.appendChild(paraNode);
    node.appendChild(paraNodeSymF);
    node.appendChild(breaknode2);
    node.appendChild(paraNode2);
    node.appendChild(paraNodeSymC);
    
    currentDiv.appendChild(node);    
    
    /*------------------------------------------------------*/
    var makeButtonPara = document.createElement("p");
    var breaknode3 = document.createElement("br");
    makeButtonPara.id = "buttonPara";
    makeButtonPara.appendChild(document.createTextNode("Change location:"));
    makeButtonPara.appendChild(breaknode3);
    var editInput = removeInput;
    editInput.id = "editInput";
    var editButton = removeButton;
    editButton.id = "editButton";
    makeButtonPara.appendChild(editInput);
    makeButtonPara.appendChild(editButton);
    
    currentDiv.appendChild(makeButtonPara);

} //only updating left contents

function changeCel(temp) {
    var cel = Math.ceil((temp-32)*(5/9));
    return cel;
} //change temperature from F to C

function getWeek(int, humidity, windSpeed) {
    
    var humidity = weather.query.results.channel.atmosphere.humidity;
    var windSpeed = weather.query.results.channel.wind.speed;
    
    
    function weekForecast(day, date, text, high, low) {
        this.day = day;
        this.date = date;
        this.text = text;
        this.high = high;
        this.low = low;
    }
    
    var tomorrow = new weekForecast(forecast[int].day, forecast[int].date, forecast[int].text, forecast[int].high, forecast[int].low); 
    
    tomWeather(tomorrow, int, humidity, windSpeed); 
}

function tomWeather(tomorrow, int, humidity, windSpeed) {
    
    var col_right = document.getElementById("right_col");
    var displayRight = document.getElementById("forecast");
    
    var otherWeather = {
        "humidities": "N/A",
        "wind": "N/A"
        //rain doesn't exist
    };
    /////////////
    var humid = document.createTextNode("Humidity: "+humidity+"%");
    var humid2 = document.createTextNode("Humidity: "+otherWeather.humidities);
    var wind = document.createTextNode("Wind: "+windSpeed+" mph");
    var wind2 = document.createTextNode("Wind: "+otherWeather.wind);    
    /////////////
    
    date = (tomorrow.date).substr(0,6);
    date = date.split(" "); //holds the array
    date = date[1]+" "+date[0]; //rearranged text
    var weather = document.createTextNode(tomorrow.text);
    var text = document.createTextNode(tomorrow.day+ " "+date);
    var high = document.createTextNode("High: "+tomorrow.high+"\xB0");
    var low = document.createTextNode("Low: "+tomorrow.low+"\xB0");

    var newDiv = document.createElement("div");
    newDiv.id = 'obj'+int.toString();
    
    var break1 = document.createElement("br");
    var break2 = document.createElement("br");
    var break3 = document.createElement("br");
    var break4 = document.createElement("br");
    var break5 = document.createElement("br");
    var break6 = document.createElement("br");
    
    var span1 = document.createElement("span");
    span1.id = "span1";
    var span2 = document.createElement("span");
    span2.id = "span2";
    var span3 = document.createElement("span");
    span3.id = "span3";
    var span4 = document.createElement("span");
    span4.id = "span4";
    var span5 = document.createElement("span");
    span5.id = "span5";
    var span6 = document.createElement("span");
    span6.id = "span6";
    
    //var day = "1";
    
    
    span1.appendChild(text);
    span1.appendChild(break1);
    span2.appendChild(weather);
    span2.appendChild(break2);
    span3.appendChild(high);
    span3.appendChild(break3);
    span4.appendChild(low);
    span4.appendChild(break5);
    
    if (objBool == true) {
        span5.appendChild(humid);
        span5.appendChild(break6);
        span6.appendChild(wind)
        objBool = false;
        
    }
    else {
        
        span5.appendChild(humid2);
        span5.appendChild(break6);
        span6.appendChild(wind2);
        objBool = false;
    }


    
    
    newDiv.appendChild(span1);
    newDiv.appendChild(span2);
    newDiv.appendChild(span3);
    newDiv.appendChild(span4);
    newDiv.appendChild(span5);
    newDiv.appendChild(span6);
    
    var showImage = tomorrow.text;

    makeWrapper.appendChild(newDiv);
    WeatherIcon(showImage, makeWrapper);
    makeWrapper.appendChild(break4);    
//    /dummyBool3 = true;
}

function WeatherIcon(showImage, makeWrapper) {
    var img = document.createElement("img");
    img.id = "image";
     
    if (((showImage).toLowerCase() == "sunny") || ((showImage).toLowerCase() == "fair (night)") || ((showImage).toLowerCase() == "fair (day)") || ((showImage).toLowerCase() == "mostly sunny") || ((showImage).toLowerCase() == "clear")) {
        img.setAttribute("src", "sunny.png"); 
    }
    
    if ((showImage.toLowerCase() == "tornado") || (showImage.toLocaleLowerCase() == "hurricane")) {
        img.setAttribute("src", "hurricane.png");
    }
    
    if ((showImage.toLowerCase() == "severe thunderstorms") || (showImage.toLocaleLowerCase() == "thunderstorms") || (showImage.toLocaleLowerCase() == "isolated thunderstorms") || (showImage.toLocaleLowerCase() == "scattered thunderstorms") || (showImage.toLocaleLowerCase() == "thundershowers") || (showImage.toLocaleLowerCase() == "isolated thundershowers")) {
        img.setAttribute("src", "thunder.png");
    }
    
    if ((showImage.toLowerCase() == "mixed rain and snow") ||
        (showImage.toLowerCase() == "rain and snow") ||
        (showImage.toLowerCase() == "mixed rain and sleet") || (showImage.toLowerCase() == "freezing drizzle") || (showImage.toLowerCase() == "drizzle") || (showImage.toLowerCase() == "freezing rain") || (showImage.toLowerCase() == "showers") || (showImage.toLowerCase() == "scattered showers") || (showImage.toLowerCase() == "rain")) {
        img.setAttribute("src", "rain.png");
    }
    
    if ((showImage.toLowerCase() == "snow flurries") || (showImage.toLowerCase() == "light snow showers") || (showImage.toLowerCase() == "blowing snow") || (showImage.toLowerCase() == "heavy snow") || (showImage.toLowerCase() == "snow") || (showImage.toLowerCase() == "scattered snow showers") || (showImage.toLowerCase() == "snow showers")) {
        img.setAttribute("src", "snow.png");
    }
    
    if (showImage.toLowerCase() == "tropical storm") {
        img.setAttribute("src","tropstorm.png");
    }
    if (showImage.toLowerCase() == "foggy") {
        img.setAttribute("src","fog.png");
    }
    
    if ((showImage.toLowerCase() == "blustery") || (showImage.toLowerCase() == "wind")) {
        img.setAttribute("src","wind.png");
    } 
    
    if (showImage.toLowerCase() == "cold") {
        img.setAttribute("src","cold.png");
    } 
    
    if ((showImage.toLowerCase() == "hot") || (showImage.toLowerCase() == "dust") || (showImage.toLowerCase() == "haze") || (showImage.toLowerCase() == "smoky")) {
        img.setAttribute("src","hot.png");
    }
    
     if ((showImage.toLowerCase() == "cloudy") || (showImage.toLowerCase() == "mostly cloudy (night)") || (showImage.toLowerCase() == "mostly cloudy (day)") || (showImage.toLowerCase() == "mostly cloudy") || (showImage.toLowerCase() == "partly cloudy (night)") || (showImage.toLowerCase() == "partly cloudy (day)") || (showImage.toLowerCase() == "partly cloudy")) {
        img.setAttribute("src", "cloudy.png");
    }
    
    if ((showImage.toLowerCase() == "hail") || (showImage.toLowerCase() == "sleet") || (showImage.toLowerCase() == "mixed rain and hail")) {
        img.setAttribute("src", "hail.png");
    }

    makeWrapper.appendChild(img);    
} 

function searchKeyPress(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        if (bool3 == true) {
            document.getElementById("buttongo").click();
            bool3 = false;
            objBool = true;
        }

        else {
            document.getElementById("editButton").click();
            objBool = true;
        }
        return false;

    }
    return true;
    
    getZip();
} //run makeScript() after hitting the enter key instead of go 