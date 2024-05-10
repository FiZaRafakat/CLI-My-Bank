#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import clear from "clear";
async function textWrite(text) {
    for (let char of text) {
        process.stdout.write(char);
        await new Promise((resolve) => {
            setTimeout(resolve, 50);
        });
    }
}
async function fastText(text) {
    for (let char of text) {
        process.stdout.write(char);
        await new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
    }
}
class Customer {
    firstName;
    lastName;
    age;
    gender;
    accountNumber;
    balance;
    constructor(fName, lName, age, gender, accountNo, balance) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.accountNumber = accountNo;
        this.balance = balance;
    }
}
const customers = {};
function generateAccountNumber() {
    return "IBAN00" + Math.floor(100 + Math.random() * 900);
}
async function CreateAccount() {
    const details = await inquirer.prompt([
        {
            name: "FirstName",
            type: "input",
            message: "Enter First Name: "
        },
        {
            name: "LastName",
            type: "input",
            message: "Enter Last Name: "
        },
        {
            name: "Age",
            type: "number",
            message: "Enter Age here: "
        },
        {
            name: "Gender",
            type: "input",
            message: "Enter Gender here: "
        },
        {
            name: "Balance",
            type: "number",
            message: "Add initial Balance: "
        }
    ]);
    const account = generateAccountNumber();
    const newCustomer = new Customer(details.FirstName, details.LastName, details.Age, details.Gender, account, details.Balance);
    customers[account] = newCustomer;
    const Rainbow = chalkAnimation.neon(`\n\t\tCongrats! ${details.FirstName} ${details.LastName}, Your account is created.\n`);
    ;
    await new Promise(resolve => setTimeout(resolve, 2000));
    Rainbow.stop();
    await textWrite(chalk.bgMagenta.whiteBright.italic.underline(`\t\t\tYour account number is ${account}.`));
    await fastText("\n\n\t\t***************************************************\n\n");
}
async function ViewAccountdetails() {
    const question = await inquirer.prompt({
        name: "accountNo",
        type: "input",
        message: "Enter your Account No: "
    });
    const account = (question.accountNo);
    const customer = customers[account];
    if (customer) {
        const Rainbow = chalkAnimation.karaoke(`\n\t\t\tAccount Details : `);
        await new Promise(resolve => setTimeout(resolve, 2000));
        Rainbow.stop();
        await fastText("\n\t\t***************************************");
        await fastText(chalk.rgb(100, 20, 80)(`\n\t\t\tFirst Name: ${customer.firstName}`));
        await fastText(chalk.rgb(100, 20, 80)(`\n\t\t\tLast Name: ${customer.lastName}`));
        await fastText(chalk.rgb(100, 20, 80)(`\n\t\t\tAge: ${customer.age}`));
        await fastText(chalk.rgb(100, 20, 80)(`\n\t\t\tGender: ${customer.gender}`));
        await fastText(chalk.rgb(100, 20, 80)(`\n\t\t\tAccount Number: ${customer.accountNumber}`));
        await fastText(chalk.rgb(100, 20, 80)(`\n\t\t\tBalance : ${customer.balance}\n`));
        await fastText("\t\t***************************************\n\n");
    }
    else {
        await textWrite(chalk.red.italic.underline("\n\t\tInvalid Account Number.\n\n"));
        await fastText("\t\t***************************************\n\n");
    }
}
async function Debit() {
    const question = await inquirer.prompt({
        name: "accountNo",
        type: "input",
        message: "Enter your Account No: "
    });
    const account = (question.accountNo);
    const customer = customers[account];
    if (!customer) {
        await textWrite(chalk.red.italic.underline("\n\t\t\tCustomer not found."));
        await fastText("\n\n\t\t***************************************\n\n");
        return;
    }
    let debit = await inquirer.prompt({
        name: "debitAmount",
        type: "input",
        message: "Enter the amount you want to withdraw : "
    });
    const debitAmount = parseFloat(debit.debitAmount);
    if (debitAmount <= 0) {
        await textWrite(chalk.red.italic.underline("\n\t\t\tInvalid Amount ."));
        await fastText("\n\n\t\t***************************************\n\n");
    }
    else if (debitAmount > customer.balance) {
        await textWrite(chalk.red.italic.underline(`\n\t\tInsufficient balance in your Account.`));
        await fastText("\n\n\t\t***************************************\n\n");
    }
    else {
        customer.balance -= debitAmount;
        await fastText(chalk.italic.greenBright.underline(`\n\t\t\tWithdrawal successful.\n`));
        await fastText(chalk.rgb(150, 180, 90)(`\n\t\t\tRemaining balance: ${customer.balance}\n\n`));
        await fastText("\t\t*****************************************\n\n");
    }
}
async function Credit() {
    const question = await inquirer.prompt({
        name: "accountNo",
        type: "input",
        message: "Enter your Account No: "
    });
    const account = (question.accountNo);
    const customer = customers[account];
    if (!customer) {
        await textWrite(chalk.redBright.italic.underline("\n\t\t\tCustomer not found."));
        await fastText("\n\n\t\t***************************************\n\n");
        return;
    }
    let credit = await inquirer.prompt({
        name: "creditAmount",
        type: "input",
        message: "Enter the amount : "
    });
    const creditAmount = parseFloat(credit.creditAmount);
    customer.balance += creditAmount;
    await fastText(chalk.greenBright.italic.underline(`\n\t\tYour Amount is credited in your Account.\n `));
    await fastText(chalk.rgb(150, 180, 90)(`\n\t\t\tYour Balance : ${customer.balance}`));
    await fastText("\n\n\t\t***************************************\n\n");
}
clear();
async function main() {
    const choices = await inquirer.prompt({
        name: "choice",
        type: "list",
        message: "Select an option:",
        choices: ["Create account", "View Account details", "Debit", "Credit", "Exit"]
    });
    if (choices.choice === "Create account") {
        await CreateAccount();
        main();
    }
    else if (choices.choice === "View Account details") {
        await ViewAccountdetails();
        main();
    }
    else if (choices.choice === "Debit") {
        await Debit();
        main();
    }
    else if (choices.choice === "Credit") {
        await Credit();
        main();
    }
    else {
        await fastText(chalk.rgb(120, 80, 150)("\n\n\t\t\tThank You for using My Bank Project... :)\n\n"));
        await fastText("\t\t*********************************************************\n");
    }
}
const Rainbow = chalkAnimation.rainbow(`\n\t\t\tWelcome to Fiza's Bank System Project.\n`);
setTimeout(async () => {
    Rainbow.stop();
    main();
}, 1000);
