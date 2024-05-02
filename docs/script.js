//Fetching the parser table
function get_cell(last_stack, first_input) {
    if(!(first_input) || !(last_stack)){
        //document.getElementById("error-msg").innerHTML="Error: Fetch expression failure.\n";
        throw new Error("Error: Fetch input failure\n");
    }

    const col = get_column(first_input)[0];
    const row = get_row(last_stack.join(""));

    document.getElementById('parser-table').rows[row + 2].cells[col].style.backgroundColor = 'yellow';


    //Checking to see if anything existed in session storage
    if (sessionStorage.getItem("oldrow")) {
        oldrow = JSON.parse(sessionStorage.getItem("oldrow"));
    }

    if (sessionStorage.getItem("oldcol")) {
        oldcol = JSON.parse(sessionStorage.getItem("oldcol"));
    }

    if (sessionStorage.getItem("oldrow") && sessionStorage.getItem("oldcol")) {

        document.getElementById('parser-table').rows[parseInt(oldrow) + 2].cells[parseInt(oldcol)].style.backgroundColor = '';

    }

    sessionStorage.setItem("oldrow", JSON.stringify(row.toString()));
    sessionStorage.setItem("oldcol", JSON.stringify(col.toString()));


    return document.getElementById('parser-table').rows[row + 2].cells[col].textContent;
}

function get_column(first_input){
    console.log("\nGetting column... ");
    if (!first_input){
        document.getElementById("error-msg").innerHTML="Error: Operation Failed";
        throw new Error("Error: first_input not found");
    }

    if(first_input.slice(0,2) === "id"){
        console.log("succeed");
        return [1, "id"];
    }
    switch(first_input.slice(0,1)){
        case "+":
            console.log("succeed");
            return [2, "+"];
        case "*":
            console.log("succeed");
            return [3, "*"];
        case "(":
            console.log("succeed");
            return [4, "("];
        case ")":
            console.log("succeed");
            return [5, ")"];
        case "$":
            console.log("succeed");
            return [6, "$"];
        case "E":
            console.log("succeed");
            return [7, "E"];
        case "T":
            console.log("succeed");
            return [8, "T"];
        case "F":
            console.log("succeed");
            return [9, "F"];
    }
}

function get_row(last_stack){
    console.log("\n Getting row...");

    if (!last_stack){
        throw new Error("Error: last_stack not found");
    }
    switch(last_stack.slice(-2)){
        case "10":
            return 10; 
        case "11":
            return 11; 
    }
    switch(last_stack.slice(-1)){
        case "0": return 0;
        case "1": return 1;
        case "2": return 2;
        case "3": return 3;
        case "4": return 4;
        case "5": return 5;
        case "6": return 6;
        case "7": return 7;
        case "8": return 8;
        case "9": return 9;
    }
}





//Translating 
function parse(last_stack, first_input) {
    const element = get_cell(last_stack, first_input);
    console.log("The element: " + element);

    if (element.substring(0, 1) === "S") {
        console.log("Shifting");
        let arrToAdd;
        [arrToAdd, first_input] = shift(last_stack, first_input, element.substring(1, element.length));
        last_stack = last_stack.concat(arrToAdd);
    } 
    else if (element.substring(0, 1) === "R") {
        console.log("Reducing");
        last_stack = reduce(last_stack, first_input, element.substring(1, element.length));
    } 
    else if(element.substring(0,1) === ""){
        throw new Error("Error: Syntax Error\n");
    }
    else 
        console.log("Accept");

    return [last_stack, first_input];
}

//Shift function
function shift(last_stack, first_input, number) {
    last_stack = [get_column(first_input)[1], number];
    first_input = first_input.substring(get_column(first_input)[1].length);

    return [last_stack, first_input];
}


