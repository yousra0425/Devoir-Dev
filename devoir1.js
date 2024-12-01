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


function createCell(content) {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
}


function mountTable() {
    table.innerHTML = "";
    verbs.forEach((verb, index) => {
        const row = document.createElement("tr");
        verb.forEach(cellContent => row.appendChild(createCell(cellContent)));

        const actionCell = (index === 0) ? document.createElement("td") : createActionCell(index);
        row.appendChild(actionCell);
        
        table.appendChild(row);
    });
    updateStatistics();
}

// Action Buttons (Edit, Update, Delete)
function createActionCell(index) {
    const actionCell = document.createElement("td");
    
    const buttons = [
        { value: "Edit", clickHandler: () => editVerb(index) },
        { value: "Update", clickHandler: () => updateVerb(index) },
        { value: "Delete", clickHandler: () => deleteVerb(index) }
    ];

    buttons.forEach(button => {
        const btn = document.createElement("input");
        btn.type = "button";
        btn.value = button.value;
        btn.addEventListener("click", button.clickHandler);
        actionCell.appendChild(btn);
    });

    return actionCell;
}

// Add a new verb to the list
function addVerb() {
    const baseForm = prompt("Enter the base form of the verb:");
    const pastTense = prompt("Enter the past tense of the verb:");
    const pastParticiple = prompt("Enter the past participle of the verb:");
    const translation = prompt("Enter the translation of the verb:");

    if (baseForm && pastTense && pastParticiple && translation) {
        const newVerb = [baseForm, pastTense, pastParticiple, translation];
        let index = verbs.findIndex((verb, i) => i > 0 && verb[0].localeCompare(baseForm) > 0);
        if (index === -1) {
            verbs.push(newVerb); 
        } else {
            verbs.splice(index, 0, newVerb); 
        }
        mountTable();
    } else {
        alert("All fields are required!");
    }
}

// Edit a verb details
function editVerb(index) {
    const verb = verbs[index];
    let synonyms = [];
    let antonyms = [];
    let exampDefs = [];

    getSynoAnto(verb[0]).then(List => {
        synonyms = List.synonyms;
        antonyms = List.antonyms;

        getExample(verb[0]).then(defs => {
            const imageUrl = "https://example.com/verb-image.jpg"; 
            showDetails(verb[0], synonyms, antonyms, imageUrl, defs);
        });
    });
}

// Display verb details in a modal
function showDetails(verb, synonyms, antonyms, imageUrl, exampDefs) {
    document.getElementById('verbTitle').textContent = `Details about: ${verb}`;
    const defList = document.getElementById('verbDefsExamp');
    defList.innerHTML = '';
    exampDefs.forEach((exampDef, i) => {
        const h4 = document.createElement('h4');
        h4.textContent = `Definition & Example ${i + 1}: `;
        defList.appendChild(h4);

        const li1 = document.createElement('li');
        li1.textContent = `Definition: ${exampDef.definition}`;
        const li2 = document.createElement('li');
        li2.textContent = `Example: ${exampDef.example}`;
        defList.appendChild(li1);
        defList.appendChild(li2);
    });

    updateList('verbSynonyms', synonyms);
    updateList('verbAntonyms', antonyms);
    
    document.getElementById('verbImage').src = imageUrl;
    document.getElementById('detailsModal').style.display = 'block';
}

// Update a list of items in a given container
function updateList(containerId, items) {
    const listContainer = document.getElementById(containerId);
    listContainer.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listContainer.appendChild(li);
    });
}

// Close the modal
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// Update verb in the list
function updateVerb(index) {
    const verb = verbs[index];
    const newBaseForm = prompt("Edit Base Form:", verb[0]);
    const newPastTense = prompt("Edit Past Tense:", verb[1]);
    const newPastParticiple = prompt("Edit Past Participle:", verb[2]);
    const newTranslation = prompt("Edit Translation:", verb[3]);

    if (newBaseForm && newPastTense && newPastParticiple && newTranslation) {
        verbs[index] = [newBaseForm, newPastTense, newPastParticiple, newTranslation];
        mountTable();
    } else {
        alert("All fields must be filled in!");
    }
}

