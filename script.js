const arrayCells = document.querySelectorAll('td');
const arrayColumns = document.querySelectorAll('tr');
const inputCurrency = document.querySelector('.entering-currency');
const inputDate = document.querySelector('.input-date');
const arrayCurrencyName = document.querySelectorAll('.currency-name');
const date = new Date();

//id с 8 июля 2021 года по 2050 год
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

//id c 1июля 2016 года по 8 июля 2021 года
const arrayOldId = [
  {
    name: 'eur',
    id: '292'
  }, 
  {
    name: 'usd',
    id: '145'
  }, 
  {
    name: 'rur',
    id: '298'
  }
];

const data = [];

//функция замены первого и последнего элемента массива между собой
function changePlace(str) {
  let array = str.split('-');
  let temp = '';
  temp = array[0];
  array[0] = array[array.length - 1];
  array[array.length - 1] = temp;
  let newStr = array.join('-');
  return newStr;
}

//функция, которая определяет текущий день и указывает этот день как стартовый в календаре
function currentCalendarDay() {
  const month = date.getMonth() + 1;
  if(month < 10) {
    inputDate.value = `${date.getFullYear()}-0${month}-${date.getDate()}`;
    inputDate.max = `${date.getFullYear()}-0${month}-${date.getDate()}`;
  } else {
    inputDate.value = `${date.getFullYear()}-${month}-${date.getDate()}`;
    inputDate.max = `${date.getFullYear()}-${month}-${date.getDate()}`;
  }
}

//функция, которая возвращает массив дней, начиная с дня указанного в календаре
function today() {
  const dtms =  Date.parse(inputDate.value);
  arrayCells.forEach(element => element.style.background = 'white');
  const countDays = 7;
  const arrayDays = [];
  for (let i = 0; i < countDays; i++) {
    let newdate = new Date(dtms - ((24 * 60 * 60 * 1000) * i));
    let month = newdate.getMonth() + 1;
    arrayDays[i] = `${newdate.getDate()}-${month}-${newdate.getFullYear()}`;
  }
  return arrayDays;
}

//функция создания адресов, для получения данных из API
function createURL() {
  const arrayDays = today();
  const dateOneJulyNewId = '2021-7-8'; //начало действия новых id валют национального банка( старые с 1 июля 2016 по 8 июля 2021года)
  const startDate = changePlace(arrayDays[arrayDays.length - 1]);
  const endDate = changePlace(arrayDays[0]);
  const numberDateOneJuly = Date.parse(dateOneJulyNewId);
  const numberStartDate = Date.parse(startDate);
  const countRate = 3;
  const arrayURL = [];
  for (let i = 0; i < countRate; i++) {
    if( numberDateOneJuly < numberStartDate) {
      arrayURL[i] = `https://www.nbrb.by/api/exrates/rates/dynamics/${arrayID[i].id}?startdate=${startDate}&enddate=${endDate}`;
    }else {
      arrayURL[i] = `https://www.nbrb.by/api/exrates/rates/dynamics/${arrayOldId[i].id}?startdate=${startDate}&enddate=${endDate}`; 
    }
  }
  return arrayURL;
}

//функция получения данных из API национального банка
async function currentRate() {
  const arrayURL = createURL();
  for (let i = 0; i < arrayURL.length; i++) {
      const response = await fetch(arrayURL[i]);
      data[i] = await response.json();
  }
  return data;
}

//функция добавления дней в ячейки таблицы
function addDaysInTable() {
  let days = 7;
  for (let i = 0; i < days; i++) {
    let j = i + 1;
    const arrayDays = today();
    arrayCells[j].innerHTML = arrayDays[i];
  }
}

//функция добавления значений полученных из API в ячейки таблицы
async function addValueInTable() {
  addDaysInTable();
  const array = await currentRate();
  for (let i = 0; i < array.length; i++) {
    const newArray = array[i];
    for (let j = newArray.length - 1; j > -1; j--) {
      let index = 9 + j + 8*i;
      arrayCells[index].innerHTML = newArray[newArray.length - j - 1].Cur_OfficialRate;
    }
  }
  searchMaxAndMin();
}

//поиск максимального и минимального значения в каждой строке валюты
function searchMaxAndMin() {
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
        max = number;
      }
      if( min > number) {
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

//Поиск подстроки, введеной в input, в строках, содержащие имена валют
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

//изменение даты в календаре
inputDate.addEventListener('input',() => addValueInTable());
