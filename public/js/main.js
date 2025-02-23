// FRONT-END (CLIENT) JAVASCRIPT HERE


window.onload = async function() {
    const button = document.querySelector("button");
    button.onclick = submit;

    const res = await fetch( "/assignments")
    const assignments = await res.json()
    console.log( "Assignments:", assignments )

    const assignmentTable = document.querySelector("#datadisplay")
    for( let i = 0; i < assignments.length; i++ ) {
        const newRow = assignmentTable.insertRow(-1)
        newRow.insertCell(0).textContent = assignments[i].assignmentname
        newRow.insertCell(1).textContent = assignments[i].classname
        newRow.insertCell(2).textContent = assignments[i].deadline
        newRow.insertCell(3).textContent = assignments[i].priority

        // Add a modify and delete button to each row
        const actionsCell = newRow.insertCell(4)
        const modifyButton = document.createElement("button")
        const deleteButton = document.createElement("button")
        modifyButton.textContent = "Modify"
        deleteButton.textContent = "Delete"
        modifyButton.onclick = () => modifyAssignment(assignments[i], newRow)
        deleteButton.onclick = () => deleteAssignment(assignments[i], newRow)
        actionsCell.appendChild(modifyButton)
        actionsCell.appendChild(deleteButton)
    }

}

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const assignmentinput = document.querySelector( "#assignmentname" ),
        classinput = document.querySelector( "input[name=classname]:checked" ),
        deadlineinput = document.querySelector( "#deadline" ),
        json = { assignmentname: assignmentinput.value , classname: classinput.id, deadline: deadlineinput.value},
        body = JSON.stringify( json )

    const response = await fetch( "/submit", {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body
    })

    const newAssignment = await response.json()
    console.log( "New Assignment:", newAssignment )

    const assignmentTable = document.querySelector("#datadisplay")
    const newRow = assignmentTable.insertRow(-1)

    newRow.insertCell(0).textContent = newAssignment.assignmentname
    newRow.insertCell(1).textContent = newAssignment.classname
    newRow.insertCell(2).textContent = newAssignment.deadline
    newRow.insertCell(3).textContent = newAssignment.priority

    // Add a modify and delete button to each row
    const actionsCell = newRow.insertCell(4)
    const modifyButton = document.createElement("button")
    const deleteButton = document.createElement("button")
    modifyButton.textContent = "Modify"
    deleteButton.textContent = "Delete"
    modifyButton.onclick = () => modifyAssignment(newAssignment, newRow)
    deleteButton.onclick = () => deleteAssignment(newAssignment, newRow)
    actionsCell.appendChild(modifyButton)
    actionsCell.appendChild(deleteButton)

    // Clear the form for ease of use
    assignmentinput.value = ""
    classinput.checked = false
    deadlineinput.value = ""

}

const modifyAssignment = async function( assignment, row ) {

    const newassignmentname = document.querySelector( "#assignmentname" );
    const newdeadline = document.querySelector( "#deadline" );

    newassignmentname.value = assignment.assignmentname;
    newdeadline.value = assignment.deadline;

    // Get the class radio button
    const classoptions = document.querySelectorAll( "input[name=classname]" );
    for( let i = 0; i < classoptions.length; i++ ) {
        if( classoptions[i].id === assignment.classname ) {
            classoptions[i].checked = true;
        }
    }

    const button = document.querySelector("button");
    button.textContent = "Modify";
    button.onclick = async function( event ) {
        event.preventDefault()

        const classoptions = document.querySelector( "input[name=classname]:checked" );
        console.log(classoptions.id)
        const json = { assignmentname: newassignmentname.value , classname: classoptions.id, deadline: newdeadline.value},
            body = JSON.stringify( json )

        const response = await fetch( "/update/" + assignment._id, {
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body
        })

        const updatedAssignment = await response.json()
        console.log( "Updated Assignment:", updatedAssignment )

        row.cells[0].textContent = updatedAssignment.assignmentname
        row.cells[1].textContent = updatedAssignment.classname
        row.cells[2].textContent = updatedAssignment.deadline
        row.cells[3].textContent = updatedAssignment.priority

        // Clear the form for ease of use
        newassignmentname.value = ""
        classoptions.checked = false
        newdeadline.value = ""

    }
}

const deleteAssignment = async function( assignment, row ) {
    const response = await fetch( "/delete/" + assignment._id, {
        method:'DELETE'
    })

    if( response.status === 200 ) {
        row.remove()
    }
}