//Reduced function
function reduce(last_stack, first_input, number) {
    let add_in, replaced;

    //reduce grammar rule 
        switch (number) {
            case "1":
                [add_in, replaced] = ["E", "+"];
                break;
            case "2":
                [add_in, replaced] = ["E", ""];
                break;
            case "3":
                [add_in, replaced] =  ["T", "*"];
                break;
            case "4":
                [add_in, replaced] =  ["T", ""];
                break;
            case "5":
                [add_in, replaced] =  ["F", "("];
                break;
            case "6":
                [add_in, replaced] =  ["F", ""];
                break;
        }
    

    if (replaced === "") {
        last_stack[last_stack.length - 2] = add_in;
    } 
    else if(replaced === "("){
        console.log("Looking for " + replaced);
        
        for(let i = last_stack.length; 0 < i; i--){
            console.log("at position: " + last_stack[i-1]);
            if(last_stack[i-1] === replaced){
                console.log("Target found");
                last_stack = last_stack.slice(0, i-2); 
                last_stack[last_stack.length - 1] = "F"; 
            }
        }           
    }
    else
    {
        console.log("\nFor case 1,3")

        console.log("Looking for " + replaced);

        for(let i = last_stack.length; 0 < i; i--){
            console.log("at position: " + last_stack[i-1]);
            if(last_stack[i-1] === replaced){
                console.log("Target found");

                last_stack = last_stack.slice(0, i-1);                
            }
        }
    }

    if (last_stack[last_stack.length - 1] === "F"){
        last_stack[last_stack.length - 1] = document.getElementById("parser-table").rows[parseInt(last_stack[last_stack.length - 3]) + 2].cells[9].textContent;
    }
    
    switch (last_stack[last_stack.length - 2]) {
        case "E":
            console.log("E!");
            console.log(parseInt(parseInt(last_stack[last_stack.length - 3])) + 2);
            last_stack[last_stack.length - 1] = document.getElementById("parser-table").rows[parseInt(last_stack[last_stack.length - 3]) + 2].cells[7].textContent;
            break;
        case "T":
            console.log("T!");
            console.log(parseInt(parseInt(last_stack[last_stack.length - 3])) + 2);
            last_stack[last_stack.length - 1] = document.getElementById("parser-table").rows[parseInt(last_stack[last_stack.length - 3]) + 2].cells[8].textContent;
            break;
        case "F":
            console.log("F!");
            last_stack[last_stack.length - 1] = document.getElementById("parser-table").rows[parseInt(last_stack[last_stack.length - 3]) + 2].cells[9].textContent;
            break;
    }

    return last_stack;
}


//The exectuions
//When clicking the execution button
function execution() {


    console.log("\n\n Executing next execution... ");
    const output = document.getElementById("output");
    var parsed_array = [];

    if(!(document.getElementById("expression").value)){
        window.onerror = function() {
            alert("Please enter an expression!");
            return true;}
    }

    if (sessionStorage.getItem("parsed_array")) {
        parsed_array = JSON.parse(sessionStorage.getItem("parsed_array"));
    }

    if (output.rows.length === 0) {
        push_item(output, "0", document.getElementById("expression").value)
        parsed_array = [0];
    } 
    else 
    {
        var first_input = output.rows[output.rows.length - 1].cells[1].innerHTML;
        [parsed_array, first_input] = parse(parsed_array, first_input);

        //if (parsed_array.join("") === "0E1" && first_input === "$") {
        if (first_input === "$" && parsed_array.join("") === "0E1"){

            oldrow = JSON.parse(sessionStorage.getItem("oldrow"));
            oldcol = JSON.parse(sessionStorage.getItem("oldcol"));

            //clear the previous one
            document.getElementById("parser-table").rows[parseInt(oldrow) + 2].cells[parseInt(oldcol)].style.backgroundColor = '';
            //change color
            document.getElementById("parser-table").rows[3].cells[6].style.backgroundColor = '#9bfc92';
            document.getElementById("parser-table").rows[3].cells[6].style.color = "#5A5B60";


            document.getElementById("finish-msg").innerHTML = "Finished!";
            document.getElementById("execution").disabled = true;
        }

        push_item(output, parsed_array.join(""), first_input)

    }

    //store parsed array in storage
    sessionStorage.setItem("parsed_array", JSON.stringify(parsed_array));
}

//To show the output executions
function push_item(output_table, column1_data, column2_data) {
    let row = output_table.insertRow(-1);
    let col1 = row.insertCell(0);
    let col2 = row.insertCell(1);

    
    col1.innerHTML = column1_data;
    col2.innerHTML = column2_data;
}

