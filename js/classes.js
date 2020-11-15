class Interface {
  updateDOM(tableNumbers, type, column, fieldName) {
    let newTableNumbers = [...tableNumbers];

    if (fieldName === `${type}One`) {
      const numbers = tableNumbers.filter(
        (tableNumber) => tableNumber.type === `${type}MinMax`
      );
      const oneValue = newTableNumbers.find((item) => item[fieldName]);

      if (numbers.length === 2) {
        if (!Object.keys(numbers[0])[0].includes("Max")) {
          const popNumbers = numbers.pop();
          numbers.unshift(popNumbers);
        }

        const maxNumber = Object.values(numbers[0])[0];
        const minNumber = Object.values(numbers[1])[0];
        let total = maxNumber - minNumber;

        if (oneValue[fieldName]) {
          total *= oneValue[fieldName];

          document.querySelector(
            `[data-field=${type}MinMaxResult]`
          ).textContent = total < 0 ? 0 : total;

          newTableNumbers = [
            ...tableNumbers,
            { [`${type}MinMaxResult`]: total < 0 ? 0 : total },
          ];
        }
      }
    }
    //...............................................................................
    tableNumbers.map((item) => {
      // Update DOM
      const fieldName = Object.keys(item)[0];

      document.querySelector(`[data-field=${fieldName}]`).textContent =
        item[fieldName];

      // Check is all populated
      if (type) {
        const numberOfFields = document.querySelectorAll(`[data-type=${type}]`);
        const isAllPopulted = [...numberOfFields].every(
          (field) => !!field.textContent
        );

        if (isAllPopulted) {
          if (type.includes("MinMax")) {
            const numbers = tableNumbers.filter(
              (tableNumber) => tableNumber.type === type
            );
            if (!Object.keys(numbers[0])[0].includes("Max")) {
              const popNumbers = numbers.pop();
              numbers.unshift(popNumbers);
            }

            const maxNumber = Object.values(numbers[0])[0];
            const minNumber = Object.values(numbers[1])[0];
            let total = maxNumber - minNumber;

            if (
              parseInt(
                document.querySelector(`[data-field=${column}One`).textContent
              )
            ) {
              total *= parseInt(
                document.querySelector(`[data-field=${column}One`).textContent
              );

              document.querySelector(`[data-field=${type}Result]`).textContent =
                total < 0 ? 0 : total;

              newTableNumbers = [
                ...tableNumbers,
                { [`${type}Result`]: total < 0 ? 0 : total },
              ];
            }
          } else {
            const total = tableNumbers
              .filter((tableNumber) => tableNumber.type === type)
              .reduce((a, b) => a + b[Object.keys(b)[0]], 0);
            document.querySelector(
              `[data-field=${type}Result]`
            ).textContent = total;

            newTableNumbers = [...tableNumbers, { [`${type}Result`]: total }];
          }
        }
      }
    });

    return [...newTableNumbers];
  }

  //..................................................................................

  checkIsCanSet(
    field,
    fieldName,
    column,
    announceTime,
    resetAnnounceTime,
    canSetHand
  ) {
    switch (column) {
      case "down":
        const allDownFields = document.querySelectorAll(
          `[data-column=${column}]`
        );
        let downIndex = [...allDownFields].findIndex(
          (item) => item.dataset.field === fieldName
        );
        const previousField = allDownFields[downIndex - 1]
          ? allDownFields[downIndex - 1]
          : null;

        if (previousField && !previousField.textContent) {
          return false;
        }
        return true;
      case "up":
        const allUpFields = document.querySelectorAll(
          `[data-column=${column}]`
        );
        let upIndex = [...allUpFields].findIndex(
          (item) => item.dataset.field === fieldName
        );
        const nextField = allUpFields[upIndex + 1]
          ? allUpFields[upIndex + 1]
          : null;

        if (nextField && !nextField.textContent) {
          return false;
        }
        return true;
      case "announce":
        if (announceTime.announceTime === 1) {
          field.style.outline = "1px solid red";
          return false;
        } else if (announceTime.announceTime === 2) {
          field.style.outline = "none";
          resetAnnounceTime();
          return true;
        }
      case "hand":
        return canSetHand;
      default:
        return true;
    }
  }

  //..................................................................................

  checkTrilingPokerYamb(length, numberForAddition, diceNumber) {
    for (let i = 1; i <= 6; i++) {
      const specificNumber = diceNumber.filter((item) => item === i);

      if (specificNumber.length >= length) {
        return length * i + numberForAddition;
      } else {
        continue;
      }
    }
    return 0;
  }

  //..................................................................................

  checkFull(diceNumber, numberForAddition) {
    let firstTHreeNumbers = null;
    let firstTwoNumbers = null;
    let ignoreNumber = 0;
    let sum = 0;

    for (let i = 1; i <= 6; i++) {
      const specificNumber = diceNumber.filter((item) => item === i);

      if (specificNumber.length >= 3) {
        firstTHreeNumbers = 3 * i;
        ignoreNumber = i;
      } else {
        continue;
      }
    }

    for (let i = 1; i <= 6; i++) {
      const specificNumber = diceNumber.filter((item) => item === i);

      if (specificNumber.length >= 2 && i !== ignoreNumber) {
        firstTwoNumbers = 2 * i;
      } else {
        continue;
      }
    }
    if (firstTHreeNumbers && firstTwoNumbers) {
      sum = firstTHreeNumbers + firstTwoNumbers + numberForAddition;
    }
    return sum;
  }

  //..................................................................................

  fieldRule(diceNumber, rowType, numbersOfRoll) {
    let result;
    const typeToNumber = parseInt(rowType);

    if (!isNaN(parseInt(rowType))) {
      result =
        diceNumber
          .filter((item) => item === typeToNumber)
          .reduce((a, b) => a + b, 0) || 0;
    }

    switch (rowType) {
      case "min":
        if (diceNumber.length < 5) return { error: true };
        result = diceNumber.reduce((a, b) => a + b, 0);
        break;
      case "max":
        if (diceNumber.length < 5) return { error: true };
        result = diceNumber.reduce((a, b) => a + b, 0);
        break;
      case "straight":
        const diceSum = diceNumber.reduce((a, b) => a + b, 0);

        if (diceSum === 15 || diceSum === 20) {
          if (numbersOfRoll === 1) result = 66;
          else if (numbersOfRoll === 2) result = 56;
          else if (numbersOfRoll === 3) result = 46;
        } else result = 0;
        break;
      case "triling":
        result = this.checkTrilingPokerYamb(3, 20, diceNumber);
        break;
      case "full":
        result = this.checkFull(diceNumber, 30);
        break;
      case "poker":
        result = this.checkTrilingPokerYamb(4, 40, diceNumber);
        break;
      case "yamb":
        result = this.checkTrilingPokerYamb(5, 50, diceNumber);
        break;
    }
    return { result };
  }
}

export default new Interface();
