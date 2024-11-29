const table = document.getElementById("table");

var verbs = [
    ["Base form", "Past tense", "Past participle", "Translation"],
    ["abide", "abode", "abode", "demeurer"],
    ["awake", "awoke", "awoken", "(se) réveiller, aussi awake/awoke/awoke"],
    ["be", "was/were", "been", "être"],
    ["bear", "bore", "borne", "porter/supporter/soutenir"],
    ["beat", "beat", "beaten", "battre"],
    ["become", "became", "become", ""],
    ["beget", "begat", "begotten", "engendrer, aussi beget/begot/begotten"],
    ["begin", "began", "begun", "commencer"],
    ["bend", "bent", "bent", "se courber, etc."],
    ["bereave", "bereft", "bereft", "déposséder/priver"],
    ["bring", "brought", "brought", "apporter"],
    ["build", "built", "built", "construire"],
    ["burn", "burnt", "burnt", "brûler"],
    ["burst", "burst", "burst", "éclater"],
    ["buy", "bought", "", "acheter"],
    ["cast", "cast", "cast", "jeter, etc."],
    ["catch", "caught", "caught", "attraper"],
    ["chide", "chid", "chidden", "gronder/réprimander, aussi chide/chid/chid"],
    ["choose", "chose", "chosen", "choisir"],
    ["cleave", "cleft", "cleft", "fendre/coller, aussi cleave/clove/clove"],
    ["cling", "clung", "clung", "se cramponner"],
    ["come", "came", "come", "venir"],
    ["cost", "cost", "cost", "coûter"],
    ["creep", "crept", "crept", "ramper/se glisser/se hérisser"],
    ["crow", "crew", "crowed", "chanter (un coq)/jubiler"],
    ["cut", "cut", "cut", "couper"],
    ["deal", "dealt", "dealt", "distribuer/traiter"],
    ["dig", "dug", "dug", "bêcher"],
    ["do", "did", "", "faire"],
    ["draw", "drew", "drawn", "tirer/dessiner"],
    ["dream", "dreamt", "dreamt", "rêver"],
    ["drink", "drank", "drunk", "boire"],
    ["drive", "drove", "driven", "conduire"],
    ["dwell", "dwelt", "dwelt", "habiter/rester"],
    ["eat", "ate", "eaten", "manger"],
    ["fall", "fell", "fallen", "tomber"],
    ["feed", "fed", "fed", "nourrir"],
    ["feel", "felt", "felt", "(se) sentir"],
    ["fight", "fought", "fought", "combattre"],
    ["find", "found", "found", "trouver"],
    ["...", "...", "...", "..."]
];
// Create a table cell
function createCell(content) {
    const cell = document.createElement("td");
    const textNode = document.createTextNode(content);
    cell.appendChild(textNode);
    return cell;
}

// Populate the table
function mountTable() {
    table.innerHTML = ""; // Clear the table

    verbs.forEach((verb, index) => {
        const row = document.createElement("tr");

        // Add verb columns
        verb.forEach((cellContent) => {
            row.appendChild(createCell(cellContent));
        });

        // Add action buttons (only for rows after the header)
        if (index !== 0) {
            const actionCell = document.createElement("td");

            // Edit button
            const editButton = document.createElement("input");
            editButton.type = "button";
            editButton.value = "Edit";
            editButton.addEventListener("click", () => editVerb(index));
            actionCell.appendChild(editButton);

            // Update button
            const updateButton = document.createElement("input");
            updateButton.type = "button";
            updateButton.value = "Update";
            updateButton.addEventListener("click", () => updateVerb(index));
            actionCell.appendChild(updateButton);

            // Delete button
            const deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.value = "Delete";
            deleteButton.addEventListener("click", () => deleteVerb(index));
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);
        }

        table.appendChild(row);
    });
    updateStatistics()
}


// Add a new verb
function addVerb() {
    const baseForm = prompt("Enter the base form of the verb:");
    const pastTense = prompt("Enter the past tense of the verb:");
    const pastParticiple = prompt("Enter the past participle of the verb:");
    const translation = prompt("Enter the translation of the verb:");

    if (baseForm && pastTense && pastParticiple && translation) {
        verbs.push([baseForm, pastTense, pastParticiple, translation]);
        mountTable(); // Re-render the table
    } else {
        alert("All fields are required!");
    }
}

// Edit a verb
function editVerb(index) {
    const verb = verbs[index];
    const newBaseForm = prompt("Edit Base Form:", verb[0]);
    const newPastTense = prompt("Edit Past Tense:", verb[1]);
    const newPastParticiple = prompt("Edit Past Participle:", verb[2]);
    const newTranslation = prompt("Edit Translation:", verb[3]);

    if (newBaseForm && newPastTense && newPastParticiple && newTranslation) {
        verbs[index] = [newBaseForm, newPastTense, newPastParticiple, newTranslation];
        mountTable(); // Re-render the table
    } else {
        alert("All fields must be filled in!");
    }
}

// Update a verb (similar to edit)
function updateVerb(index) {
    editVerb(index);
}

// Delete a verb
function deleteVerb(index) {
    verbs.splice(index, 1); // Remove the verb from the array
    mountTable(); // Re-render the table
}

// Find a verb and highlight matches
function findVerb() {
    const searchTerm = document.querySelector("#findVerbInput").value.toLowerCase();

    if (!searchTerm) {
        alert("Please enter a verb to search.");
        return;
    }

    // Find the index of the verb in the array
    const index = verbs.findIndex(
        (verb, i) => i !== 0 && verb.some((cell) => cell.toLowerCase().includes(searchTerm))
    );

    if (index === -1) {
        alert("Verb not found.");
        return;
    }

    // Move the found verb to the top (below the header)
    const [foundVerb] = verbs.splice(index, 1);
    verbs.splice(1, 0, foundVerb); // Insert it right after the header row

    // Re-render the table to reflect changes
    mountTable();
}


// Panel switch function
let isReversed = false;
function switchPanels() {
    const mainContainer = document.getElementById("main");
    mainContainer.style.flexDirection = isReversed ? "row" : "row-reverse";
    isReversed = !isReversed;
}

// Expand or collapse panels
let isExpanded = false;
function expand() {
    const leftBar = document.getElementById("leftBar");
    const rightBar = document.getElementById("rightBar");

    if (isExpanded) {
        leftBar.style.width = "98%";
        rightBar.style.width = "2%";
    } else {
        leftBar.style.width = "60%";
        rightBar.style.width = "40%";
    }
    isExpanded = !isExpanded;
}

function updateStatistics() {
    const statsText = document.getElementById("statsText");
    const stats = {};

    // Count verbs per letter
    verbs.slice(1).forEach((verb) => {
        const firstLetter = verb[0].charAt(0).toLowerCase();
        stats[firstLetter] = (stats[firstLetter] || 0) + 1;
    });

    // Format the statistics text
    const totalVerbs = verbs.length - 1;
    const averagePerLetter = totalVerbs / 26; // Assuming 26 letters
    let statsOutput = `~${averagePerLetter.toFixed(1)} verbs on average per letter: `;

    for (const letter in stats) {
        statsOutput += `${letter} → ${stats[letter]} `;
    }

    statsText.textContent = statsOutput.trim();
}


// Initialize the table after the DOM is loaded
document.addEventListener("DOMContentLoaded", mountTable);
