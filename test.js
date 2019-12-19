
var start = 0;
var result = 'https://m.zhundao.net/event/';
var baseUrl = 'https://open.zhundao.net/api/PerBase/GetSingleActivity?accesskey=undefined&from=web&activityId=';
var timer;

getData = function (url) {
    if (!url) return;
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            getResponse(request.responseText)
        }
        else if (request.readyState === 4 && request.status === 500) {
            start -= 1;
            window.clearTimeout(timer);
            timer = setTimeout(function () { run(start) }, Math.round(Math.random() * 10) * 1000);
        }
        // else {
        //     start -= 1;
        //     window.clearTimeout(timer);
        //     timer = setTimeout(function () { run(start) }, 10000);
        // }
    }
}



generateUrl = function (start) {
    if (isNaN(start) || start < 0) {
        sendMsg('miss start index');
        return "";
    }
    return baseUrl + start;
}




isParking = function (title, address, userId) {
    return title.includes('中软') || address.includes('中软') || userId == 1961233
}


getResponse = function (responseText) {
    var response = JSON.parse(responseText);
    console.log(response.Data.Title, response.Data.ID);
    if (response.Data && isParking(response.Data.Title, response.Data.Address, response.Data.UserID)) {
        result += response.Data.ID;
        sendMsg(result);
        window.clearTimeout(timer);
    }
    else {
        start -= 1;
        window.clearTimeout(timer)
        timer = setTimeout(function () { run(start) }, Math.round(Math.random() * 10) * 1000);
    }
}


sendMsg = function (msg) {
    var div = document.querySelector('#msg');
    if (!div) {
        div = document.createElement('div').innerText = msg;
        document.body.appendChild(div);
    } else {
        div.innerText = msg;
    }
}

run = function (startId) {
    if (!startId) {
        var startValue = document.getElementsByName('start')[0].value;
        start = startValue;
    }
    else {
        start = startId;
    }
    var stopValue = document.getElementsByName('stop')[0].value;
    if (startId == stopValue) {
        console.log('Stop ' + startId);
        stop();
        return;
    }
    sendMsg('Running......');
    let url = generateUrl(start);
    getData(url);
}

stop = function () {
    window.clearTimeout(timer);
    sendMsg('Start');
}