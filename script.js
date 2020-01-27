/***** TIME TRACKING APP by Michael Worthington******/

var main = document.getElementById('main');
var header = document.getElementById('header');
var taskCounter = 0;
var taskAreaCounter = 0;
// var taskAreaCounter00 = 0;
var timeDivIdCounter = 0;
var focusedTextArea;
var outputTime;


function textToTime(input) {
    var pm = false;
    var colonLocation;
    var inputArray = Array.from(input);
    for (let index = 0; index < inputArray.length; index++) {
        const element = inputArray[index];
        if (isNaN(inputArray[index])){
            switch (true) {
                case (inputArray[index] === 'p' || inputArray[index] === 'P'):
                    pm = true;
                    inputArray.splice(index, 1);
                    index = index - 1;
                    break;
                case (inputArray[index] === 'a'|| inputArray[index] === 'A'):
                    inputArray.splice(index, 1);
                    index = index - 1;
                    break;
                case (inputArray[index] === 'm'|| inputArray[index] === 'M'):
                    inputArray.splice(index, 1);
                    index = index - 1;
                    break;
                case (inputArray[index] === ':'):
                    colonLocation = index;
                    break; 
                default:
                  //alert('Invalid Entry')
            }
        } else {
        }
        
    }
    
    var arrayToString = inputArray.join('');

    function makePM(isPm, cln, str) {
        if (isPm === true) { //if its in the pm
            if(cln !== undefined){ // AND if the colon exists
                var hours = str.substring(0, str.indexOf(":"))
                newHours = String(parseInt(hours) + 12);
                str = str.replace(hours, newHours);
                return str;
            } else { //BUT if there is no colon
                newHours = String(parseInt(str) + 12); //convert string to a number; add 12; then make string again
                str = (str.replace(str, newHours) + ':00'); //now take the new string and add ':00' to it (because there were no colons, thus no minutes)
                return str;
            }
        } else { //if AM (or not PM)
            if(cln !== undefined){ // AND if the colon exists
                // if there is nothing after the colon, add '00's to end of str, then return str;
                var minutes = str.substring((str.indexOf(":")+ 1))
                if (minutes === ''){
                    str = (str + '00');
                    return str;
                } else {
                    return str;
                }
                console.log('the minutes are ' + minutes)
                // if string DOES have stuff after the colon, just return str;
            } else { //BUT if there is no colon
                str = (str + ':00'); //add ':00' to string; Example: '9' to '9:00'
                return str;
            }
        }
    }


    var newTimeString = makePM(pm, colonLocation, arrayToString)


    var newDateTime = toDate(newTimeString,"h:m")
    function toDate(dStr,format) {
        var now = new Date();
        if (format == 'h:m') {
            now.setHours(dStr.substr(0,dStr.indexOf(':')));
            now.setMinutes(dStr.substr(dStr.indexOf(':')+1)); //placing input after ':'
            now.setSeconds(0);
            return now;
        } else {
            now.setHours(dStr);
            now.setMinutes(0);
            return now;
        }
    }
    
        var outputHours = newDateTime.getHours();
        var outputMinutes = ('0'+ newDateTime.getMinutes()).slice(-2);

        switch (true) {
            case (pm === true && outputHours === 0):
                outputTime = (outputHours + 12) + ':' + outputMinutes + 'p';
                break;
            case (pm === true && outputHours !== 0):
                outputTime = (outputHours - 12) + ':' + outputMinutes + 'p';
                break;
            default:
                outputTime = outputHours + ':' + outputMinutes + 'a';
                break;
        }

        // console.log(outputHours);
}


function createNewTask() {
    var task = document.createElement('article');
    task.setAttribute('id', 'task-' + taskCounter++); //creates a unique id
    task.className = 'task';
    //if active element node name === 'BODY': append new element as child to main
    if(document.activeElement.nodeName === 'BODY'){
        main.appendChild(task);
    } else {
        //otherwise insert element into paraent element adjacent to task 
        document.activeElement.parentElement.insertAdjacentElement('afterend', task);
    }

    //Create fontAwesome text for bullet point//
    var bullet = document.createElement('i');
    bullet.className = 'fas fa-circle';
    task.appendChild(bullet);

    //Create Div element for time//
    var timeDiv = document.createElement('input');
    timeDiv.setAttribute('id', 'timeDivId-' + timeDivIdCounter++);
    timeDiv.className = 'time';
    timeDiv.type = 'text';
    timeDiv.value = 'time';
    //timeDiv.pattern = '/^[0-9apm:]+$/i';
    timeDiv.placeholder = '\"8:00a\"'
    task.appendChild(timeDiv);

    //Create taskArea element for task description//
    var taskArea = document.createElement('textarea');
    taskArea.name = 'Generated';
    taskArea.className = 'taskArea';
    taskArea.setAttribute('id', 'taskArea-' + taskAreaCounter++);
    taskArea.cols ='30';
    taskArea.rows ='10';
    taskArea.placeholder = '\"New Task\"'
    task.appendChild(taskArea);

    //clear out Sample text once the user clicks into the input field
    var clearText = function (value){
        if(this.value == 'Sample text' || this.value == 'time')
        this.value = '';
    };
    taskArea.onfocus = clearText;
    timeDiv.onfocus = clearText;

    //puts the time input field into focus (selected) once it's created
    timeDiv.focus();
    
    // taskAreaCounter00 = ("00" + taskAreaCounter).slice(-3);
    // console.log(taskAreaCounter00);
    //isURL()

    
};

