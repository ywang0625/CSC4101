
function get_column(first_input){
    console.log("\nGetting column... ");
    if (!first_input){
        throw new Error("Error: first_input not found");
    }

    
    if(first_input.slice(0,2) === "id")
        return [1, "id"];
    switch(first_input.slice(0,1)){
        case "+":
            return [2, "+"];
        case "*":
            return [3, "*"];
        case "(":
            return [4, "("];
        case ")":
            return [5, ")"];
        case "$":
            return [6, "$"];
        case "E":
            return [7, "E"];
        case "T":
            return [8, "T"];
        case "F":
            return [9, "F"];
    }
}

function get_row(last_stack){
    console.log("\n Getting row...");

    if (!last_stack){
        throw new Error("Error: last_stack not found");
    }
    switch(last_stack.substring(last_stack.length-2, last_stack.length)){
        case "10":
            return 10; 
        case "11":
            return 11; 
    }
    switch(last_stack.substring(last_stack.length-1, last_stack.length)){
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

// function get_row(last_stack){
//     console.log("\n Getting row...");

    
//     if (!last_stack){
//         throw new Error("Error: last_stack not found");
//     }
//     switch(last_stack.slice(-1)){
//         case "0": return 0;
//         case "1": return 1;
//         case "2": return 2;
//         case "3": return 3;
//         case "4": return 4;
//         case "5": return 5;
//         case "6": return 6;
//         case "7": return 7;
//         case "8": return 8;
//         case "9": return 9;
//     }
//     switch(last_stack.slice(-1)){
//         case "10":
//             return 10; 
//         case "11":
//             return 11; 
//     }
// }


function get_cell(last_stack, first_input) {
    if(!(first_input) || !(last_stack)){
        //document.getElementById("error-msg").innerHTML="Error: Fetch expression failure.\n";
        throw new Error("Error: Fetch input failure\n");
    }

    const col = get_column(first_input)[0];
    const row = get_row(last_stack.join(""));

    document.getElementById('parser').rows[row + 2].cells[col].style.backgroundColor = 'yellow';


    if (sessionStorage.getItem("oldrow")) {
        oldrow = JSON.parse(sessionStorage.getItem("oldrow"));
    }

    if (sessionStorage.getItem("oldcol")) {
        oldcol = JSON.parse(sessionStorage.getItem("oldcol"));
    }

    if (sessionStorage.getItem("oldrow") && sessionStorage.getItem("oldcol")) {

        document.getElementById('parser').rows[parseInt(oldrow) + 2].cells[parseInt(oldcol)].style.backgroundColor = '';

    }

    sessionStorage.setItem("oldrow", JSON.stringify(row.toString()));
    sessionStorage.setItem("oldcol", JSON.stringify(col.toString()));


    return document.getElementById('parser').rows[row + 2].cells[col].textContent;
}

function shift(parsed, expression, number) {
    console.log("Shifted: " + parsed + get_column(expression)[1] + number);

    parsed = [get_column(expression)[1], number];
    expression = expression.substring(get_column(expression)[1].length);

    return [parsed, expression];
}


// function grammarReplacement(grammar) {
//     console.log("Grammar evaluated: " + grammar);
//     //console.log("parsed: " + parsed);

//     switch (grammar) {
//         case "1":
//             return ["E", "+"];
//         case "2":
//             return ["E", ""];
//         case "3":
//             return ["T", "*"];
//         case "4":
//             return ["T", ""];
//         case "5":
//             return ["F", "("];
//         case "6":
//             return ["F", ""];
//     }
// }



//Reduced function
function reduce(parsed, expression, number) {

    let newItem, itemReplace;

    // [newItem, itemReplace] = grammarReplacement(number);
        switch (number) {
            case "1":
                [newItem, itemReplace] = ["E", "+"];
                break;
            case "2":
                [newItem, itemReplace] = ["E", ""];
                break;
            case "3":
                [newItem, itemReplace] =  ["T", "*"];
                break;
            case "4":
                [newItem, itemReplace] =  ["T", ""];
                break;
            case "5":
                [newItem, itemReplace] =  ["F", "("];
                break;
            case "6":
                [newItem, itemReplace] =  ["F", ""];
                break;
        }
    

    if (itemReplace === "") {
        parsed[parsed.length - 2] = newItem;
    } 
    else{
        console.log("\nFor case 1,3,5")

        console.log("Looking for " + itemReplace);

        for(let i = parsed.length; 0 < i; i--){
            console.log("at position: " + parsed[i-1]);

            if(parsed[i-1] === itemReplace){
                console.log("Target found");

                parsed = parsed.slice(0, i-1);

            }

        }

    }

    //     for (let i = parsed.length; i >= 0; i--) {
    //         console.log("Evaluating " + parsed[i]);
    //         if (parsed[i] === itemReplace) {
    //             console.log(itemReplace + " found at position " + i);
    //             parsed = parsed.slice(0, i);
    //             if (itemReplace === "(") {
    //                 parsed[parsed.length] = "F";
    //                 parsed[parsed.length] = "-1";//TODO fix this patch
    //             }
    //             i = -1;
    //         }
    //     }
    // }


    switch (parsed[parsed.length - 2]) {
        case "E":
            console.log("E!");
            console.log(parseInt(parseInt(parsed[parsed.length - 3])) + 2);
            parsed[parsed.length - 1] = document.getElementById('parser').rows[parseInt(parsed[parsed.length - 3]) + 2].cells[7].textContent;
            break;
        case "T":
            console.log("T!");
            console.log(parseInt(parseInt(parsed[parsed.length - 3])) + 2);
            parsed[parsed.length - 1] = document.getElementById('parser').rows[parseInt(parsed[parsed.length - 3]) + 2].cells[8].textContent;
            break;
        case "F":
            console.log("F!");
            parsed[parsed.length - 1] = document.getElementById('parser').rows[parseInt(parsed[parsed.length - 3]) + 2].cells[9].textContent;
            break;
    }

    return parsed;
}



function parse(parsed, expression) {
    const element = get_cell(parsed, expression);
    console.log("The element: " + element);


    if (element === "accept") {
        console.log("FINISHED!!!");
        
    } 
    else if (element.substring(0, 1) === "S") {
        console.log("Shifting");
        let arrToAdd;
        [arrToAdd, expression] = shift(parsed, expression, element.substring(1, element.length));
        parsed = parsed.concat(arrToAdd);
    } 
    else if (element.substring(0, 1) === "R") {
        console.log("Reducing");
        parsed = reduce(parsed, expression, element.substring(1, element.length));
    } 
    else if(element.substring(0,1) === ""){
        throw new Error("Error: Syntax Error\n");
    }
    else{
        console.log("Grammar");
        parsed = getGrammar(Number(element), parsed)[0];
    }
    


    return [parsed, expression];
}

//To show the output executions
function insertItem(table, element1, element2) {
    const row = table.insertRow(-1);
    const col1 = row.insertCell(0);
    const col2 = row.insertCell(1);
    col1.innerHTML = element1;
    col1.width = "125";
    col2.innerHTML = element2;
}

//When clicking the execution button
function execution() {
    console.log("\n\n Executing next execution... ");
    const output = document.getElementById("output");
    var parsed_stack = [];


    if (sessionStorage.getItem("parsed_stack")) {
        parsed_stack = JSON.parse(sessionStorage.getItem("parsed_stack"));
    }


    if (output.rows.length === 0) {

        insertItem(output, "0", document.getElementById("expression").value)
        parsed_stack = [0];
    } 
    else 
    {
        console.log("Parsed array is now " + parsed_stack);
        var expression = output.rows[output.rows.length - 1].cells[1].innerHTML;
        [parsed_stack, expression] = parse(parsed_stack, expression);

        if (parsed_stack.join("") === "0E1" && expression === "$") {
            document.getElementById("execution").disabled = true;
            oldrow = JSON.parse(sessionStorage.getItem("oldrow"));
            oldcol = JSON.parse(sessionStorage.getItem("oldcol"));
            document.getElementById('parser').rows[parseInt(oldrow) + 2].cells[parseInt(oldcol)].style.backgroundColor = '';
            document.getElementById('parser').rows[3].cells[6].style.backgroundColor = '#9bfc92';
            document.getElementById("finish-msg").innerHTML = "Finished!";
        }

        insertItem(output, parsed_stack.join(""), expression)

    }
    sessionStorage.setItem("parsed_stack", JSON.stringify(parsed_stack));
}
