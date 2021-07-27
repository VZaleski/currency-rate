const arrayCells = document.querySelectorAll('td');
const arrayColumns = document.querySelectorAll('tr');
const inputCurrency = document.querySelector('.entering-currency');
const inputDate = document.querySelector('.input-date');
const arrayCurrencyName = document.querySelectorAll('.currency-name');
const date = new Date();

const arrayID = [
  {
    name: 'eur',
    id: '451'
  }, 
  {
    name: 'usd',
    id: '431'
  }, 
  {
    name: 'rur',
    id: '456'
  }
];

const data = [];

function changePlace(str) {
  let array = str.split('-');
  let temp = '';
  temp = array[0];
  array[0] = array[array.length - 1];
  array[array.length - 1] = temp;
  let newStr = array.join('-');
  return newStr;
}

function currentCalendarDay() {
  const month = date.getMonth() + 1;
  if(month < 10) {
    inputDate.value = `${date.getFullYear()}-0${date.getMonth()}-${date.getDate()}`;
    inputDate.max = `${date.getFullYear()}-0${date.getMonth()}-${date.getDate()}`;
  } else {
    inputDate.value = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    inputDate.max = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}

function today() {
  const dtms =  Date.parse(inputDate.value);
  arrayCells.forEach(element => element.style.background = 'white');
  const countDays = 7;
  const arrayDays = [];
  for (let i = 0; i < countDays; i++) {
    let newdate = new Date(dtms - ((24 * 60 * 60 * 1000) * i));
    let month = newdate.getMonth() + 2;
    arrayDays[i] = `${newdate.getDate()}-${month}-${newdate.getFullYear()}`;
  }
  return arrayDays;
}

function createURL() {
  const arrayDays = today();
  const startDate = changePlace(arrayDays[arrayDays.length - 1]);
  const endDate = changePlace(arrayDays[0]);
  const countRate = 3;
  const arrayURL = [];
  for (let i = 0; i < countRate; i++) {
    arrayURL[i] = `https://www.nbrb.by/api/exrates/rates/dynamics/${arrayID[i].id}?startdate=${startDate}&enddate=${endDate}`;   
  }
  return arrayURL;
}

async function currentRate() {
  const arrayURL = createURL();
  for (let i = 0; i < arrayURL.length; i++) {
      const response = await fetch(arrayURL[i]);
      data[i] = await response.json();
  }
  return data;
}

function addDaysInTable() {
  for (let i = 0; i < 7; i++) {
    let j = i + 1;
    const arrayDays = today();
    arrayCells[j].innerHTML = arrayDays[i];
  }
}

async function addValueInTable() {
  addDaysInTable();
  const array = await currentRate();
  for (let i = 0; i < array.length; i++) {
    const newArray = array[i];
    for (let j = newArray.length - 1; j > -1; j--) {
      let index = 9 + j + 8*i;
      arrayCells[index].innerHTML = newArray[j].Cur_OfficialRate;
    }
  }
  searchMaxAndMin()
}

async function searchMaxAndMin() {
  const countRows = 3;
  const countColumns = 7;
  let max = 0;
  let min = 5;
  let number = 0;
  let index = 0;
  let strMaxNumber = '';
  let strMinNumber = '';
  for (let i = 0; i < countRows; i++) {
    max = 0;
    min = 5;
    for (let j = 0; j <countColumns; j++) {
      index = 9 + j + 8*i;
      number = +arrayCells[index].innerHTML;
      if(max < number) {
        max = number
      } else if( min > number) {
        min = number;
      }
    }
    strMaxNumber = '' + max;
    strMinNumber = '' + min;
    for (let k = 0; k < arrayCells.length; k++) {
      if(arrayCells[k].innerHTML === strMaxNumber) {
        arrayCells[k].style.background = 'green';
      }
      if(arrayCells[k].innerHTML === strMinNumber) {
        arrayCells[k].style.background = 'red';
      }
    }
  }
}

currentCalendarDay();
addValueInTable();

inputCurrency.addEventListener('keydown', function() {
  inputCurrency.addEventListener('keyup', function(e) {
    const arraySymbols = e.target.value.split('');
    let stringSymbols = arraySymbols.join('');
    arrayCurrencyName.forEach(element => {
      if(element.innerHTML.indexOf(stringSymbols) === -1) {
        element.parentNode.style.display = 'none';
      } else {
        element.parentNode.style.display = 'table-row';
      }
    })
  });
});

inputDate.addEventListener('input',() => addValueInTable());