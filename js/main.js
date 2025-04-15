// *global variables
let userName = document.getElementById('userName');
let email = document.getElementById('email');
let password = document.getElementById('password');

let hiddenIcon  = document.getElementById('hiddenIcon');
let visibleIcon  = document.getElementById('visibleIcon');

let signupButton = document.getElementById('signupButton');
let loginButton = document.getElementById('loginButton');
let logoutButton = document.getElementById('logoutButton');

let welcomeMessage = document.getElementById('welcomeMessage');

let errorFlag = false;
let currentName;

const Regex = {
    userName: /^[a-zA-Z]{3,15}(?: [a-zA-Z]{3,15}){0,4}$/,
    email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
}

const errorMessages = {
    userName: document.getElementById('nameErrorMessage'),
    email: document.getElementById('emailErrorMessage'),
    password: document.getElementById('passwordErrorMessage'),
    loginError: document.getElementById('loginErrorMessage')
}

let usersList = [];

// * lw 3ndy usersList fe el localstorage display them 
// * (awl ma a3ml refresh aw lma a5rog w ad5ol el website b3den)
if(JSON.parse(localStorage.getItem('usersList')) != null){
    usersList = JSON.parse(localStorage.getItem('usersList'));
}

// *show password
function showPassword(){
    hiddenIcon.classList.add('d-none');
    visibleIcon.classList.remove('d-none');
    password.type = 'text';
}
if(hiddenIcon){
    hiddenIcon.addEventListener('click' , showPassword);
}

// *hide password
function hidePassword(){
    hiddenIcon.classList.remove('d-none');
    visibleIcon.classList.add('d-none');
    password.type = 'password';
}
if(visibleIcon){
    visibleIcon .addEventListener('click' , hidePassword);
}

// *check lw el inputs empty
function isEmpty(){
    if(signupButton){
        return email.value == '' || password.value == '' || userName.value == '';
    }
    else{
        return email.value == '' || password.value == '';
    }
}

// *to clear el inputs
function clear(){
    if(signupButton){
        userName.value = '';
    }
    email.value = '';
    password.value= '';
}

// *check if el email exist
function isEmailExist(){
    for(let i = 0; i < usersList.length ; ++i){
        if(usersList[i].email == email.value){
            // currentEmail
            return true;
        }
    }
    return false;
}

// *check lw el user da exist
function matchEmailWithPassword(){
    for(let i = 0; i < usersList.length; ++i){
        if(email.value === usersList[i].email && password.value === usersList[i].password){
            sessionStorage.setItem('currentName' , JSON.stringify(usersList[i].userName));
            return true;
        }
    }
    return false;
}

// *to add in local storage
function addUser(){
    let user ={
        userName: userName.value,
        email: email.value,
        password: password.value
    }

    usersList.push(user);

    localStorage.setItem('usersList' , JSON.stringify(usersList));
}

// *check lw el inputs valid
function regexValidation(field){
    let regex = Regex[field.id];
    let value = field.value;

    if(regex.test(value)){
        errorMessages[field.id].classList.add('d-none');
        return true;
    }
    else{
        errorMessages[field.id].classList.remove('d-none');
        errorFlag = true;
        return false;
    }
}

// *show alter
function errorAlter(text){
    Swal.fire({
        title: 'Error!',
        html: text,
        icon: 'error',
        iconColor: '#ae2012',
        confirmButtonColor: '#ae2012',
        color: '#504e52',
    });
}

// *show toast message
function showToastMessage(icon, position, title , iconColor){
    Swal.fire({
        toast: true,
        icon: icon,
        position: position,
        iconColor: iconColor,
        title: title,
        showConfirmButton: false,
        color: '#504e52',
        timer: 1500, 
    });
}

// *handle signup button
if (signupButton){
    signupButton.addEventListener('click' , function(event){
        event.preventDefault();
    
        if(isEmpty()){
            errorAlter("Fields can't be empty!");
            return;
        }
    
        regexValidation(userName);
        regexValidation(email);
        regexValidation(password);
        if(errorFlag){
            return;
        }
    
        if(isEmailExist()){
            showToastMessage('warning' , 'center' , 'Email already exists!' , '#ae2012');
            return;
        }
    
        addUser();
        hidePassword();
        clear();
        showToastMessage('success' , 'center' , "You've successfully registered" , '#17a2b8');
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// *handle login button
if(loginButton){
    loginButton.addEventListener('click' , function(event){
        event.preventDefault();
    
        if(isEmpty()){
            errorAlter("Fields can't be empty!");
            return;
        }
    
        // regexValidation(email);
        // regexValidation(password);
        // if(errorFlag){
        //     return;
        // }

        if(!matchEmailWithPassword()){
            errorMessages['loginError'].classList.remove('d-none');
            return
        }
        else{
            errorMessages['loginError'].classList.add('d-none');
        }

        hidePassword();
        clear();
        showToastMessage('success' , 'center' , "You've successfully logged in" , '#17a2b8');
        setTimeout(function() {
            window.location.href = 'home.html';
        }, 1500);
    })
}

// *to display welcome message
if(welcomeMessage){
    currentName = JSON.parse(sessionStorage.getItem('currentName'));
    welcomeMessage.innerHTML = `Welcome, ${currentName}! Great to see you here &#9829;`;
}

// *handle logout button
if(logoutButton){
    logoutButton.addEventListener('click' , function(){
        showToastMessage('info' , 'center' , `See you soon ${currentName}! &#128075;` , '#17a2b8');
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1500);
    })
}