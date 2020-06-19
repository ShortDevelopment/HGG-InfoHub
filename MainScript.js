var VItem = '<div class="VItem"><div id="time"><!-- time --></div><div id="where"><!-- where --></div><div id="what"><!-- what --></div></div>';
var ScrollInterval = 10000;
var MapVisibleTime = 10000;
var MapNotVisibleTime = 20000;
var CheckInterval = 1000;
function init() {
    alert("Die Löschverzögerung, etc. kann in der SkriptDatei einstellt werden.")
    fadeIn();
    setInterval(function () {
        var container = document.getElementById("veranstaltungen");
        var height;
        if (container.scrollTop == 0) { height = container.scrollHeight; } else { height = 0; }
        $(container).animate({ scrollTop: height }, '5000');
    }, ScrollInterval);
    setInterval(function () {
        var child = document.createElement("div")
        var min = new Date().getMinutes();
        if (min < 10) { min = "0" + min.toString() }        
        var timeNow = new Date().getHours().toString() + ":" + min.toString() + " Uhr";
        var html = VItem.replace("<!-- time -->", timeNow);
        html = html.replace("<!-- where -->", "here");
        html = html.replace("<!-- what -->", "that");        
        var container = document.getElementById("VContainer"); //.innerHTML += html;
        var timeChilds = container.getElementsByClassName("VItem")                
        for (var i = 0; i <= timeChilds.item.length; i++) {
            var nChild = timeChilds.item(i);
            var innerHTML = nChild.innerHTML.toString();
            var time = innerHTML.split('<div id="time">')[1].split('</div>')[0];
            var timeNowSpecial = parseInt(new Date().getHours().toString() + min.toString());
            var actualTime;
            if (time.toString().indexOf(",") !== -1) { actualTime = time.substring(time.lastIndexOf(",")+2); } else { actualTime = time; }
            if (time.toString().indexOf("-") !== -1) { actualTime = time.split("-")[1] } else { actualTime = time; }            
            var timeSpecial = parseInt(actualTime.split(":")[0] + actualTime.split(":")[1]);
            if (timeSpecial.toString().length == 2) { timeSpecial = parseInt(timeSpecial.toString() + "00"); }
            //alert(time + ": " + timeSpecial);
            if (timeNowSpecial - 2 >= timeSpecial) { container.removeChild(nChild) }; //else { alert(timeNowSpecial + " | " + timeSpecial) }
            if (timeNowSpecial >= timeSpecial) { nChild.setAttribute("style", "color:red;"); };
        }
    }, CheckInterval);
}
function fadeIn() {
    $("#map").fadeIn("slow");
    setTimeout(function () { fadeOut() }, MapVisibleTime);
}
function fadeOut() {
    $("#map").fadeOut("slow");
    setTimeout(function () { fadeIn() }, MapNotVisibleTime);
}
function setup() {
    globalMediaContainer = document.getElementById("MediaElements");
    MediaCount = globalMediaContainer.childNodes.length;    
}
function MEnter(element) {
    element.getElementsByClassName("playButton")[0].src = 'Media/playButton_dark.png';
    element.style.backgroundColor = "orangered";
}
function MLeave(element) {
    element.getElementsByClassName("playButton")[0].src = 'Media/playButton.png';
    element.style.backgroundColor = "#592336";
}
function playV(element) {
    document.getElementById("audio").style.display = 'none';
    document.getElementById("audio").pause(); 
    document.getElementById("countdown").style.display = 'none';
    var ele = document.getElementById("video");
    ele.style.display = 'block';
    ele.src = "Media/" + element.getElementsByTagName("p")[0].innerText + ".mp4";
    ele.play();
    globalElement = element;
    globalMediaElement = ele;
    activeMediaID = element.id;
    ele.ontimeupdate = function () { checkMediaEnded(); };
    //requestFullScreen(ele);
}
function requestFullScreen(ele) {
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method  
            (document.mozFullScreen || document.webkitIsFullScreen);
    var docElm = ele;
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
            //alert("Mozilla entering fullscreen!");
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
            //alert("Webkit entering fullscreen!");
        }
    }
}
function cancelFullScreen(ele) {
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method  
            (document.mozFullScreen || document.webkitIsFullScreen);
    var docElm = ele;
    if (isInFullScreen) {
        try{
            ele.webkitExitFullscreen();
        } catch (ex) {
            try{
                ele.mozCancelFullscreen();
            }catch(ex){
                try{
                    ele.exitFullscreen();
                } catch (ex) { }
            }
        }
    }
}
function playA(element) {
    var video = document.getElementById("video");
    video.pause();
    try{
        //video.poster = "Media/" + element.getElementsByTagName("p")[0].innerText + ".png";
        video.style.display = 'none';
    } catch (ex) {
        video.style.display = 'none';
    }        
    document.getElementById("countdown").style.display = 'none';
    var ele = document.getElementById("audio");   
    ele.style.display = 'block';
    ele.src = "Media/" + element.getElementsByTagName("p")[0].innerText + ".mp3";    
    ele.play();
    globalElement = element;
    globalMediaElement = ele;
    activeMediaID = element.id;    
    ele.ontimeupdate = function () { checkMediaEnded(); };
}
var globalElement;
var globalMediaElement;
var globalMediaContainer;
var activeMediaID = "m1";
var MediaCount;
function checkMediaEnded() {    
    var ele = globalMediaElement;
    if (ele.ended == true) {
        nextMedia();
    }
}
function nextMedia() {
    cancelFullScreen(document.getElementById(activeMediaID));
    ZeitKapselCountdown();
    setTimeout(function () {
        var number = parseInt(activeMediaID.split("m")[1]);
        var newNumber;
        if (number == MediaCount) {
            newNumber = 1;
        } else {
            newNumber = number + 1;
        }
        var eleID = "m" + newNumber.toString();
        try{
            var element = document.getElementById(eleID);
            //alert(element.title);
            if (element.title == "Video") {
                playV(element);
            } else {
                playA(element);
            }
        } catch (ex) { alert(ex.message);}
    }, 10000);
}
function ZeitKapselCountdown() {
    cancelFullScreen(document.getElementById("video"));
    document.getElementById("video").style.display = 'none';
    document.getElementById("countdown").style.display = 'block';
    document.getElementById("audio").style.display = 'none';
}