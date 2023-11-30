
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






function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
           // console.log(rep)
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
            //   output.appendChild(tr);
            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                })
                data.push(row);
            })
            processRows(data);

            var liste = document.querySelectorAll('.exercice');
            ;
            console.log("la liste traitee est :", traitementListe(liste));
           
            console.log('la classlist du document est :',document.body.classList.value)
            console.log('la classlist du document contient paying :',document.body.classList.value.includes('paying'))

            if (document.body.classList.value.includes('paying')===false) {
               // console.log("la condition est:",document.body.classList.contains("paying")===false)
//console.log("je suis dans le if")
            injectHTML(traitementListe(liste));}



        })



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



function injectHTML(liste) {
    const exercicesAvecBlur = {};
    const isblurred={};

    // fill the fiches that are already displayed when the page loads
    var fiche = document.querySelectorAll(".fiche");
    for (let i = 0; i < fiche.length; ++i) {
        identifiantFiche = fiche[i].id;
        //console.log("identifiantFiche est :", identifiantFiche)
        //console.log("checkStatus(identifiantFiche) est :", checkStatus(identifiantFiche))
        if (checkStatus(identifiantFiche)) {
            
                fiche[i].insertAdjacentHTML('beforeend', ' <div class="blur"> <div class="gosabonner">Pour voir cette <b>fiche</b> il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>');
                exercicesAvecBlur[identifiantFiche] = true;
            
        }
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
