var power = "off"; //Initial state of machine
var lights = "on"; //Initial state of environment

var first = ""; //First number in the equation goes here
var opp = ""; //Operator in same equation goes here
var opp2 = false; //If true, then chain new number onto accumulating stack
var second = ""; //Second number in said equation goes here

var counter = 0; //To be used for limiting user input to 8 numbers, per
var needsRefresh = false; //State check w/ boolean to reset function
var equals = false; //Check if equals has been pressed or not
var savedToMem = "0";
var res;
var piPressed = false;
var mixedFracSet = false;
var xyPressed = false;
var storage;
var storage2;


function init() { //Simulate turning on the calculator here:
  if (lights === "on") { //Lights must be on for calculator to work, of course
    if (power === "off") { //If it's off already, then:
      power = "on"; //Setting power to on...
      $(".onState").css('opacity', '1'); //Power is now visibly on!
      counter = 0; //Ready to count user button-presses
      $(".screenText").html("0"); //And we here set screen to "0"
    } else { //Or, if calc is already on already, then sisply clear everything from memory for user:
      AC(); //Kill them all with fire!
    }
  }
}

function AC() { //Clear all the things:
  first = "";
  opp = "";
  second = "";
  counter = 0;
  equals = false;
  opp2 = false;
  piPressed = false;
  mixedFracSet = false;
  storage = "";
  storage2 = "";
  removeScrollbar();
  $(".screenText").html("0");
}

function powerOff() {
  power = "off"; //*blink* -- Power set to off
  AC(); //Wiping all variables from memory behind the scenes....
  $(".onState").css('opacity', '0'); //Hiding the screen itself, lastly
}

function ecFunc() {
  if (second !== "") { //If both first and second vars are in use, then wipe second var only!
    second = "";
    counter = 0; //New number replaces old in same variable
    removeScrollbar();
    $(".screenText").html(first); //Screen reset to "0"
  } else { //Wipe everything 
    AC();
  }
}

function needsRefreshing(arg) { //Reset the relevant function for its next use if needed:
  if (arg === true) {
    needsRefresh = false; //Set flag back to false
    AC(); //Clear the calculator of last equation before beginning anew
  }
}

function removeScrollbar() {
  $(".onState").removeClass("addScrollbar");
  $(".onState").addClass("hideOverflow");
  $(".screenText").removeClass("raiseTxt");
}

function buttonPress() {
  needsRefreshing(needsRefresh); //Clear screen, etc
  removeScrollbar();
  var val = $(this).val();

  if (power === "on") {
    counter++; //Then count one keystroke per press
    //Check for new equation starting:
    var temp;

    if (xyPressed) {
      xyPressed = false;
      temp = val;
      first = "";
      opp = "";
      second = "";
      counter = 0;
      piPressed = false;
      mixedFracSet = false;
      removeScrollbar();
      first = temp;
      addSB(first);
      $(".screenText").html(first);
    }

    if (first && opp && second && equals && opp2 === false) { //If so,new equation:
      equals = false; //Reset boolean so new equation begins
      first = val;

      //reset remaining equation variables:
      opp = "";
      second = "";
    }

    if (opp === "") {
      //User limited to one zero if zero is already first number:
      if ($(".screenText").html() === "0" && val === "0") {
        counter--; //Cancel counter for each new zero in said state
        $(".screenText").html("0"); //Flash screen input as the same
      }

      //Otherwise, accept input and display it:
      if ($(".screenText").html() === "0") {
        first = $(".screenText").html; //Append new value
      }

      //If decimal, return num to screen, but write to var 'first'
      if ($(".screenText").html() === "0.") { //Prevent div overflow:

        first += $(".screenText").html; //Append new value
        //User continues on from decimal via above
      }

      if (counter === 1) {
        $(".screenText").html(val); //Show new value
        first = $(".screenText").html(); //Set new value

      } else if (counter > 1 && counter <= 9) { //Append...
        //Do for a max. of 8 presses [total]
        val = $(this).val();
        var curOutput = $(".screenText").html(); //Easier!
        $(".screenText").html(curOutput += val); //Add value
        first = $(".screenText").html(); //Add new value
      }
    }
    if (opp !== "") { //If operator has been set:
      if (counter === 1 && val === "0") {
        counter--;
        $(".screenText").html("0");
      }
      if ($(".screenText").html === "0.") { //Prevent div overflow:
        val = $(this).val();
        second += $(".screenText").html; //Append new value
        //User continues on from decimal via above
      }

      if (counter === 1) {
        $(".screenText").html($(this).val()); //Show new value
        second = $(".screenText").html(); //Set new value           
      } else if (counter > 1 && counter <= 9) { //Append...
        //Do for a max. of 8 presses [total]
        val = $(this).val();
        var cur = $(".screenText").html(); //Easier!
        $(".screenText").html(cur += val); //Add value
        second = $(".screenText").html(); //Add new value
      }
    }
  }
}



