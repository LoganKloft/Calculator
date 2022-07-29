// nodes / node lists
const numberBtns = document.querySelectorAll('.number');
const opBtns = document.querySelectorAll('.op');
const equalBtn = document.querySelector('.equal');
const clearBtn = document.querySelector('.clear');
const displayNode = document.querySelector('.display-text');

// array of strings
let operators = ['+', '-', '*', '/'];

// strings
let displayText = '';
let divideByZeroText = "Error: Divide by 0";

let leftOperand = null;
let rightOperand = null;
let op = null;

// flags
let operatorsEnabled = false;

function display() {
    // remove error text if displaying
    if (displayText == divideByZeroText) {
        displayText = '';
        refreshDisplay();
    }

    displayText = displayText.concat(this.innerText);

    // prevent entering consecutive operators by disabling operator (op) buttons
    // also disable equals button, since doesn't make sense with only one operand.
    if (isOperator(this)) {
        disableOperators();
        disableEquals();
    }

    if(isNumber(this)) {
        enableOperators();
    }

    expression(this);
    refreshDisplay();
}

function expression(node) {
    if (isOperator(node)) {
        if (op == null) {
            op = node.innerText;
        } else {
            operate(op, leftOperand, rightOperand);
            op = node.innerText;
        }
    } else {
        if (leftOperand == null) {
            leftOperand = node.innerText; 
        } else if (op == null) {
            leftOperand = leftOperand.concat(node.innerText);
        }else if (rightOperand == null) {
            rightOperand = node.innerText;
            enableEquals();
        } else {
            rightOperand = rightOperand.concat(node.innerText);
        }
    }
}

function isOperator(node) {
    let str = node.innerText;
    return operators.includes(str);
}

function isNumber(node) {
    return !isNaN(+node.innerText);
}

function clearDisplay() {
    displayText = '';
    leftOperand = null;
    op = null;
    rightOperand = null;
    disableEquals();
    disableOperators();
    refreshDisplay();
}

function refreshDisplay() {
    displayNode.innerText = displayText;
}

function enableOperators() {
    if (!operatorsEnabled) {
        opBtns.forEach(op => op.addEventListener('click', display));
        operatorsEnabled = !operatorsEnabled;
    }
}

function disableOperators() {
    if (operatorsEnabled) {
        opBtns.forEach(op => op.removeEventListener('click', display));
        operatorsEnabled = !operatorsEnabled;
    }
}

function enableClear() {
    clearBtn.addEventListener('click', clearDisplay);
}

function enableNumbers() {
    numberBtns.forEach(number => {
        number.addEventListener('click', display)
    });
}

function enableEquals() {
    equalBtn.addEventListener('click', equals);
}

function disableEquals() {
    equalBtn.removeEventListener('click', equals);
}

function equals() {
    result = operate(op, leftOperand, rightOperand);
    displayText = result;
    console.log(result);
    refreshDisplay();
    disableEquals();
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b == 0) {
        return NaN;
    }
    return a / b;
}

function operate(operator, a, b) {
    if (operator == null || a == null || b == null) return;

    a = +a;
    b = +b;
    let result = null;

    switch(operator) {
        case '+':
            result = add(a, b);
            break;
        case '-':
            result = subtract(a, b);
            break;
        case '*':
            result = multiply(a, b);
            break;
        case '/':
            result = divide(a, b);
            if (isNaN(result)) {
                clearDisplay();
                displayText = divideByZeroText;
                refreshDisplay();
                return divideByZeroText;
            }
            break;
    }

    leftOperand = result.toString();
    op = null;
    rightOperand = null;
    return leftOperand;
}

enableNumbers();
enableClear();