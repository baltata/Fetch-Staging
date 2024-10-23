
console.log('test6');
const sheetId = '1EceUR6V_uozN0fAkYTE_p9NHLIew8OBOI_Ab_10Z490';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'user-data';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`
const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')
//console.log("output is :", output);
//console.log("url est :", url)






// Placeholder for values passed from PHP
var userAttemptCount = window.userAttemptCount || 0;  // Will be passed from PHP
var nextAttemptTime = window.nextAttemptTime || '';   // Will be passed from PHP (ISO 8601 format)

// Main initialization function
function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            const colz = [];
            const tr = document.createElement('tr');

            //Extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    const th = document.createElement('th');
                    th.innerText = column;
                    tr.appendChild(th);
                }
            })

            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                })
                data.push(row);
            })
            processRows(data);

            var liste = document.querySelectorAll('.exercice');

            if (document.body.classList.value.includes('paying') === false) {
                // Inject blur and start countdown only if user is not premium and has exceeded attempts
                if (userAttemptCount >= 5) {
                    injectHTML(traitementListe(liste));
                    initializeCountdown();
                }
            }
        })
}

        //function that display none all the blurs
function displayNone() {
    //select all the blur that ar within iframes
    var contenairexercice = document.querySelectorAll(".exercice iframe");

    for (let i = 0; i < contenairexercice.length; ++i) {
        var blur = contenairexercice[i].contentWindow.document.body.querySelectorAll(".blur");
       // console.log('les blur à virer sont :', blur)
        for (let i = 0; i < blur.length; ++i) {
            blur[i].style.display = "none";
        }
    

    
    
    }
}
// Mutation observer callback function for changes in the body class
const classChangeCallback = function(mutationsList, observer) {
    //console.log('Mutation observed in body class');
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const bodyClassList = document.body.classList;
            if (bodyClassList.contains('paying')) {
                //console.log('Class "paying" detected');
                displayNone(); // Call the function when "paying" class is added
                observer.disconnect(); // Disconnect the observer after triggering the function
            }
        }
    }
};

// Mutation observer for changes in attributes of the body element
const bodyObserver = new MutationObserver(classChangeCallback);
bodyObserver.observe(document.body, { attributes: true });







}




// Inject HTML for blur and the countdown timer
function injectHTML(liste) {
    const exercicesAvecBlur = {};

    for (let i = 0; i < liste.length; i++) {
        var identifiantExercice = liste[i].id;
        if (!checkStatus(identifiantExercice)) {
            // Inject blur only if user has exceeded the max attempts
            if (userAttemptCount >= 5) {
                liste[i].insertAdjacentHTML('beforeend', `
                    <div class="blur">
                        <div class="gosabonner">
                            Tu as atteint le max d'erreurs pour aujourd'hui, attends <span id="countdown"></span>
                            <br> ou 
                            <a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php">
                                <div class="whitebutton"><b>Devenir Premium 👑</b></div>
                            </a>
                        </div>
                    </div>`);
                exercicesAvecBlur[identifiantExercice] = true;
            }
        }
    }
}

// Initialize the countdown timer
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    const nextAttemptDate = new Date(nextAttemptTime);  // Parse the next attempt time from PHP

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = nextAttemptDate - now;  // Calculate the time difference

        if (timeRemaining > 0) {
            // Time calculations for hours, minutes, and seconds
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            // Display the countdown in the element
            countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            // When the countdown ends
            countdownElement.innerHTML = "Vous pouvez maintenant réessayer !";
            clearInterval(countdownInterval);  // Stop the countdown once the time is up
        }
    }

    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Initialize the countdown display immediately
    updateCountdown();
}




    ///// FILL THE CORRECTIONS THAT ARE ALREADY DISPLAYED WHEN THE PAGE LOADS

    for (var i = 0, len = liste.length; i < len; i++) {

        var contenairexercice = document.querySelectorAll(".exercice iframe");
        for (let i = 0; i < contenairexercice.length; ++i) {
            //console.log("contenairexercice[i] est :", contenairexercice[i])

        
                identifiantExercice = contenairexercice[i].parentElement.id;
                if (checkStatus(identifiantExercice)) {
                    if (contenairexercice[i].contentWindow.document.body.querySelector('.outcome')) {
                        
                       


                    var correction = contenairexercice[i].contentWindow.document.body.querySelector('.outcome');
                   // console.log("correction est :", correction)


                    if (!exercicesAvecBlur[identifiantExercice]) {
                        //console.log("l'exercice est censé être flouté  :", correction)
                            correction.insertAdjacentHTML('beforeend', ' <div class="blur"> <div class="gosabonner">Pour voir cette <b>correction</b> ou <b>recommencer</b> cet exercice il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>');
                        correction.style.color = "transparent";
correction.style.textShadow = "0 0 8px #000";
                            exercicesAvecBlur[identifiantExercice] = true;}



                        }
                    }};}

////// ADD AN EVENT LISTENER TO DISPLAY THE BLUR WHEN IFRAMES LOAD

        for (var i = 0, len = liste.length; i < len; i++) {
           
            var isThePageBeingEdited = document.querySelector("body").id;
            if (isThePageBeingEdited != "page-mod- book-edit") {
            //    console.log("DEBUT DU SSSS");
                var contenairexercice = document.querySelectorAll(".exercice iframe");
                for (let i=0;i<contenairexercice.length;i++) {

                    contenairexercice[i].addEventListener("load", () => {
                        identifiantExercice = contenairexercice[i].parentElement.id;
                        if (checkStatus(identifiantExercice) && document.body.classList.value.includes('paying')===false) {
                            if (contenairexercice[i].contentWindow.document.body.querySelector('.outcome')) {
                                

if (!isblurred[identifiantExercice]) {

                            var correction = contenairexercice[i].contentWindow.document.body.querySelector('.outcome');
                                    correction.insertAdjacentHTML('beforeend', ' <div class="blur"> <div class="gosabonner">Pour voir cette <b>correction</b> ou <b>recommencer</b> cet exercice il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>')
    correction.style.color = "transparent";
correction.style.textShadow = "0 0 8px #000";                                
    isblurred[identifiantExercice]=true;
}


                                }
                            }});}

                }
            }


        };

    







function traitementListe(liste) {
    var listeTraitee = [];

    for (let i = 0; i < liste.length; i++) {
        var id = liste[i].id;
        if (checkStatus(id) == 1) {
            listeTraitee.push(liste[i])
        }
    }
   // console.log("la liste traitee est:", listeTraitee)
    return listeTraitee


}

function checkStatus(id) {
    // check the status of each exercice to see whether it is paying or not
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            var retour = data[i].Payant
        }
    }
    return retour;
}

function processRows(json) {
    json.forEach((row) => {
        const tr = document.createElement('tr');
        const keys = Object.keys(row);

        keys.forEach((key) => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        })
        //  output.appendChild(tr);
    })
}
//}