function addDecimal() {
  //Limit of one decimal per number, per variable in function
  if (power === "on") {
    var html = $(".screenText").html();
    var re = /[.]/g;
    var testRes = re.test(html); //test for '.' with regex 

    //Check for and correct pre-existing answer as false positive condition:
    if ((testRes) && (opp !== "") && counter <= 1) {
      $(".screenText").html("0.");
      counter++;
      counter++;
    }

    if (!(testRes)) { //If there are no decimal points in current number...
      counter++; //To offset the newly added decimal point, +1
      var dot = $(this).val();
      var input = "";

      if (opp !== "") { //First number + operator...
        if (counter == "1") { //If we expect a 0 before decimal point pressed, then:
          input = $(".screenText").html();
          counter++; //To compensate for the added '0'
          $(".screenText").html("0" + dot); //Start with this value
        } else {
          input = $(".screenText").html();
          $(".screenText").html(input + "."); //Append a "."
        }
      } else if (opp === "") { //First number + operator...
        if (counter == "1") { //If we expect a 0 before decimal point pressed, then:
          input = $(".screenText").html();
          counter++; //To compensate for the added '0'
          $(".screenText").html("0" + dot); //Start with this value
        } else {
          input = $(".screenText").html();
          $(".screenText").html(input + "."); //Append a "."
        }
      }
    }
  }
}

function addSB(result) {
  $lenOfStr = result.toString().length;
  if ($lenOfStr > 8) {
    $(".onState").addClass("addScrollbar");
    $(".screenText").addClass("raiseTxt");
  }
}

function doEquals() {
  var res; //RESULT OF EQUATION HERE
  equals = true; //SET FLAG
  counter = 0; //CLEAR COUNT
  piPressed = false; //CLEAR FLAG
  higherPower = false; //CLEAR FLAG

  console.log("1");
  console.log(first, second);

  if (opp === "xy") {
    var res = 1;
    for (var i = 0; i < (second * 1); i++) {
      res *= first;
    }
    xyPressed = true;
    first = res;
    $(".screenText").html(first);
    second = "";
    opp = "";
    needsRefresh = true;
  }
  //If mixedFracSet is TRUE, then divide first by second number. Add result to whole number in storage to form a mixed fraction in decimal format:
  else if (mixedFracSet === true) {
    console.log("2");
    var decimalConv;
    var out;
    mixedFracSet = false;
    decimalConv = eval(first + "/" + second);

    if (storage2 !== "" && storage2 !== undefined) {
      out = second = eval(storage2 + "+" + decimalConv); //ADD DECIMAL TO INT 
      first = storage;
      opp = oldOpp; //REPLACE OPP TO CONTINUE EQUATION
      storage = "";
      storage2 = "";
    } else if (storage !== "" && storage !== undefined) {
      out = first = storage = eval(storage + "+" + decimalConv);
    }
    $(".screenText").html(out);
  } else if (first && second) {
    console.log("3");
    console.log(first, opp, second);
    res = first = eval(first + opp + second);
    if (storage !== "" && storage !== undefined) {
      storage = "";
    }
    console.log("res1=", res);
  }
  addSB(res);
  console.log("res2=", res);
  $(".screenText").html(res);
}


