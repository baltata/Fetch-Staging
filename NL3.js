console.log('test8');
var sheetId = '1EceUR6V_uozN0fAkYTE_p9NHLIew8OBOI_Ab_10Z490';
var base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
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
                injectHTML(traitementListe(liste));
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
const classChangeCallback = function (mutationsList, observer) {
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

// Function to start the countdown from inside the iframe
function startCountdownInIframe(iframeDocument, elementId, nextAttemptTime, submitButton, blurElement, outcomeElement) {
    const countdownElement = iframeDocument.getElementById(elementId);
    if (!countdownElement) {
        console.error(`Countdown element with ID ${elementId} not found inside iframe.`);
        return;
    }

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = nextAttemptTime - now;

        if (timeRemaining > 0) {
            // Time calculations for hours, minutes, and seconds
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            countdownElement.innerHTML = ` ${minutes}m ${seconds}s`;
        } else {
            countdownElement.innerHTML = "";
            clearInterval(countdownInterval);

            // Enable the submit button and remove the grey effect
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.backgroundColor = "";  // Reset to default
                submitButton.style.cursor = "";  // Reset to default
            }

            // Remove the blur and gosabonner div
            if (blurElement) {
                blurElement.remove(); // Fully remove the blur element
            }

            // Remove the color and text-shadow from the outcome element
            if (outcomeElement) {
                outcomeElement.style.color = "";  // Reset to default
                outcomeElement.style.textShadow = "";  // Reset to default
            }
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Inject HTML with blur for fiches and exercices
function injectHTML(liste) {
    const exercicesAvecBlur = {};
    const isblurred = {};

    // Inject blur for fiches
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

      ///// FILL THE CORRECTIONS THAT ARE ALREADY DISPLAYED WHEN THE PAGE LOADS

      

        var contenairexercice = document.querySelectorAll(".exercice iframe");
        for (let i = 0; i < contenairexercice.length; ++i) {
            //console.log("contenairexercice[i] est :", contenairexercice[i])
            let iframe = contenairexercice[i];
            let identifiantExercice = iframe.parentElement.id;
            console.log(`Processing exercise already loaded with ID: ${identifiantExercice}`);


                identifiantExercice = contenairexercice[i].parentElement.id;
                if (checkStatus(identifiantExercice)) {


                const iframeDocument = iframe.contentWindow.document;
                console.log(`Iframe loaded for exercise ${identifiantExercice}`);

                // Fetch the max attempts flag and next attempt time from the iframe
                const maxAttemptsReachedElement = iframeDocument.querySelector("#maxAttemptsReached");
                const nextAttemptTimeElement = iframeDocument.querySelector("#nextAttemptTime");
                const maxAttemptsReached = maxAttemptsReachedElement ? (maxAttemptsReachedElement.innerText === 'true') : false;
                const nextAttemptTime = nextAttemptTimeElement ? new Date(nextAttemptTimeElement.innerText) : null;

                console.log(`Max Attempts Reached for exercise ${identifiantExercice}: ${maxAttemptsReached}`);
                console.log(`Next Attempt Time for exercise ${identifiantExercice}: ${nextAttemptTime}`);

                // Disable submit button if user has reached the max attempts
                const submitButton = iframeDocument.querySelector("input[type='submit']");
                let blurElement = null;
                let outcomeElement = null;
                if (submitButton && maxAttemptsReached) {
                    submitButton.disabled = true;  // Disable the button
                    submitButton.style.backgroundColor = "grey";  // Apply greyish effect
                    submitButton.style.cursor = "not-allowed";  // Change cursor to indicate it's disabled

                    // Add a span next to the button for the countdown
                    submitButton.insertAdjacentHTML('afterend', `<span id="countdown_${identifiantExercice}" style="margin-left: 10px; color: grey;"></span>`);
                    console.log(`Disabled submit button for exercise ${identifiantExercice}`);
                }

                // Check for the correction and inject blur only inside the correction
                const correction = iframeDocument.body.querySelector('.outcome');
                if (correction && maxAttemptsReached && nextAttemptTime) {
                    console.log(`Inserting blur with countdown for exercise ${identifiantExercice}`);
                    correction.insertAdjacentHTML('beforeend', `
                        <div class="blur">
                            <div class="gosabonner">
                                Tu as atteint le maximum d'erreurs 😥 Attends <b><span id="countdown_${identifiantExercice}_blur"></span></b>
                                <br> ou 
                                <a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php">
                                    <div class="whitebutton"><b>Deviens Premium 👑</b></div>
                                </a>
                            </div>
                        </div>
                    `);
                    correction.style.color = "transparent";
                    correction.style.textShadow = "0 0 8px #000";
                    exercicesAvecBlur[identifiantExercice] = true;

                    blurElement = correction.querySelector('.blur');
                    outcomeElement = correction; // Save the outcome element reference to reset later

                    // Run the countdown inside the iframe context for the blur
                    const blurCountdownElementId = `countdown_${identifiantExercice}_blur`;
                    setTimeout(function () {
                        startCountdownInIframe(iframeDocument, blurCountdownElementId, nextAttemptTime, submitButton, blurElement, outcomeElement);
                    }, 500);
                }

                // Run the countdown inside the iframe context for the submit button
                if (maxAttemptsReached && nextAttemptTime) {
                    const countdownElementId = `countdown_${identifiantExercice}`;
                    setTimeout(function () {
                        startCountdownInIframe(iframeDocument, countdownElementId, nextAttemptTime, submitButton, blurElement, outcomeElement);
                    }, 500);
                }
            



                    
                    }};


    // Inject blur for exercices that are dynamically loaded
    var contenairexercice = document.querySelectorAll(".exercice iframe");
    console.log("la liste des containerexercice est ", contenairexercice);
    for (let i = 0; i < contenairexercice.length; ++i) {
        let iframe = contenairexercice[i];
        let identifiantExercice = iframe.parentElement.id;
        console.log(`Processing exercise with ID: ${identifiantExercice}`);

        if (checkStatus(identifiantExercice)) {
            iframe.addEventListener('load', function () {
                const iframeDocument = iframe.contentWindow.document;
                console.log(`Iframe loaded for exercise ${identifiantExercice}`);

                // Fetch the max attempts flag and next attempt time from the iframe
                const maxAttemptsReachedElement = iframeDocument.querySelector("#maxAttemptsReached");
                const nextAttemptTimeElement = iframeDocument.querySelector("#nextAttemptTime");
                const maxAttemptsReached = maxAttemptsReachedElement ? (maxAttemptsReachedElement.innerText === 'true') : false;
                const nextAttemptTime = nextAttemptTimeElement ? new Date(nextAttemptTimeElement.innerText) : null;

                console.log(`Max Attempts Reached for exercise ${identifiantExercice}: ${maxAttemptsReached}`);
                console.log(`Next Attempt Time for exercise ${identifiantExercice}: ${nextAttemptTime}`);

                // Disable submit button if user has reached the max attempts
                const submitButton = iframeDocument.querySelector("input[type='submit']");
                let blurElement = null;
                let outcomeElement = null;
                if (submitButton && maxAttemptsReached) {
                    submitButton.disabled = true;  // Disable the button
                    submitButton.style.backgroundColor = "grey";  // Apply greyish effect
                    submitButton.style.cursor = "not-allowed";  // Change cursor to indicate it's disabled

                    // Add a span next to the button for the countdown
                    submitButton.insertAdjacentHTML('afterend', `<span id="countdown_${identifiantExercice}" style="margin-left: 10px; color: grey;"></span>`);
                    console.log(`Disabled submit button for exercise ${identifiantExercice}`);
                }

                // Check for the correction and inject blur only inside the correction
                const correction = iframeDocument.body.querySelector('.outcome');
                if (correction && maxAttemptsReached && nextAttemptTime) {
                    console.log(`Inserting blur with countdown for exercise ${identifiantExercice}`);
                    correction.insertAdjacentHTML('beforeend', `
                        <div class="blur">
                            <div class="gosabonner">
                                Tu as atteint le maximum d'erreurs 😥 Attends <b><span id="countdown_${identifiantExercice}_blur"></span></b>.
                                <br> ou 
                                <a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php">
                                    <div class="whitebutton"><b>Deviens Premium 👑</b></div>
                                </a>
                            </div>
                        </div>
                    `);
                    correction.style.color = "transparent";
                    correction.style.textShadow = "0 0 8px #000";
                    exercicesAvecBlur[identifiantExercice] = true;

                    blurElement = correction.querySelector('.blur');
                    outcomeElement = correction; // Save the outcome element reference to reset later

                    // Run the countdown inside the iframe context for the blur
                    const blurCountdownElementId = `countdown_${identifiantExercice}_blur`;
                    setTimeout(function () {
                        startCountdownInIframe(iframeDocument, blurCountdownElementId, nextAttemptTime, submitButton, blurElement, outcomeElement);
                    }, 500);
                }

                // Run the countdown inside the iframe context for the submit button
                if (maxAttemptsReached && nextAttemptTime) {
                    const countdownElementId = `countdown_${identifiantExercice}`;
                    setTimeout(function () {
                        startCountdownInIframe(iframeDocument, countdownElementId, nextAttemptTime, submitButton, blurElement, outcomeElement);
                    }, 500);
                }
            });
        } else {
            console.log(`Exercise ${identifiantExercice} is not a paying exercise`);
        }
    }
}
// Helper functions
function traitementListe(liste) {
    var listeTraitee = [];
    for (let i = 0; i < liste.length; i++) {
        var id = liste[i].id;
        if (checkStatus(id) == 1) {
            listeTraitee.push(liste[i]);
        }
    }
    return listeTraitee;
}

function checkStatus(id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            return data[i].Payant; 
        }
    }
    return false;
}

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
