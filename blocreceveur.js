/*--- ON AFFICHE LA LISTE DES LIENS DANS LE BLOC RECEVEUR ---*/
var blocReceveur = document.getElementById("receveur");

var listContent = () => {
  blocReceveur.innerHTML = arrayOfTopics
    .map(
      (topic) =>
        `<div class="cadillac"><a href="${topic.link}">${topic.title}</a> <button class="trash mini-button" aria-hidden="true"><i class="fas fa-trash-alt"></i></button></div>`
    )
    .join("");

  /*--- FONCTIONS MODIFICATIONS DE LA LISTE DES SUJETS (PART I) ---*/
  // --> suppression d'un sujet au clic sur la corbeille en fin de ligne

  var trashButton = document.getElementsByClassName("trash");

  Array.from(trashButton).forEach((button, index) => {
    button.addEventListener("click", () => {
      if (arrayOfTopics.length == 1) {
        removeStorageItem(clef);

        topicsInList = getStorageItem(clef);

        arrayOfTopics = formatList();
        listContent();

        // window.location.reload();
        return;
      }
      if (arrayOfTopics.length !== 1) {
        arrayOfTopics.splice(index, 1);
        setStorageItem(clef, arrayOfTopics);

        topicsInList = getStorageItem(clef);

        arrayOfTopics = formatList();
        listContent();
        //window.location.reload();
      }
    });
  });
};
listContent();