function doPercentage() {
  if (second !== "") {
    var answer;
    var percentOfFirst = eval((first * second) / 100);
    var percentage = eval(second / 100);
    counter = 0;
    needsRefresh = true;

    switch (opp) {
      case "+":
      case "-":
        logged = second = (percentOfFirst);
        break;

      case "*":
      case "/":
        logged = second = (percentage);
        break;

      default:
        alert("ERR!");
        break;
    }
    //Find percent above & display result below:
    addSB(logged);
    $(".screenText").html(logged);
  }
}

function setOperator() {
  var val = $(this).val();
  piPressed = false;

  if (needsRefresh) {
    needsRefresh = false;
  }

  if (xyPressed) {
    xyPressed = false;
  }

  counter = 0;
  var result;

  if (equals) {
    equals = false;
    opp = val;
    opp2 = true;
    second = "";
  } else if (first && !(second)) {
    opp = val;
  } else if (first && second) {
    var oldOpp = opp;
    opp = val;
    //print out first back to screen  
    first = result = eval(first + oldOpp + second);
    addSB(result);
    $(".screenText").text(first);
  }
}

function doSqrt() { //ie SQRT
  var final;

  if (second !== "") {
    if (second > 0) {
      final = second = Math.sqrt(second);
    } else {
      final = "ERR";
    }
  } else if (first !== "") {
    if (first > 0) {
      final = first = Math.sqrt(first);
    } else {
      final = "ERR";
    }
  }
  needsRefresh = true;
  addSB(final);
  $(".screenText").html(final);
} //The '√' func:

function doCube() {
  if (second === "") {
    res = first = (first * first) * first;
  } else if (second !== "") {
    res = second = (second * second) * second;
  }
  needsRefresh = true;
  $(".screenText").html(res);
}

function doMemSave() {
  var flag;
  var placeholder = $(".screenText").html();
  needsRefresh = true;

  if (second !== "") {
    savedToMem = eval(savedToMem + "+" + second);
    flag = false;

  } else if (first !== "") {
    savedToMem = eval(savedToMem + "+" + first);
    flag = true;
  }
  $(".screenText").html(" ");

  setTimeout(function() {
    $(".screenText").html(placeholder);
  }, 150);
} //M+

function doMemRecall() {

  if (storage === "" || storage === undefined) {
    needsRefresh = true;
  }

  $("#screenText").html("0");


  setTimeout(recallVar, 150); //Flash blank screen for split second
} //MR func pt. 1

function recallVar() { //And then return original value for usage:
  var toScreen;

  if (opp !== "") {
    toScreen = second = savedToMem;
  } else if (opp === "") {
    toScreen = first = savedToMem;
  }
  addSB(toScreen);
  $(".screenText").html(toScreen);
} //MR func pt. 2

function doMemDel() {

  savedToMem = "0";
  var stored = $(".screenText").html();

  $(".screenText").html(savedToMem); //Show user is wiped

  setTimeout(function() {
    if (opp === "") {
      first = stored;
      $(".screenText").html(first);
    } else if (opp !== "") {
      second = stored;
      $(".screenText").html(second);
    }
  }, 150); //Then bring back whatever var was there if applicable
} //M-

function doMixedFract() { //Accept a mixed fraction to input as decimal
  mixedFracSet = true;
  storage = first;

  //And then wipe vars to make room for fraction:
  if (second !== "") { //Function tries to work on second number
    storage2 = second;
  }
  oldOpp = opp;
  first = "";
  opp = "";
  second = "";
  counter = 0;
  removeScrollbar();
  $(".screenText").html("0");
}


function doPI() {
  if (!(piPressed)) {
    piPressed = true;
    var piScr;

    if (opp !== "") { //FIT ANSWER TO 8 DIGIT SIZED SCREEN:
      piScr = second = (Math.PI);
    } else if (opp === "") {
      piScr = first = (Math.PI);
    }
    addSB(piScr);
    $(".screenText").html(piScr);
  }
}

