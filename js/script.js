const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector(" form button");
const apiKey = '46505020d4722457f746286e';

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "JPY" ? "selected" : "";
    }
    //creating option tag with passing currency code as a text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    //inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  };
  dropList[i].addEventListener("change", e => {
    loadFlag(e.target); //calling loadFlag with passing target element as an argument.
  });
}

function loadFlag(element) {
  for (code in country_code) {
    if (code == element.value) { // if currency code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); // selecting img tag particular drop list
      // passing country code of a selected currency code in a img url
      imgTag.src = `https://flagcdn.com/w80/${country_code[code]}.png`;
    }
  }
}

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
})

window.addEventListener('load', () => {
  getExchangeRate();
});

getButton.addEventListener('click', e => {
  e.preventDefault();//preventing from form submitting,
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  const exchangeRateTxt = document.querySelector(".exchange-rate");
  let amountVal = amount.value;
  // if user don't enter any value or enter 0 then we will put 1 value by default in the input field
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = "1";
  }
  exchangeRateTxt.innerText = 'Getting exchange rate...';
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  // fetching API response and returning it with parsing into js obj and in another then method receiving that obj
  fetch(url).then(response => response.json()).then(result => {
    let exchangeRate = result.conversion_rates[toCurrency.value];
    let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
    exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    console.log(totalExchangeRate);
  }).catch(() => {
    exchangeRateTxt.innerText = "Something went wrong..."
  })
}