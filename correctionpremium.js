var contenairexercice = document.querySelectorAll(".exercice iframe");
for (let iframe of contenairexercice) {
   iframe.addEventListener("load",() => {
  var correction =iframe.contentWindow.document.body.querySelector('.outcome');
  console.log("la correction est :",correction)
  correction.insertAdjacentHTML('beforeend',' <div class="blur" style="display:grid"> <div class="gosabonner">Cet exercice est réservé à nos utilisateurs premium 👑. <br><a class="awhite" href="https://galilee.ac/local/membership/plan.php"> <div class="whitebutton"><b> Nos offres</b></div></a> </div></div>')});
