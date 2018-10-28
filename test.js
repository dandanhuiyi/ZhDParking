
    var start = 0;
    var running = false;
    var result = 'https://m.zhundao.net/event/';
    var baseUrl = 'https://open.zhundao.net/api/PerBase/GetSingleActivity?accesskey=undefined&from=web&activityId=';
    

    getData = function(url){
        if(!url) return;
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();
        request.onreadystatechange =function(){
            if(request.readyState === 4 && request.status === 200){
                getResponse(request.responseText)
            }
        }
    }
    


    generateUrl = function (start){
        if (isNaN(start) || start < 0) {
            sendMsg('miss start index');
            return "";
        }
        return baseUrl + start;
    }




    isParking = function(title,address){
        return title.includes('车位') || address.includes('中软')
    }


    getResponse = function(responseText){
        var response = JSON.parse(responseText);
        if(response.Data && isParking(response.Data.Title,response.Data.Address)){
            result += response.Data.ID;
            running = false;
            sendMsg(result);
        }
        else{
            running = true;
            start -= 1;
            setTimeout(function(){run(start)},2000);
        }
    }


    sendMsg = function(msg){
        var div = document.querySelector('#msg');
        if(!div){
            div = document.createElement('div').innerText = msg;
            document.body.appendChild(div);
        }else{
            div.innerText = msg;
        }
    }

    run = function(startId){
        if(!startId){
            var startValue = document.getElementsByName('start')[0].value;
            start = startValue;
        }
        else{
            start = startId;
        }
        sendMsg('Running......');
        running = true;
        while(running){
            running = false;
            let url = generateUrl(start);
            getData(url);
        }
    }