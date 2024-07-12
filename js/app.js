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
      $(".on-state").css('opacity', '1'); //Power is now visibly on!
      counter = 0; //Ready to count user button-presses
      $(".screen-text").html("0"); //And we here set screen to "0"
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
  $(".screen-text").html("0");
}

function powerOff() {
  power = "off"; //*blink* -- Power set to off
  AC(); //Wiping all variables from memory behind the scenes....
  $(".on-state").css('opacity', '0'); //Hiding the screen itself, lastly
}

function ecFunc() {
  if (second !== "") { //If both first and second vars are in use, then wipe second var only!
    second = "";
    counter = 0; //New number replaces old in same variable
    removeScrollbar();
    $(".screen-text").html(first); //Screen reset to "0"
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
  $(".on-state").removeClass("addScrollbar");
  $(".on-state").addClass("hideOverflow");
  $(".screen-text").removeClass("raiseTxt");
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
      $(".screen-text").html(first);
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
      if ($(".screen-text").html() === "0" && val === "0") {
        counter--; //Cancel counter for each new zero in said state
        $(".screen-text").html("0"); //Flash screen input as the same
      }

      //Otherwise, accept input and display it:
      if ($(".screen-text").html() === "0") {
        first = $(".screen-text").html; //Append new value
      }

      //If decimal, return num to screen, but write to var 'first'
      if ($(".screen-text").html() === "0.") { //Prevent div overflow:

        first += $(".screen-text").html; //Append new value
        //User continues on from decimal via above
      }

      if (counter === 1) {
        $(".screen-text").html(val); //Show new value
        first = $(".screen-text").html(); //Set new value

      } else if (counter > 1 && counter <= 9) { //Append...
        //Do for a max. of 8 presses [total]
        val = $(this).val();
        var curOutput = $(".screen-text").html(); //Easier!
        $(".screen-text").html(curOutput += val); //Add value
        first = $(".screen-text").html(); //Add new value
      }
    }
    if (opp !== "") { //If operator has been set:
      if (counter === 1 && val === "0") {
        counter--;
        $(".screen-text").html("0");
      }
      if ($(".screen-text").html === "0.") { //Prevent div overflow:
        val = $(this).val();
        second += $(".screen-text").html; //Append new value
        //User continues on from decimal via above
      }

      if (counter === 1) {
        $(".screen-text").html($(this).val()); //Show new value
        second = $(".screen-text").html(); //Set new value           
      } else if (counter > 1 && counter <= 9) { //Append...
        //Do for a max. of 8 presses [total]
        val = $(this).val();
        var cur = $(".screen-text").html(); //Easier!
        $(".screen-text").html(cur += val); //Add value
        second = $(".screen-text").html(); //Add new value
      }
    }
  }
}



function addDecimal() {
  //Limit of one decimal per number, per variable in function
  if (power === "on") {
    var html = $(".screen-text").html();
    var re = /[.]/g;
    var testRes = re.test(html); //test for '.' with regex 

    //Check for and correct pre-existing answer as false positive condition:
    if ((testRes) && (opp !== "") && counter <= 1) {
      $(".screen-text").html("0.");
      counter++;
      counter++;
    }

    if (!(testRes)) { //If there are no decimal points in current number...
      counter++; //To offset the newly added decimal point, +1
      var dot = $(this).val();
      var input = "";

      if (opp !== "") { //First number + operator...
        if (counter == "1") { //If we expect a 0 before decimal point pressed, then:
          input = $(".screen-text").html();
          counter++; //To compensate for the added '0'
          $(".screen-text").html("0" + dot); //Start with this value
        } else {
          input = $(".screen-text").html();
          $(".screen-text").html(input + "."); //Append a "."
        }
      } else if (opp === "") { //First number + operator...
        if (counter == "1") { //If we expect a 0 before decimal point pressed, then:
          input = $(".screen-text").html();
          counter++; //To compensate for the added '0'
          $(".screen-text").html("0" + dot); //Start with this value
        } else {
          input = $(".screen-text").html();
          $(".screen-text").html(input + "."); //Append a "."
        }
      }
    }
  }
}