function activeTaskId() {
    var activeTaskId = 'task-' + activeIdNumber();
    return activeTaskId;
}

function activeTaskAreaId() {
    var activeTaskArea = 'taskArea-' + activeIdNumber();
    return activeTaskArea;
}

function activeTimeDivId() {
    var activeTimeDiv = 'timeDivId-' + activeIdNumber();
    return activeTimeDiv;
}

function activeIdNumber() {
    var activeId = document.activeElement.parentElement.id;
    var start = activeId.indexOf('-') + 1;
    var end = activeId.length;
    var idNumber = activeId.substring(start,end)
    return idNumber;
}



//special instructions for 'return', 'space' or 'tab' key in time area
document.activeElement.addEventListener('keydown', function (event) {
    if ((event.keyCode === 32 && document.activeElement.className === 'time') || (event.keyCode === 13 && document.activeElement.className === 'time') || (event.keyCode === 9 && document.activeElement.className === 'time')) {
        event.preventDefault();
        //convert text input to time. store in value
        var timeArea = document.getElementById(activeTimeDivId())
        var timeValue = timeArea.value;
        textToTime(timeValue);
        timeArea.value = outputTime;
        //move focus
        var taskArea = document.getElementById(activeTaskAreaId());
        taskArea.focus();
    } else if (event.keyCode === 13 && document.activeElement.className === 'taskArea') {
        event.preventDefault();
        createNewTask()
    } else {

    }
})

//special instructions for 'delete' key in both time and task areas
document.activeElement.addEventListener('keydown', function (event) {
    if (event.keyCode === 8 && document.activeElement.value === '' && document.activeElement.className === 'taskArea'){
        event.preventDefault();
        var timeArea = document.getElementById(activeTimeDivId())
        timeArea.focus();
    } else if (event.keyCode === 8 && document.activeElement.value === '' && document.activeElement.className === 'time'){
        var timeArea = document.getElementById(activeTaskId())
        //-----////
        var lastTask = document.getElementById('task-' + (activeIdNumber()-1))
        var lastTaskArea = lastTask.lastChild
        timeArea.remove();
        event.preventDefault();
        lastTaskArea.focus();
    } else {

    }
    })


//auto expand the textarea while typing
document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase() !== 'textarea') return;
    autoExpand(event.target);
}, false);


var autoExpand = function(field){
    //reset the height 
    field.style.height = '25px';

    // Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                 + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
                 
    field.style.height = height + 'px';
}

/* function isURL() {
    var input = document.querySelector('#' + activeTaskAreaId());
    input.addEventListener('input', function () {
    var pattern = new RegExp('^(.com)'); // fragment locator
      console.log(pattern.test(input.value));
      return pattern.test(input.value);

  });
} */

    var input = document.querySelector('input');
    input.addEventListener('input', function (text) {
    var urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
        })
        // or alternatively
        // return text.replace(urlRegex, '<a href="$1">$1</a>')
    });




/* function urlify(text) {
    var urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
} */


var text = document.getElementById('testInput').value;
/* var text = document.querySelector('#' + activeTaskAreaId());
var html = urlify(text);

console.log(html) */

//capture text from an input while it's being typed
//run the string though urlify()
//return the converted text to 


/* RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$','i'); */



/********** TO DO ************

- get onto github
- make typing '.com' (or any of the most popular top level domains) turn anything before it without a space into a web link (possibly use a pattern expression like /[\.com]/)
- make typing '@' with anything after it activates a location mode
    -...with anything after it that isn't a space
        - 'space' or 'return' should keep it as just an @ character
    - typing @ with characters after it activates accent color change
    - once user hits 'return' they are back into text mode and what they typed turns into a location
    -that location should now act as a link to google maps that searches for that location 

-once site and location detection are done, refine the look (icons, spacing, alignment on mobile, etc).
    -placeholder on mobile is too bright. needs to be dimmer
-then work on changing the title, a menu and color-theme selection.
-then completed. 


- when in time activate number keyboard on iphone (UPDATE: unable to do so.
    the only way to activate numerical keyboard is to set the type attribute
    to "number" but this forces only numbers to enter the input. but the way
    I've set up the numebr conversion in timeDIv it outputs a 'string' not
    numbers. So then nothing is inputted. Using a pattern and expression
    attribute like [0-9a-z] doesnt work with a number type.)



*/


// var testInput2 = document.querySelector('#taskArea-0');
// testInput2.addEventListener('input', function () {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//       console.log(pattern.test(testInput2.value));
//       return pattern.test(testInput2.value);
//   });


// var isURL = document.querySelector('#taskArea-0');
// isURL.addEventListener('input', function () {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//       //console.log(pattern.test(isURL.value));
//       return pattern.test(isURL.value);
//   });
