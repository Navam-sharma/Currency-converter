//https://github.com/fawazahmed0/currency-api?tab=readme-ov-file

// Migration Guide
// Change the URL from https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/{date}/{endpoint}
// to
// https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/{endpoint}

// There is no /currencies/{currencyCode}/{currencyCode} endpoint in this new API, so please only use /currencies/{currencyCode} endpoint. For example:

// json = fetchJSON(`/currencies/{fromCurrency}/{toCurrency}`)
// rate = json[toCurrency]
// becomes

// json = fetchJSON(`/currencies/{fromCurrency}`)
// rate = json[fromCurrency][toCurrency]

//islea ab ye niche wali api shi chal rhi content de rhi , migration ke steps follow kro
//https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");//class from ke andr se select ko chunna
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  //const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  let response = await fetch(URL);
  let data = await response.json();
  //let rate = data[toCurr.value.toLowerCase()];
  //value se to chuna hua inr ya npr ya jpy milta hai ,data api de rha , exchange rate miljaega aise
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

  // phle vali api me /from_curr/to_curr ye ek json data deta tha =>  { date : blah blah , to_curr : rate} hota tha
  // dusri vali me /from_curr hi hai bs yani ye data dega => 
    //{  date : blah blah , from_curr : { curr_1 : rate , curr2 : rate , curr3 : rate ...so on}} hai
  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
