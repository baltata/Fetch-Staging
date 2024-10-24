console.log('test6');
const sheetId = '1EceUR6V_uozN0fAkYTE_p9NHLIew8OBOI_Ab_10Z490';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'user-data';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const data = [];
document.addEventListener('DOMContentLoaded', init);
const output = document.querySelector('.output');

// Main init function
function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            const colz = [];
            const tr = document.createElement('tr');

            // Extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    const th = document.createElement('th');
                    th.innerText = column;
                    tr.appendChild(th);
                }
            });

            // Extract row data
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                });
                data.push(row);
            });

            processRows(data);

            var liste = document.querySelectorAll('.exercice');
            console.log("la liste traitee est :", traitementListe(liste));
            console.log('la classlist du document est :', document.body.classList.value);
            console.log('la classlist du document contient paying :', document.body.classList.value.includes('paying'));

            if (!document.body.classList.value.includes('paying')) {
                injectHTML(traitementListe(liste)); // Handle loaded iframes
                addLoadListeners(); // Handle dynamically loaded iframes
            }
        });
}

// Function to hide blurs for premium users
function displayNone() {
    var contenairexercice = document.querySelectorAll(".exercice iframe");

    for (let i = 0; i < contenairexercice.length; ++i) {
        var blur = contenairexercice[i].contentWindow.document.body.querySelectorAll(".blur");
        for (let j = 0; j < blur.length; ++j) {
            blur[j].style.display = "none";
        }
    }
}

// Observer for detecting body class changes (e.g., if user becomes premium)
const classChangeCallback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (document.body.classList.contains('paying')) {
                displayNone();
                observer.disconnect(); 
            }
        }
    }
};

const bodyObserver = new MutationObserver(classChangeCallback);
bodyObserver.observe(document.body, { attributes: true });

/* Helper to process existing iframes on page load */
function injectHTML(liste) {
    const exercicesAvecBlur = {};
    const isblurred = {};

    // Handle already loaded iframes
    var fiche = document.querySelectorAll(".fiche");
    for (let i = 0; i < fiche.length; ++i) {
        identifiantFiche = fiche[i].id;
        if (checkStatus(identifiantFiche)) {
            fiche[i].insertAdjacentHTML('beforeend', 
                `<div class="blur">
                    <div class="gosabonner">Pour voir cette <b>fiche</b> il faut un compte premium 👑.
                    <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php">
                    <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>`
            );
            exercicesAvecBlur[identifiantFiche] = true;
        }
    }

    // FILL THE CORRECTIONS THAT ARE ALREADY DISPLAYED WHEN THE PAGE LOADS
    var contenairexercice = document.querySelectorAll(".exercice iframe");
    for (let i = 0; i < contenairexercice.length; ++i) {
        identifiantExercice = contenairexercice[i].parentElement.id;
        if (checkStatus(identifiantExercice)) {
            const iframeDocument = contenairexercice[i].contentWindow.document;
            if (iframeDocument.querySelector('.outcome')) {
                const correction = iframeDocument.querySelector('.outcome');
                if (!exercicesAvecBlur[identifiantExercice]) {
                    correction.insertAdjacentHTML('beforeend', `
                        <div class="blur">
                            <div class="gosabonner">Pour voir cette <b>correction</b> ou <b>recommencer</b> cet exercice il faut un compte premium 👑.
                            <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php">
                            <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>
                    `);
                    correction.style.color = "transparent";
                    correction.style.textShadow = "0 0 8px #000";
                    exercicesAvecBlur[identifiantExercice] = true;
                }
            }
        }
    }
}

/* Event listener for newly loaded iframes */
function addLoadListeners() {
    var contenairexercice = document.querySelectorAll(".exercice iframe");
    for (let i = 0; i < contenairexercice.length; ++i) {
        contenairexercice[i].addEventListener("load", function() {
            identifiantExercice = this.parentElement.id;
            if (checkStatus(identifiantExercice) && !document.body.classList.contains('paying')) {
                const iframeDocument = this.contentWindow.document;
                if (iframeDocument.querySelector('.outcome')) {
                    if (!isblurred[identifiantExercice]) {
                        const correction = iframeDocument.querySelector('.outcome');
                        correction.insertAdjacentHTML('beforeend', `
                            <div class="blur">
                                <div class="gosabonner">Pour voir cette <b>correction</b> ou <b>recommencer</b> cet exercice il faut un compte premium 👑.
                                <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php">
                                <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>
                        `);
                        correction.style.color = "transparent";
                        correction.style.textShadow = "0 0 8px #000";
                        isblurred[identifiantExercice] = true;
                    }
                }
            }
        });
    }
}

// Helper to check exercise status
function checkStatus(id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            return data[i].Payant;
        }
    }
    return false;
}

// Helper to process rows
function processRows(json) {
    json.forEach((row) => {
        const tr = document.createElement('tr');
        const keys = Object.keys(row);
        keys.forEach((key) => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        });
    });
}

