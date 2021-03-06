/*--- DES FONCTIONS POUR ACCEDER AU LOCAL STORAGE ---*/
// à voir comment tu crées le nom des clés

var clef = "memoliens" + _userdata.user_id;

var getStorageItem = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

var setStorageItem = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

var removeStorageItem = (name) => {
  localStorage.removeItem(name);
};

// on formate les données du localStorage

// on accède au storage et on en récupère la liste de liens (toujours à voir comment tu crées le nom de la clé ici mémolien en attendant)
let topicsInList = getStorageItem(clef);

var formatList = () => {
  // si la liste est vide, on renvoie un tableau vide
  if (!topicsInList) {
    return [];
  }
  // si le localStorage contient un objet seul (un seul lien), on le transforme en tableau à une entrée
  if (!topicsInList[0]) {
    return Array.of(topicsInList);
  }
  // sinon, on reprend le tableau qui existe déjà tel quel
  return topicsInList;
};

// on crée une variable qui utilise la fonction formatList pour avoir accès directement au tableau de liens
let arrayOfTopics = formatList();

/*--- ON CREE UN BOUTON BLOC-NOTE QU'ON POSITIONNE EN ABSOLU PAR-DESSUS LA TOOLBAR ---*/

var blocNoteButton = document.createElement("button");
blocNoteButton.setAttribute("id", "blocnote-button");
blocNoteButton.classList.add("blocnote-button");
document.body.append(blocNoteButton);
blocNoteButton.innerHTML = '<img src="https://ewanouchka.github.io/Sinking_Past/blocnote.png" class="blocnote-button-img" id="blocnote-button-img"/>';

/*--- CREATION D'UN POPUP ---*/

// fonction création du bloc popup

var popupContainer = document.createElement("div");
var popupBloc = document.createElement("div");

var createPopup = (containerName, blocName) => {
  popupContainer.setAttribute("id", "popup");
  popupContainer.classList.add(containerName);
  popupBloc.setAttribute("id", blocName);
  popupBloc.classList.add(blocName);
  document.body.append(popupContainer);
  popupContainer.append(popupBloc);
};

// fonction fermeture du popup

var closePopup = () => {
  while (popupContainer.hasChildNodes()) {
    popupContainer.removeChild(popupContainer.firstChild);
  }
  document.body.removeChild(popupContainer);
};

/*--- ON CREE LE BLOC QUI PERMETTRA D'AJOUTER UN LIEN OU VIDER LE BLOC-NOTE ---*/
var blocNoteButton = document.getElementById("blocnote-button");

