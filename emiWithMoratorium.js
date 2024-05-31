function EMI(){
	
	var annualInterestRate=document.getElementById("InterestRate").value;
	var loanAmount=document.getElementById("LoanAmount").value;
	var loanTermMonths=document.getElementById("termsInMonth").value;
	
	var calculateInstallment = function() {
    
    var monthlyRate = annualInterestRate / (12 * 100); 

   
    if (annualInterestRate == 0) {
        return (loanAmount / loanTermMonths).toFixed(2);
    }
    
    
    var installment = ((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTermMonths))).toFixed(2);
    
    return parseFloat(installment);
	
	//console.log(parseFloat(installment))
}

var a=calculateInstallment();
document.getElementById("emiResult").value=a;



}

function Clear(){
	clearTable("table2");
}
function monthWiseEmi() {
    //clearTable("table2");
    
    var loanAmount = Number(document.getElementById("LoanAmount").value);  
    var annualInterestRate = Number(document.getElementById("InterestRate").value); 
    var loanTermMonths = Number(document.getElementById("termsInMonth").value); 
    var moratoriumStartMonth = Number(document.getElementById("moratoriumStartMonth").value); 
    var moratoriumEndMonth = Number(document.getElementById("moratoriumEndMonth").value); 
    var jsonArray = [];
    var startDateStr = document.getElementById("LoanDate").value; 
    var updatedArray = [];
    var paymentType = document.getElementById("paymentType").value; 
    
    // Function to parse a date string in "DD/MM/YYYY" format into a Date object
    function parseDate(dateStr) {
        var parts = dateStr.split('/');
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;  // Months are zero-based in JavaScript Date
        var year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }

    var startDate = parseDate(startDateStr);

    // Function to calculate the monthly installment (EMI)
    function calculateInstallment() {
        var monthlyRate = annualInterestRate / (12 * 100);
        var effectiveLoanTerm = loanTermMonths;
        var installment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -effectiveLoanTerm));
        return parseFloat(installment.toFixed(2));
    }

    var installment = calculateInstallment();

    // Function to format a Date object into "DD/MM/YYYY" format
    function formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1; // Months are zero-based, so add 1
        var year = date.getFullYear();
        return (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
    }

    // Function to calculate the details for each month
    function calculateMonthlyDetails(loanAmount, annualInterestRate, loanTermMonths, installment) {
        var balance = loanAmount;
        var monthlyRate = annualInterestRate / (12 * 100);
        var extraInterestAccrued = 0;
        var month = 1;

        while (balance > 0) {
            var interest = balance * monthlyRate;
            var principal = 0;
            var moratoriumInterest = 0;
            var extraInterest = 0;

            if (month >= moratoriumStartMonth && month <= moratoriumEndMonth) {
                extraInterestAccrued += interest;
                moratoriumInterest = interest; // Store interest accrued during moratorium
                balance += interest; // Interest is accrued during the moratorium period
            } else {
                principal = installment - interest - extraInterest;
                if (balance < installment) {
                    principal = balance;
                    installment = balance + interest + extraInterest;
                }
                balance -= principal;
            }

            // Calculate the date for the current month
            var installmentDate = new Date(startDate);
            if (paymentType === "BeginingOfThePeriod") {
                installmentDate.setMonth(startDate.getMonth() + month - 1);
            } else if (paymentType === "EndOfThePeriod") {
                installmentDate.setMonth(startDate.getMonth() + month);
            }
            var formattedDate = formatDate(installmentDate); // Format the date to "DD/MM/YYYY"

            // Creating a JSON object with serial number, interest, principal, balance details, and date for each month
            var newJsonObject = {
                "S.No.": month,
                "Due Date": formattedDate,
                "Moratorium Period": month >= moratoriumStartMonth && month <= moratoriumEndMonth ? "YES" : "NO",
                "Installment": month >= moratoriumStartMonth && month <= moratoriumEndMonth ? "0.00" : installment.toFixed(2),
                "Interest": interest.toFixed(2),
                "Principal": principal.toFixed(2),
                "Balance": balance.toFixed(2),
                "Extra Interest Accrued": moratoriumInterest.toFixed(2)
            };

            // Adding the JSON object to the array
            jsonArray.push(newJsonObject);
            month++;
        }
    }

    calculateMonthlyDetails(loanAmount, annualInterestRate, loanTermMonths, installment);

    // Output the JSON array to the console
    updatedArray = JSON.stringify(jsonArray, null);
    //var updatedArr = JSON.parse(updatedArray); console.log(updatedArray);console.log("hello")
    addDataToGrid('table2', JSON.parse(updatedArray));

}