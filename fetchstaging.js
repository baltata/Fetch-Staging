////BIIiiitE

const sheetId = '1y1PahGXnVrd0SQ4gYGKjLz7xaXh3BQbz8BI_9Il5Qaw';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'userdataStaging';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`
const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')
console.log("output is :", output);
console.log("url est :", url)
function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(rep)
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
            injectHTML(traitementListe(liste));



        })










}
function injectHTML(liste) {


    for (var i = 0, len = liste.length; i < len; i++) {

        var contenairexercice = document.querySelectorAll(".exercice iframe");
        for (let iframe of contenairexercice) {

        
                identifiantExercice = iframe.parentElement.id;
                if (checkStatus(identifiantExercice)) {
                    if (iframe.contentWindow.document.body.querySelector('.outcome')) {
                        



                    var correction = iframe.contentWindow.document.body.querySelector('.outcome');
                            correction.insertAdjacentHTML('beforeend', ' <div class="blur" style="display:grid"> <div class="gosabonner">Pour voir la <b>correction</b> ou <b>recommencer</b> un exercice il faut un compte premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>')




                        }
                    }};}



        for (var i = 0, len = liste.length; i < len; i++) {
            var isThePageBeingEdited = document.querySelector("body").id;
            if (isThePageBeingEdited != "page-mod-book-edit") {
                console.log("DEBUT DU SSSS");
                var contenairexercice = document.querySelectorAll(".exercice iframe");
                for (let iframe of contenairexercice) {

                    iframe.addEventListener("load", () => {
                        identifiantExercice = iframe.parentElement.id;
                        if (checkStatus(identifiantExercice)) {
                            if (iframe.contentWindow.document.body.querySelector('.outcome')) {
                                



                            var correction = iframe.contentWindow.document.body.querySelector('.outcome');
                                    correction.insertAdjacentHTML('beforeend', ' <div class="blur" style="display:grid"> <div class="gosabonner">Cet exercice est réservé à nos utilisateurs premium 👑. <br><a target="_parent" class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>')




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
    console.log("la liste traitee est:", listeTraitee)
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