function doPosNeg() { //TESTING IF FUNCTION PRODUCES RESULT:
  var litmus = second;
  var screen;

  if (litmus) {
    screen = second = (second * -1);
  } else if (!litmus) {
    screen = first = (first * -1);
  }
  $(".screenText").html(screen);
}


//FOOTER ICONS:
function openNewWindow(url) {
  window.open(url, '_blank');
}

$("#twitt-ico").click(function() {
  $('#trigger').click();
});

$("#github-ico").click(function() {
  openNewWindow("https://www.github.com/nyteksf/");
});

$("#jsfiddle-ico").click(function() {
  openNewWindow("https://fiddle.jshell.net/user/nytek/fiddles/");
});

$("#sendMail-ico").click(function() {
  document.location.href = "mailto:email.nytek@gmail.com?subject=Inquiry";
});


//Buttons galore:
$(".genButton").not("#posneg, #onButton, #ecButton, #offButton, .operators, .func, #deciButton, #percentButton").click(buttonPress);

$("#posneg").click(doPosNeg);

$("#mrPlus").click(doMemSave);

$("#pi").click(doPI);

$("#x3").click(doCube);

$("#abc").click(doMixedFract);

$("#mMinus").click(doMemDel);

$("#mr").click(doMemRecall);

$("#onButton").click(init);

$("#offButton").click(powerOff);

$("#sqrt").click(doSqrt);

$("#ecButton").click(ecFunc);

$("#deciButton").click(addDecimal);

$("#equalsButton").click(doEquals);

$("#percentButton").click(doPercentage);

$(".operators").not("#equalsButton").click(setOperator);


var audio = $("#switchClickSound")[0];

$("#lightSwitch").click(function() { //The Switchs innards:
  $(".shadow").toggle();
  audio.play();

  // TOGGLE THE CSS "SWITCH"
  if ($("#switch")[0].checked === true) {
    $("#switch")[0].checked = false;
  } else {
    $("#switch")[0].checked = true;
  }

  if (power) { //Power off calc with lights
    power = "off";
    $(".screenText").addClass("turnedOff");
    $(".onScreen").addClass("powerDown");
    removeScrollbar();
  }

  if (lights !== "on") { //Only runs when lights are on
    lights = "on";
    $(".screenText").html("");
    $(".screenText").removeClass("turnedOff");
    $(".onScreen").removeClass("powerDown");
    $(".onState").css('opacity', '0');
  } else {
    lights = "off";
  }
});


var testForCtrl = false;

