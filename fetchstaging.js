
console.log('testitest2');
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
           // console.log("la liste traitee est :", traitementListe(liste));
            injectHTML(traitementListe(liste));



        })










}
function injectHTML(liste) {
    const exercicesAvecBlur = {};
    const isblurred={};

    // fill the fiches that are already displayed when the page loads
    var fiche = document.querySelectorAll(".fiche");
    for (let i = 0; i < fiche.length; ++i) {
        identifiantFiche = fiche[i].id;
        console.log("identifiantFiche est :", identifiantFiche)
        console.log("checkStatus(identifiantFiche) est :", checkStatus(identifiantFiche))
        if (checkStatus(identifiantFiche)) {
            
                fiche[i].insertAdjacentHTML('beforeend', ' <div class="blur"style="display:grid"> <div class="gosabonner">Pour voir cette <b>fiche</b> il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>');
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
                    console.log("correction est :", correction)


                    if (!exercicesAvecBlur[identifiantExercice]) {
                        console.log("l'exercice est censé être flouté  :", correction)
                            correction.insertAdjacentHTML('beforeend', ' <div class="blur"style="display:grid"> <div class="gosabonner">Pour voir cette <b>correction</b> ou <b>recommencer</b> cet exercice il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>');
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
                        if (checkStatus(identifiantExercice)) {
                            if (contenairexercice[i].contentWindow.document.body.querySelector('.outcome')) {
                                

if (!isblurred[identifiantExercice]) {

                            var correction = contenairexercice[i].contentWindow.document.body.querySelector('.outcome');
                                    correction.insertAdjacentHTML('beforeend', ' <div class="blur"style="display:grid"> <div class="gosabonner">Pour voir cette <b>correction</b> ou <b>recommencer</b> cet exercice il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>')
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