// Delete a verb from the list
function deleteVerb(index) {
    verbs.splice(index, 1); 
    mountTable(); 
}

// Scroll to the first verb starting with a given letter
function scrollToVerb(letter) {
    const rows = document.querySelectorAll('#table tr');
    let found = false;

    rows.forEach(row => {
        const firstCell = row.cells[0]?.textContent;
        if (firstCell && firstCell.toLowerCase().startsWith(letter.toLowerCase()) && !found) {
            row.scrollIntoView({ behavior: "smooth", block: "start" });
            Array.from(row.cells).forEach(cell => cell.style.color = "red");
            found = true;
        } else {
            Array.from(row.cells).forEach(cell => cell.style.color = "");
        }
    });

    if (!found) {
        alert(`No verbs found starting with the letter "${letter.toUpperCase()}"`);
    }
}

// Add verb links to a container
function addVerbLinks(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const uniqueLetters = new Set(verbs.map(verb => verb[0][0].toLowerCase()));
    uniqueLetters.delete('.'); // Exclude dots

    const newUl = document.createElement('ul');
    [...uniqueLetters].sort().forEach(letter => {
        const li = document.createElement('li');
        li.innerHTML = `Here is a link to <a href="#" onclick="scrollToVerb('${letter}')">Verbs that start with the letter <span style="color:red;font-weight:bold;">${letter}</span></a>`;
        newUl.appendChild(li);
    });

    container.innerHTML = "";
    container.appendChild(newUl);
}

// Search for a verb in the list
function findVerb() {
    const searchTerm = document.querySelector("#findVerbInput").value.toLowerCase();

    if (!searchTerm) {
        alert("Please enter a verb to search.");
        return;
    }

    const index = verbs.findIndex(verb => verb.some(cell => cell.toLowerCase().includes(searchTerm)));
    if (index === -1) {
        alert("Verb not found.");
        return;
    }

    const [foundVerb] = verbs.splice(index, 1);
    verbs.splice(1, 0, foundVerb);  // Reinsert the found verb at the top
    mountTable();
}

// Update verb statistics
function updateStatistics() {
    addVerbLinks('.links');
    const statsText = document.getElementById("statsText");
    const stats = {};

    verbs.slice(1).forEach(verb => {
        const firstLetter = verb[0].charAt(0).toLowerCase();
        if (firstLetter === '.') return;
        stats[firstLetter] = (stats[firstLetter] || 0) + 1;
    });

    const totalVerbs = verbs.length - 1;
    const averagePerLetter = totalVerbs / 26;
    let statsOutput = `~${averagePerLetter.toFixed(1)} verbs on average per letter: `;

    for (const letter in stats) {
        statsOutput += `${letter} → ${stats[letter]} `;
    }

    statsText.textContent = statsOutput.trim();
}

// Switch the direction of the main container
let isReversed = false;
function switchPanels() {
    const mainContainer = document.getElementById("main");
    mainContainer.style.flexDirection = isReversed ? "row" : "row-reverse";
    isReversed = !isReversed;
}

// Expand/Collapse the layout
let isExpanded = false;
function expand() {
    const leftBar = document.getElementById("leftBar");
    const rightBar = document.getElementById("rightBar");
    const expandToggle = document.getElementById("expandToggle");

    if (isExpanded) {
        leftBar.style.flex = "1";
        rightBar.style.flex = "1";
        expandToggle.innerHTML = ">>>"; 
    } else {
        leftBar.style.flex = "0.1";
        rightBar.style.flex = "0.1";
        expandToggle.innerHTML = "<<<";
    }
    isExpanded = !isExpanded;
}

// Fetch synonyms and antonyms
async function getSynoAnto(word) {
    const apiUrl = `https://api.datamuse.com/words?rel_syn=${word}&rel_ant=${word}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const synonyms = data.filter(item => item.tags.includes('syn')).map(item => item.word);
    const antonyms = data.filter(item => item.tags.includes('ant')).map(item => item.word);
    return { synonyms, antonyms };
}

// Fetch example sentences
async function getExample(word) {
    const apiUrl = `https://api.datamuse.com/words?ml=${word}&max=5`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.map(item => ({ definition: item.def, example: item.word }));
}

mountTable();