$(document).on('keydown', function(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  var key = evt.key;

  if (evt.which == 17)
    testForCtrl = true;

  console.log(testForCtrl + "...");
  evt.preventDefault();
  evt.stopPropagation();
  //console.log("KEYCODE: ", evt.which);

  if (key === "Enter" || charCode == 13) { //Enter key
    doEquals();
    //alert("ENTER");
    console.log("ENTER");
  } else if (key == "." || charCode == 190 || charCode == 46) {
    $("#decimal").click(); //"." key
  } else if (key === "*" || evt.shiftKey && key == "8" || evt.shiftKey && charCode == 56 || charCode == 106) { //'*' key
    $("#multiply").click();
  } else if (key === "+" || evt.shiftKey && charCode == 187 || charCode == 107) { //'+' key
    $("#plusButton").click();
  } else if (key === "-" || charCode == 189 || charCode == 109) {
    $("#subtract").click(); //'-' key
  } else if (key === "%" || evt.shiftKey && charCode == 53 || charCode == 80) { //'P' key, or SHIFT+5
    $("#percentButton").click();
  } else if (key === "/" || charCode == 191 || charCode == 111) {
    $('#divide').click(); //Foreslash
  } else if (key === "f" || charCode == 70) { //'F' key
    $('#abc').click();
  } else if (evt.shiftKey && key === "m" || evt.shiftKey && charCode == 77) { //'MR' key
    $("#mr").click();
  } else if (key === "c" || charCode == 67) { //'C' key
    $("#x3").click();
  } else if (key === "y" || charCode == 89) { //'Y' key
    $("#xy").click();
  } else if (key === "t" || charCode == 84) { //'T' key
    $("#posneg").click();
  } else if (testForCtrl && charCode == 77) { //ALT+M
    testForCtrl = false;
    $("#mMinus").click();
  } else if (key === "m" || charCode == 77) {
    $("#mrPlus").click(); //SHIFT+M
  } else if (key === "a" || charCode == 65) { //AC key
    $("#pElement").click();
  } else if (key === "o" || charCode == 79) { //'O' key
    $("#offButton").click();
  } else if (key === "i" || charCode == 73) { //'i' key
    $("#pi").click();
  } else if (key === "s" || charCode == 83) { //'S' key
    $("#sqrt").click();
  } else if (key === "e" || charCode == 69) { //'E' key
    $("#ecButton").click();
  } else if (charCode >= 47 && charCode <= 87 || charCode >= 33 && charCode <= 39 || charCode == 40 || charCode == 12 || charCode == 45) {


    if (charCode == 49 || charCode == 35) {
      $("#one").click();
    } else if (charCode == 50) {
      $("#two").click();
    } else if (charCode == 51) {
      $("#three").click();
    } else if (charCode == 52) {
      $("#four").click();
    } else if (charCode == 53) {
      $("#five").click();
    } else if (charCode == 54) {
      $("#six").click();
    } else if (charCode == 55) {
      $("#seven").click();
    } else if (charCode == 56) {
      $("#eight").click();
    } else if (charCode == 57) {
      $("#nine").click();
    } else if (charCode == 48) {
      $("#zero").click();
    }


  }
});


//CUSTOM SIZING FOR VARIOUS BROWSERS:
$(document).ready(function() {

  var testBrowser;
  var fontsize;
  var readMeDivHeight;

  //REPLACE BELOW WITH ALERTIFY CONTENT:
  $(".shadow").hide();
  $(".shadow").addClass("makeClickable");
  $('body').css('font-size', fontsize);
});



/*
MODAL CONFIRM CODE BEGIN HERE
*/

$(document).ready(function() {
    alertify.set({
        labels: {
            cancel: "Close"
        }
    });
});

function alertifyEnabled1() {

	alertify.confirm("Welcome to the nyteksf Replica Electronic Calculator! Please notice the light switch to the left. Screen input even realistically fades to off once it has been flipped. Additionally, this site uses cookies to help shape user experience, but not for tracking. Lastly, please do not skip the below instructions before commencing usage.", function(e) {
        if (e) {
            $('#trigger').click();
            alertify.success("Thank you! Expect to be followed back shortly. <strong>[" + alertify.labels.ok + "]</strong>");
        } else {
            alertify.error("Please follow 'nytekSF' on twitter for the latest updates in JavaScript programming and web development. <strong>[" + alertify.labels.cancel + "]</strong>");
        }

        $("#lightSwitch").click();
    });
    setTimeout(function() {
        $("#lightSwitch").click();
    }, 625);
}


function alertifyEnabled2() {

	 alertify.set({
    		labels: {
        		ok: "Ok",
                cancel: "Close"
    		},
            buttonReverse: true
		});

    alertify.confirm("Welcome back to the nyteksf Electronic Calculator project. Please consider bookmarking this page today if you are able to find the right reasons to just go for it now as you are reading this.", function(e){
    if (e) {
    	$('#bookmark-ico').click();
        } else { return false; }
    });

$('.alertify-button, .alertify-button:hover, .alertify-button:focus, .alertify-button:active').addClass('new-alertify-button');
        //$('.alertify-buttons').addClass('new-alertify-buttons');
        $('.alertify-button-ok, .alertify-button-ok:hover, .alertify-button-ok:focus, .alertify-button-ok:active').addClass('new-alertify-button-ok');
        
        $('.alertify-button-cancel, .alertify-button-cancel:hover, .alertify-button-cancel:focus, .alertify-button-cancel:active').addClass('new-alertify-button-cancel');
        }