function addSB(result) {
  $lenOfStr = result.toString().length;
  if ($lenOfStr > 8) {
    $(".on-state").addClass("addScrollbar");
    $(".screen-text").addClass("raiseTxt");
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
    $(".screen-text").html(first);
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
    $(".screen-text").html(out);
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
  $(".screen-text").html(res);
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
    $(".screen-text").html(logged);
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
    $(".screen-text").text(first);
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
  $(".screen-text").html(final);
} //The '√' func:

function doCube() {
  if (second === "") {
    res = first = (first * first) * first;
  } else if (second !== "") {
    res = second = (second * second) * second;
  }
  needsRefresh = true;
  $(".screen-text").html(res);
}

function doMemSave() {
  var flag;
  var placeholder = $(".screen-text").html();
  needsRefresh = true;

  if (second !== "") {
    savedToMem = eval(savedToMem + "+" + second);
    flag = false;

  } else if (first !== "") {
    savedToMem = eval(savedToMem + "+" + first);
    flag = true;
  }
  $(".screen-text").html(" ");

  setTimeout(function() {
    $(".screen-text").html(placeholder);
  }, 150);
} //M+

function doMemRecall() {

  if (storage === "" || storage === undefined) {
    needsRefresh = true;
  }

  $("#screen-text").html("0");


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
  $(".screen-text").html(toScreen);
} //MR func pt. 2

function doMemDel() {

  savedToMem = "0";
  var stored = $(".screen-text").html();

  $(".screen-text").html(savedToMem); //Show user is wiped

  setTimeout(function() {
    if (opp === "") {
      first = stored;
      $(".screen-text").html(first);
    } else if (opp !== "") {
      second = stored;
      $(".screen-text").html(second);
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
  $(".screen-text").html("0");
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
    $(".screen-text").html(piScr);
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
  $(".screen-text").html(screen);
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
$(".button__gen").not("#posneg, #on-button, #ec-button, #off-button, .operators, .func, #deciButton, #percent-button").click(buttonPress);

$("#posneg").click(doPosNeg);

$("#mr-plus").click(doMemSave);

$("#pi").click(doPI);

$("#x3").click(doCube);

$("#abc").click(doMixedFract);

$("#m-minus").click(doMemDel);

$("#mr").click(doMemRecall);

$("#on-button").click(init);

$("#off-button").click(powerOff);

$("#sqrt").click(doSqrt);

$("#ec-button").click(ecFunc);

$("#deciButton").click(addDecimal);

$("#equalsButton").click(doEquals);

$("#percent-button").click(doPercentage);

$(".operators").not("#equalsButton").click(setOperator);


var audio = $("#switch-click-sound")[0];
//alert(audio); //CHECK OUT RESULT

$("#light-switch").click(function() { //The Switchs innards:
  $(".shadow").toggle();
  audio.play();

  if (power) { //Power off calc with lights
    //$("#on-state").css('opacity', '0');
    power = "off";
    $(".screen-text").addClass("turnedOff");
    $(".onScreen").addClass("powerDown");
    removeScrollbar();
  }

  if (lights !== "on") { //Only runs when lights are on
    lights = "on";
    $(".screen-text").html("");
    $(".screen-text").removeClass("turnedOff");
    $(".onScreen").removeClass("powerDown");
    $(".on-state").css('opacity', '0');
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
    $("#percent-button").click();
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
    $("#m-minus").click();
  } else if (key === "m" || charCode == 77) {
    $("#mr-plus").click(); //SHIFT+M
  } else if (key === "a" || charCode == 65) { //AC key
    $("#p-element").click();
  } else if (key === "o" || charCode == 79) { //'O' key
    $("#off-button").click();
  } else if (key === "i" || charCode == 73) { //'i' key
    $("#pi").click();
  } else if (key === "s" || charCode == 83) { //'S' key
    $("#sqrt").click();
  } else if (key === "e" || charCode == 69) { //'E' key
    $("#ec-button").click();
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

  var Opera = (navigator.userAgent.match(/Opera|OPR\//) ? true : false);

  if (Opera === true) {
    $(".shadow").css('width', '112.5%').hide();
    fontsize = "'100%'";
  } else if (navigator.userAgent.indexOf("Chrome") != -1) {
    $(".shadow").css('width', '112.5%').hide();
    fontsize = "'100%'";
  } else if (navigator.userAgent.indexOf("Firefox") != -1) {
    fontsize = "'95%'";
    $("#magic-text").css('left', '55px');
    $(".shadow").css('width', '120.4%').hide();
  } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode === true)) //IF IE > 10
  {
    $(".shadow").css('width', '113%').hide();
    fontsize = "'100%'";
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    alert('Safari Detected: BROWSER MODE UNTESTED');
    $(".shadow").css('height', '507px').hide();
    $(".shadow").css('width', '100%').hide();
    fontsize = "'100%'";
  } else {
    alert("UNDETECTABLE BROWSER IN USE: DEFAULT MODE ACTIVATED");
    fontsize = "'100%'";
    //REPLACE BELOW WITH ALERTIFY CONTENT:
    $(".shadow").css('width', '100%').hide();
    $(".shadow").addClass("makeClickable");
  }
  $(".shadow").addClass("makeClickable");
  $('body').css('font-size', fontsize);
});
