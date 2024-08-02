
//Fecting all the classes
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initiallize the starting value
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider(); //this will reflect change to our ui

setIndicator("#ccc");
//set pswd length
function handleSlider() { //iska kaam bas itna h ki ye pswd ki length ko ui me refelect krvta h
  inputSlider.value = passwordLength;
  lengthDisplay.innerHTML = passwordLength;

  const min =  inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//for getting random number

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

//strength

function calcStrength() {
  let hasUpper = false;
  let hasLover = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLover = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLover && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLover || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    if(password === ""){
       alert("Fist Generate Passsword then copy");
       throw 'Failed';
    }
    await navigator.clipboard.writeText(password); //return promis
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = error;
  }

  //to make copy vala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);

}

copyBtn.addEventListener('click',() => {
      copyContent();
});


//refresh 
function refresh(){
  window.location.reload("Refresh")
}


function shufflePassword(array){
    //fisher yates method
    for(let i = array.length - 1 ; i>0 ; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str+=el));
    return str;
}



function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    })
}

//speciall case when all of the conditions are check and we need length 1 pswd 
// so by default it give pswd of length 4
if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

generateBtn.addEventListener('click',()=>{
    //none of the checkbox is selected
    if(checkCount == 0)
        return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); 
    }

    //then, we create a new pswd
    
    // remove the old pswd 
    password = "";

    //put the neccessary thing which is selected in checkbox

//     if(uppercaseCheck.checked){
//         password += generateUpperCase();
        
//     }
//     if(uppercaseCheck.checked){
//         password += generateLowerCase();

//     }
//     if(uppercaseCheck.checked){
//         password += generateRandomNumber();

//     }
//     if(uppercaseCheck.checked){
//         password += generateSymbol();

//     }
   let funArr =[];

   if(uppercaseCheck.checked){
    funArr.push(generateUpperCase);
   }
   if(lowercaseCheck.checked){
    funArr.push(generateLowerCase);
   }
   if(numbersCheck.checked){
    funArr.push(generateRandomNumber);
   }
   if(symbolsCheck.checked){
    funArr.push(generateSymbol);
   }

   //compulsory Addition
   for(let i = 0; i<funArr.length ;i++){
    password+=funArr[i]();
   }

   console.log("Compulsory done");
   //remaining addition
   for(let i = 0 ; i<passwordLength - funArr.length ; i++){
    let randIndex = getRndInteger(0,funArr.length);
    password+=funArr[randIndex]();
   }
   console.log("Remainig done");

//    shuffle the password
   password = shufflePassword(Array.from(password));

   console.log("Suffle done");
   
   //show in UI
   passwordDisplay.value = password;

   console.log("strength done");
   
   //find strength
   calcStrength();

 
})