function alertifyEnabled3() {

	 alertify.set({
    		labels: {
        		ok: "Ok",
                cancel: "Close"
    		},
            buttonReverse: true
		});

    alertify.confirm("Attention! This is the third consecutive time you've returned to use this calculator. If you're finding it useful thus far, would you like me to try initiating your browsers bookmark setting action for you now with that in mind?", function(e){
    if (e) {
    	$('#bookmark-ico').click();
        alertify.success();
    } else { 
        alertify.error();
        return false; 
    }
});

$('.alertify-button, .alertify-button:hover, .alertify-button:focus, .alertify-button:active').addClass('new-alertify-button');
        //$('.alertify-buttons').addClass('new-alertify-buttons');
        $('.alertify-button-ok, .alertify-button-ok:hover, .alertify-button-ok:focus, .alertify-button-ok:active').addClass('new-alertify-button-ok');
        
        $('.alertify-button-cancel, .alertify-button-cancel:hover, .alertify-button-cancel:focus, .alertify-button-cancel:active').addClass('new-alertify-button-cancel');
        }


/* Hack to otherwise ensure button doesn't lose its pop-through graphic on first run */
var lastFocus;

$('body').mouseover(function(e) {
    e.preventDefault();
    e.stopPropagation();
    //FUNC FIRES ON CLICK:

    if (lastFocus) { //IF ELEMENT HAS DEFOCUSED, DO THIS: 
        lastFocus.focus(); //setting focus back
    }
    return (false);
});

$('body').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    //FUNC FIRES ON CLICK:

    if (lastFocus) { //IF ELEMENT HAS DEFOCUSED, DO THIS: 
        lastFocus.focus(); //setting focus back
    }
    return (false);
});

$(document).mouseover(function(e) {
    e.preventDefault();
    e.stopPropagation();
    //FUNC FIRES ON CLICK:

    if (lastFocus) { //IF ELEMENT HAS DEFOCUSED, DO THIS: 
        lastFocus.focus(); //setting focus back
    }
    return (false);
});

$(document).click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    //FUNC FIRES ON CLICK:

    if (lastFocus) { //IF ELEMENT HAS DEFOCUSED, DO THIS: 
        lastFocus.focus(); //setting focus back
    }
    return (false);
});

$(".alertify-button-ok").blur(function() { //DETECT DEFOCUSING OF ELEMENT
    lastFocus = this; //textarea has lost focus: RECORD IT
});
/*
MODAL CONFIRM CODE END HERE
*/



/* COOKIES: to-be-installed therewith; settable colors, storable themes */
var cookieName;
var tmpOutput;

function setCookie() {
    var d = new Date();
    var curDate = d.getTime();
    var expInDays = (15 * 24 * 60 * 60 * 1000);
    d.setTime(curDate + expInDays);

    var expires = "max-age=" + d.toGMTString();
    document.cookie = tmpOutput = "modalSeen=" + true + "; " + expires + "; path=/;";
    console.log(tmpOutput + "  <= COOKIE HAS BEEN SUCCESSFULLY SET");
}

function getCookie() {
  var ca = document.cookie.split(';');
  alert(ca);
  //console.log(ca); //SHOW WHOLE COOKIE
  for (var i = ca.length - 1; i >= 0; i--) {
    var c = ca[i];
    console.log(c + " c"); //SHOW ONE STRING OF COOKIE AT A TIME

    for (var x = 3; x >= 1; x--) { //MAKE IT COUNT DOWN FROM 3-2-1 TO PREVENT OVERLAP
      while (c.charAt(0) == ' ') c = c.substring(1);
      cookieName = ('alertifyEnabled' + x);
      console.log(cookieName);
      if (c.indexOf('alertifyEnabled' + x) == 0) return c.substring(0, cookieName.length);
    }
  }
  return "";
}

function modCookies(cname) {
  switch (cname) {

    case 'alertifyEnabled1':
      setCookie('alertifyenabled2', 30);
      alertifyEnabled2();
      break;

    case 'alertifyEnabled2':
      setCookie('alertifyEnabled3', 0.5);
      alertifyEnabled3();
      break;

    case 'alertifyEnabled3':
      alert('DO NO-OP');
    default:
      break;
  }

}

