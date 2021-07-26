const arrayCells = document.querySelectorAll('td');
const arrayColumns = document.querySelectorAll('tr');

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

function today() {
  const date = new Date();
  const dtms = date.valueOf();
  const countDays = 7;
  const arrayDays = [];
  for (let i = 0; i < countDays; i++) {
    let newdate = new Date(dtms - ((24 * 60 * 60 * 1000) * i));
    let month = newdate.getMonth() + 1;
    arrayDays[i] = `${newdate.getDate()}-${month}-${newdate.getFullYear()}`
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
    console.log(strMaxNumber);
    console.log(strMinNumber);
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

addValueInTable();