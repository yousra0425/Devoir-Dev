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

// ------------- Table Functions -------------
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

        if (index === 0) {
            const actionCell = document.createElement("td");
            row.appendChild(actionCell);
        } else {
            const actionCell = createActionCell(index);
            row.appendChild(actionCell);
        }

        table.appendChild(row);
    });
    updateStatistics();
}

function createActionCell(index) {
    const actionCell = document.createElement("td");
    
    // Edit Button
    const editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.addEventListener("click", () => editVerb(index));
    actionCell.appendChild(editButton);

    // Update Button
    const updateButton = document.createElement("input");
    updateButton.type = "button";
    updateButton.value = "Update";
    updateButton.addEventListener("click", () => updateVerb(index));
    actionCell.appendChild(updateButton);

    // Delete Button
    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.addEventListener("click", () => deleteVerb(index));
    actionCell.appendChild(deleteButton);

    return actionCell;
}

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

function editVerb(index) {
    const verb = verbs[index];
    let synonyms = [];
    let antonyms = [];
    let exampDefs = [];

    getSynoAnto(verb[0]).then(List =>{
        synonyms = List.synonyms;
        antonyms = List.antonyms;

        getExample(verb[0]).then(defs =>{        
    
            const imageUrl = "https://example.com/verb-image.jpg"; 
    
            showDetails(verb[0], synonyms,antonyms, imageUrl,defs);
        })
    })
}

function showDetails(verb, synonyms,antonyms, imageUrl, exampDefs) {
    document.getElementById('verbTitle').textContent = `Details about: ${verb}`;
    let i = 1;
    const defList = document.getElementById('verbDefsExamp');
    defList.innerHTML = ''; 
    exampDefs.forEach(exampDef => {
        const h4 = document.createElement('h4');
        const li1 = document.createElement('li');
        const li2 = document.createElement('li');

        h4.textContent = `Definition & Example ${i}: `;

        li1.textContent = "Definition : " + exampDef.definition;
        li2.textContent = "Example : " + exampDef.example;

        defList.appendChild(h4);
        defList.appendChild(li1);
        defList.appendChild(li2);
        i = i+1;

    });

    const synonymsList = document.getElementById('verbSynonyms');
    synonymsList.innerHTML = '';
    synonyms.forEach(synonym => {
        const li = document.createElement('li');
        li.textContent = synonym;
        synonymsList.appendChild(li);
    });

    const antonymsList = document.getElementById('verbAntonyms');
    antonymsList.innerHTML = ''; 
    antonyms.forEach(antonym => {
        const li = document.createElement('li');
        li.textContent = antonym;
        antonymsList.appendChild(li);
    });

    document.getElementById('verbImage').src = imageUrl;

    document.getElementById('detailsModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

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

function deleteVerb(index) {
    verbs.splice(index, 1); 
    mountTable(); 
}

function scrollToVerb(letter) {
    const rows = document.querySelectorAll('#table tr');
    let found = false;

    rows.forEach((row, index) => {
        if (index === 0) return;
        const firstCell = row.cells[0]?.textContent;

        if (firstCell && firstCell.toLowerCase().startsWith(letter.toLowerCase()) && !found) {
            // Scroll the row into view
            row.scrollIntoView({ behavior: "smooth", block: "start" });
            
            for (let i = 0; i < row.cells.length; i++) {
                row.cells[i].style.color = "red"; 
            }

            found = true;
        } else {
            
            for (let i = 0; i < row.cells.length; i++) {
                row.cells[i].style.color = ""; 
            }
        }
    });
    if (!found) {
        alert(`No verbs found starting with the letter "${letter.toUpperCase()}"`);
    }
}

function addVerbLinks(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Container not found!");
        return;
    }

    const uniqueLetters = new Set(verbs.map(verb => verb[0][0].toLowerCase()));
    uniqueLetters.delete('.');

    const newUl = document.createElement('ul');

    // Populate the UL with links for each unique letter
    [...uniqueLetters].sort().forEach(letter => {
        const li = document.createElement('li');
        li.innerHTML = `Here is a link to <a href="#" onclick="scrollToVerb('${letter}')">Verbs that start with the letter <span style="color:red;font-weight:bold;">${letter}</span></a>`;
        newUl.appendChild(li);
    });

    container.innerHTML="";
    container.appendChild(newUl);
}

function findVerb() {
    const searchTerm = document.querySelector("#findVerbInput").value.toLowerCase();

    if (!searchTerm) {
        alert("Please enter a verb to search.");
        return;
    }
    const index = verbs.findIndex(
        (verb, i) => i !== 0 && verb.some((cell) => cell.toLowerCase().includes(searchTerm))
    );

    if (index === -1) {
        alert("Verb not found.");
        return;
    }

    const [foundVerb] = verbs.splice(index, 1);
    verbs.splice(1, 0, foundVerb);

    mountTable();
}

function updateStatistics() {

    addVerbLinks('.links');

    const statsText = document.getElementById("statsText");
    const stats = {};

    verbs.slice(1).forEach((verb) => {
        const firstLetter = verb[0].charAt(0).toLowerCase();
        if(firstLetter === '.') {return;}
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

let isReversed = false;
function switchPanels() {
    const mainContainer = document.getElementById("main");
    mainContainer.style.flexDirection = isReversed ? "row" : "row-reverse";
    isReversed = !isReversed;
}


let isExpanded = false;
function expand() {
    const leftBar = document.getElementById("leftBar");
    const rightBar = document.getElementById("rightBar");
    const expandToggle = document.getElementById("expandToggle");

    if (isExpanded) {
        leftBar.style.width = "97%";
        rightBar.style.width = "3%";
        expandToggle.textContent = "◀"; 
    } else {
        leftBar.style.width = "60%";
        rightBar.style.width = "40%";
        expandToggle.textContent = "▶";
    }

    isExpanded = !isExpanded; 
}


     function closeModal() {
         document.getElementById('detailsModal').style.display = 'none';
     }

document.addEventListener("DOMContentLoaded", mountTable);


function getSynoAnto(word) {
    return fetch(`https://api.api-ninjas.com/v1/thesaurus?word=${word}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': '1ETWPUggVpOFoluYO8dzRg==PcSzolxXKiXxveoT'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const synonyms = data.synonyms.slice(0, 3);
        const antonyms = data.antonyms.slice(0, 3);

        return { synonyms, antonyms };
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function getExample(word) {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const result = getDefinitionsWithExamples(data);
        return result.slice(0,2);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getDefinitionsWithExamples(response) {
    const definitionsWithExamples = [];

    response.forEach(entry => {
        entry.meanings.forEach(meaning => {
            meaning.definitions.forEach(definition => {
                if (definition.example) {
                    definitionsWithExamples.push({
                        definition: definition.definition,
                        example: definition.example
                    });
                }
            });
        });
    });

    return definitionsWithExamples;
}