function checkCookie() {
  var token = getCookie();
  console.log(token + " Found");

  if (token !== "") {
    alert("COOKIE FOUND");
    modCookies(token);
  } else {
    setCookie('alertifyEnabled1', 0.5);
    alertifyEnabled1();
  }
}

function testForCookie() { //Check cookies if modal restriction set
  var ca = document.cookie.split(';');
  //alert(ca);

  for (var i = ca.length - 1; i >= 0; i--) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);

    if (c.indexOf('modalRestricted') == 0) return true;
  }
  return false;
}

$(document).ready(function() { //Do this first
  modalRestricted = testForCookie(); //-Check if modal has been run today
  if (!modalRestricted) { //If not...
    modalRestricted = true; //Prevent function from firing now
    setCookie('modalRestricted', 0.125); //And block add'l greeting modals for another 3 hours

    checkCookie(); //Lastly, a call to start the appropriate modal
  } else {
    // alert('cookie found: do nothing');
  }
});



//I fully know and understand how user agent sniffing is generally not best practice, although it's somewhat necessary where I've chosen to use it; to accomplish what I want
$('#bookmark-this, #button-ico').click(function(e) {
    var bookmarkURL = window.location.href;
    var bookmarkTitle = document.title;

    if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
        // Mobile browsers
        addToHomescreen({
            autostart: false,
            startDelay: 0
        }).show(true);
    } else if (window.sidebar && window.sidebar.addPanel) {
        // Firefox version < 23
        window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
    } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
        // Firefox version >= 23 and Opera Hotlist
        $(this).attr({
            href: bookmarkURL,
            title: bookmarkTitle,
            rel: 'sidebar'
        }).off(e);
        return true;
    } else if (window.external && ('AddFavorite' in window.external)) {
        // IE Favorite
        window.external.AddFavorite(bookmarkURL, bookmarkTitle);
    } else { // webkit - safari/chrome
    console.log("4");
    var ua = navigator.userAgent.toLowerCase();
    Webkit = (ua.indexOf('webkit') != -1);
    browser = Webkit ? "Webkit (Chrome, Safari, etc.)" : "Unknown Browser";
    Mac = /mac(\s*os|intosh|.*p(ower)?pc)/.test(ua);
    str = (Mac ? 'Command/Cmd' : 'CTRL');
    console.log("a");
    if (window.opera && (!opera.version || (opera.version() < 9))) {
      console.log("b");
      browser = "Opera";
      str += ' + T'; // Opera versions before 9
    } else if (ua.indexOf('konqueror') != -1) {
      console.log("c");
      browser = "Konqueror";
      str += ' + B'; // Konqueror
    } else {
      console.log("d");
      // IE, Firefox, Netscape, Safari, Google Chrome, Opera 9+, iCab, IE5/Mac
      str += ' + D';
    }
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

    alertify.set({
      labels: {
        ok: "Ok",
        cancel: "Close"
      },
      buttonReverse: true
    });

    alertify.alert(' <u>User Info:</u><br>OS:  ' + OSName + '<br>Browser:  ' + browser + "<br><br>In your case, you may want to press " + str + ' to bookmark this page.<br>', function() {
      return false;
    });


    //$('.alertify-button, .alertify-button:hover, .alertify-button:focus, .alertify-button:active').addClass('cleanslate');

    $('.alertify-button, .alertify-button:hover, .alertify-button:focus, .alertify-button:active').addClass('new-alertify-button');
    //$('.alertify-buttons').addClass('new-alertify-buttons');
    $('.alertify-button-ok, .alertify-button-ok:hover, .alertify-button-ok:focus, .alertify-button-ok:active').addClass('new-alertify-button-ok');

    $('.alertify-button-cancel, .alertify-button-cancel:hover, .alertify-button-cancel:focus, .alertify-button-cancel:active').addClass('new-alertify-button-cancel');

  }
  console.log("6");
});
