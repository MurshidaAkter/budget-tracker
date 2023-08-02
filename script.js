// var declarations --->
var signedAmount = 0;

var spentClick = 0;

let transactions =
	localStorage.getItem("transactions") !== null
		? JSON.parse(localStorage.getItem("transactions"))
		: [];
// <----

// Find elements from html --->
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const spentBtn = document.getElementById("spentBtn");
const balanceDigit = document.getElementById("balanceDigit");
const deleteAll = document.getElementById("deleteAll");

// <-----

// Necessary functions --->

//Update the balance estimateds and spents...
const updateAmountValues = () => {
	const amounts = transactions.map((transaction) => transaction.amount);
	const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
	const estimated = amounts
		.filter((item) => item > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);
	const expense = (
		amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
		-1
	).toFixed(2);

	balanceDigit.innerText = `${total}`;
	money_plus.innerText = ` ${estimated}`;
	money_minus.innerText = ` ${expense}`;
};

//Update Local Storage Transaction...
const updateLocalStorage = () => {
	localStorage.setItem("transactions", JSON.stringify(transactions));
};

//Remove Transaction by ID
const removeTransaction = (removeId) => {
	transactions = transactions.filter(
		(transaction) => transaction.id !== removeId
	);
	updateLocalStorage();
	Init();
};

//Create Trasactions elements to History list...
const createTransactionList = (transaction) => {
	//GET sign
	const sign = transaction.amount < 0 ? "-" : "+";
	const item = document.createElement("li");

	//Add Class Based on Value
	item.classList.add(transaction.amount < 0 ? "minus" : "plus");

	item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${
			transaction.id
		})"><i class="fa-solid fa-trash"></i></button>
    `;
	list.appendChild(item);
};

// to add transaction ...
const addTransaction = (event) => {
	event.preventDefault();
	signedAmount = Number(amount.value);

	if (spentClick === 1) {
		signedAmount = Number(amount.value) * -1;
		spentClick = 0;
		console.log(signedAmount);
	}

	if (text.value.trim() === "" && amount.value.trim() === "") {
		alert("please add text and amount");
	} else {
		const transaction = {
			id: Date.now(),
			text: text.value,
			amount: signedAmount,
		};

		transactions.push(transaction);

		createTransactionList(transaction);
		updateAmountValues();
		updateLocalStorage();
		text.value = "";
		amount.value = "";
	}
};

//Init App
const Init = () => {
	list.innerHTML = "";
	transactions.forEach(createTransactionList);
	updateAmountValues();
};
// <-----

// Adding event listeners --->
form.addEventListener("submit", addTransaction);

spentBtn.addEventListener("click", (event) => {
	event.preventDefault();
	spentClick = 1;
	console.log(spentClick);
	addTransaction(event);
});

deleteAll.addEventListener("click", () => {
	if (confirm("All the transaction data will be deleted parmanently")) {
		localStorage.clear();
		window.location.reload();
		Init();
	}
});
// <-----

// localStorage.clear();

// Function call --->
Init();
// <-----
