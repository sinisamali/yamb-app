import updater from "./classes.js";

const fields = document.querySelectorAll("td");
const diceBtn = document.querySelector(".diceBtn");
const diceCubes = document.querySelectorAll(".diceCubes");
const hideShowBtn = document.querySelector(".hideShowBtn");
const fromLocalSorage = null;
// localStorage.getItem("tableNumbers")
let diceNumber = [];
let radnomDiceNumbers = [];
let numbersOfRoll = 0;
let tableNumbers = [];
let canSetHand = true;
let announceTimeAndFieldName = { announceTime: 0 };

if (fromLocalSorage) {
  tableNumbers = updater.updateDOM([...JSON.parse(fromLocalSorage)]);
}

const resetAnnounceTime = () => {
  announceTimeAndFieldName.fieldName = null;
  announceTimeAndFieldName.announceTime = 0;
};

fields.forEach((field) => {
  field.addEventListener("click", (e) => {
    const fieldName = e.target.dataset.field;
    const type = e.target.dataset.type;
    const column = e.target.dataset.column;
    const rowType = e.target.parentElement.dataset.rowtype;

    if (field.textContent) return;
    if (
      announceTimeAndFieldName.announceTime === 1 &&
      fieldName !== announceTimeAndFieldName.fieldName
    )
      return;
    if (column === "announce") {
      if (numbersOfRoll !== 1 && !announceTimeAndFieldName.fieldName) return;
      else if (
        announceTimeAndFieldName.announceTime === 1 &&
        diceNumber.length !== 5 &&
        type === "announceMinMax"
      ) {
        return;
      }
      announceTimeAndFieldName.announceTime += 1;
      announceTimeAndFieldName.fieldName = fieldName;
    }
    if (
      !updater.checkIsCanSet(
        field,
        fieldName,
        column,
        announceTimeAndFieldName,
        resetAnnounceTime,
        canSetHand
      )
    )
      return;

    const { result, error } = updater.fieldRule(
      diceNumber,
      rowType,
      numbersOfRoll
    );
    if (error) return;

    tableNumbers = [...tableNumbers, { [fieldName]: result, type }];

    tableNumbers = updater.updateDOM(tableNumbers, type, column, fieldName);
    resetNumbersOfRoll();
    localStorage.setItem("tableNumbers", JSON.stringify(tableNumbers));
  });
});

//..................................................................................

diceBtn.addEventListener("click", () => {
  if (numbersOfRoll < 3) {
    document.querySelector(".diceBtn").textContent = ++numbersOfRoll;

    if ([...diceCubes].some((item) => item.getAttribute("selected"))) {
      canSetHand = false;
    } else {
      canSetHand = true;
    }

    diceCubes.forEach((cube, index) => {
      let randomNumber = Math.floor(Math.random() * 6) + 1;

      if (!cube.getAttribute("selected")) {
        radnomDiceNumbers.splice(index, 1, randomNumber);
        cube.src = `./img/default-dice/${radnomDiceNumbers[index] || 0}.png`;
      }
    });
  }
});

//..................................................................................

diceCubes.forEach((cube, index) => {
  cube.addEventListener("click", () => {
    if (!radnomDiceNumbers[index]) return;

    if (cube.getAttribute("selected")) {
      const indexNumber = diceNumber.indexOf(radnomDiceNumbers[index]);
      if (index > -1) {
        diceNumber.splice(indexNumber, 1);
      }
      cube.removeAttribute("selected");
      cube.src = `./img/default-dice/${radnomDiceNumbers[index] || 0}.png`;
    } else if (diceNumber.length < 5) {
      diceNumber.splice(index, 0, radnomDiceNumbers[index]);
      cube.setAttribute("selected", true);
      cube.src = `./img/dice/${radnomDiceNumbers[index]}.png`;
    }
  });
});

//..................................................................................

const resetNumbersOfRoll = () => {
  numbersOfRoll = 0;
  diceNumber = [];
  radnomDiceNumbers = [];
  document.querySelector(".diceBtn").textContent = "Dice";

  diceCubes.forEach((cube) => {
    cube.src = `./img/default-dice/0.png`;
    cube.removeAttribute("selected");
  });
};

//..................................................................................

hideShowBtn.addEventListener("click", () => {
  const numberDivWrapper = document.querySelector(".numberDivWrapper");

  if (numberDivWrapper.style.display === "none") {
    numberDivWrapper.style.display = "flex";
    hideShowBtn.textContent = "Hide";
  } else {
    numberDivWrapper.style.display = "none";
    hideShowBtn.textContent = "Show";
  }
});