blocNoteButton.addEventListener("click", () => {
  var loadForm = () => {
    createPopup("form-container", "form-bloc");
    popupBloc.innerHTML =
      '<button id="close-cross" class="close-cross">X</button><button id="add-to-list" class="addli">+ Ajouter un lien</button><button id="remove-list" class="resetli">Reset</button>';

    document.getElementById("close-cross").addEventListener("click", () => {
      closePopup();
    });

    /*--- FONCTIONS MODIFICATIONS DE LA LISTE DES SUJETS (PART II) ---*/
    // --> suppression de l'ensemble du panier au clic sur "vider le panier"

    var supprAll = document.getElementById("remove-list");

    supprAll.addEventListener("click", () => {
      removeStorageItem(clef);

      topicsInList = getStorageItem(clef);

      arrayOfTopics = formatList();
      
      createPopup("form-container", "suppr-confirm");
      document.getElementById("suppr-confirm").innerHTML = `La liste a bien été vidée.
    <button class="button" id="close-confirm"><span>Fermer</span></button>`;

      document.getElementById("close-confirm").addEventListener("click", function () {
        loadForm();
      });
    });

    /*--- CREATION DU CONTENU DU FORMULAIRE A RENSEIGNER ---*/

    var createForm = () => {
      popupBloc.innerHTML = `<section class="bloc-form">
      <h2 class="bloc-form__title">Merci de remplir ce formulaire pour saisir le sujet</h2>
      <label for="Link" class="bloc-form__label">Votre sujet :</label>
      <input placeholder="ex: https://sinking-past.forumactif.com/" name="Link" id="Link" class="bloc-form__input" type="text" required oninput="checkValidity(this)">
      </input><span class="error-visible" id="error-message-Link"></span>
      <label for="Title" class="bloc-form__label">Le titre à afficher :</label>
      <input placeholder="ex: le nom du sujet" name="Title" id="Title" class="bloc-form__input" type="text" required oninput="checkValidity(this)">
      </input><span class="error-visible" id="error-message-Title"></span>
      <button class="button" id="add-confirm"><span>Ajouter</span></button>
      <button class="button" id="quit-add"><span>Quitter</span></button>
  `;
    };

    /*--- OUVERTURE DU FORMULAIRE QUAND ON CLIQUE SUR +AJOUTER UN LIEN ---*/
    // on écoute le clic sur le bouton dont l'id est add-to-list
    var addToListButton = document.getElementById("add-to-list");

    addToListButton.addEventListener("click", (event) => {
      event.preventDefault();

      var openForm = () => {
        createPopup("form-container", "popup-bloc");
        createForm(); // on appelle la fonction qui crée le contenu du formulaire

        var quitAdd = document.getElementById("quit-add"); // on sélectionne le bouton quitter

        quitAdd.addEventListener("click", function () {
          // au clic sur le bouton quitter :
          closePopup();
        });

        var validateAdd = document.getElementById("add-confirm"); // on sélectionne le bouton ajouter

        validateAdd.addEventListener("click", function () {
          // au clic sur le bouton ajouter :
          // foncion qui vérifier la conformité

          var inputValues = document.getElementsByClassName("bloc-form__input");

          var checkAllValidity = () => {
            let validity = true;
            for (var inputValue of inputValues) {
              if (inputValue.validity.valid == false) {
                validity = false;
              }
            }
            return validity;
          };

          // récupération des valeurs du formulaire si tout est OK

          if (checkAllValidity()) {
            // on crée un objet temporaire qui comportera le lien et le titre renseignés

            var getInputValue = (inputId) => {
              var inputValue = document.getElementById(`${inputId}`).value;
              return inputValue;
            };

            var optionsTopicToAdd = {
              link: getInputValue("Link"),
              title: getInputValue("Title"),
            };

            var addToList = () => {
              // si la liste du localStorage est vide, on crée un nouvel élément memolien avec le sujet en question à l'intérieur
              if (!topicsInList) {
                setStorageItem(clef, optionsTopicToAdd);

                topicsInList = getStorageItem(clef);

                arrayOfTopics = formatList();
                
                closePopup();
                return;
              }

              // si le localStorage contient la clé, on vérifie qu'on ne fait pas un doublon. Si ce n'est pas le cas on ajoute à la liste déjà présente le nouveau lien
              if (topicsInList && arrayOfTopics.every((value) => value.link !== optionsTopicToAdd.link)) {
                arrayOfTopics.push(optionsTopicToAdd);
                setStorageItem(clef, arrayOfTopics);

                topicsInList = getStorageItem(clef);

                arrayOfTopics = formatList();
                
                createPopup("form-container", "add-confirm");
                document.getElementById("add-confirm").innerHTML = `Le sujet a bien été ajouté.
              <button class="button" id="close-confirm"><span>Fermer</span></button>`;

                document.getElementById("close-confirm").addEventListener("click", function () {
                  loadForm();
                });
                return;
              }

              // si on n'est pas dans les cas précédents, on crée un message d'erreur
              else {
                createPopup("form-container", "popup-error");
                document.getElementById("popup-error").innerHTML = `Ce sujet est déjà dans la liste
              <button class="button" id="close"><span>Fermer</span></button>`;

                document.getElementById("close").addEventListener("click", function () {
                  openForm();
                });
              }
            };
            addToList();

            topicsInList = getStorageItem(clef);

            arrayOfTopics = formatList();

            return;
          } else {
            createPopup("form-container", "popup-error");
            document.getElementById("popup-error").innerHTML = `Merci de compléter les deux champs du formulaire.
          <button class="button" id="do-it-again"><span>Recommencer</span></button>`;

            document.getElementById("do-it-again").addEventListener("click", function () {
              openForm();
            });
          }
        });
      };
      openForm();
    });
  };
  loadForm();
});
