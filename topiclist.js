/*--- DES FONCTIONS POUR ACCEDER AU LOCAL STORAGE ---*/
// à voir comment tu crées le nom des clés

const clef = "memoliens"; //+ _userdata.user_id;

const getStorageItem = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

const setStorageItem = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

const removeStorageItem = (name) => {
  localStorage.removeItem(name);
};

// on formate les données du localStorage

// on accède au storage et on en récupère la liste de liens (toujours à voir comment tu crées le nom de la clé ici mémolien en attendant)
let topicsInList = getStorageItem(clef);

const formatList = () => {
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

// appels des fonctions pour affichage

/*--- CREATION D'UN POPUP ---*/

// fonction création du bloc popup

const popupContainer = document.createElement("div");
const popupBloc = document.createElement("div");

const createPopup = (popupName) => {
  popupContainer.setAttribute("id", "popup");
  popupContainer.classList.add("popup-container");
  popupBloc.classList.add(popupName);
  document.body.append(popupContainer);
  popupContainer.append(popupBloc);
};

// fonction fermeture du popup

const closePopup = () => {
  while (popupContainer.hasChildNodes()) {
    popupContainer.removeChild(popupContainer.firstChild);
  }
  document.body.removeChild(popupContainer);
};

/*--- CONTENU DU POPUP QUI SE SUPERPOSE AU BLOC DE LA TOOLBAR ---*/

    createPopup("popup-receveur");
  const blocParent = document.querySelector(".popup-receveur");
  blocParent.classList.add("display-block");
  blocParent.innerHTML = '<div id="receveur-topiclist"></div>
    <button id="add-to-list" class="addli">+ Ajouter un lien</button><button id="remove-list" class="resetli">Reset</button>';


const blocFA = document.querySelector("#fa_right");
if(blocFA.hasClass('welcome')) {blocParent.classList.add("display-block")};

const blocReceveur = document.querySelector("#receveur-topiclist");

const listContent = () => {
  blocReceveur.innerHTML = arrayOfTopics
    .map(
      (topic) =>
        `<div class="cadillac"><a href="${topic.link}">${topic.title}</a> <button class="trash mini-button" aria-hidden="true"><i class="fas fa-trash-alt"></i></button></div>`
    )
    .join("");

  /*--- FONCTIONS MODIFICATIONS DE LA LISTE DES SUJETS ---*/
  // --> suppression d'un sujet au clic sur la corbeille en fin de ligne

  let trashButton = document.querySelectorAll(".trash");

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


/*--- CONTENU D'UN POPUP CONTENANT LE FORMULAIRE A RENSEIGNER ---*/

const createForm = () => {
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
const addToListButton = document.querySelector("#add-to-list");

addToListButton.addEventListener("click", (event) => {
  event.preventDefault();

  const openForm = () => {
    createPopup("popup-bloc");
    createForm(); // on appelle la fonction qui crée le corps du formulaire

    const quitAdd = document.querySelector("#quit-add"); // on sélectionne le bouton quitter

    quitAdd.addEventListener("click", function () {
      // au clic sur le bouton quitter :
      closePopup();
    });

    const validateAdd = document.querySelector("#add-confirm"); // on sélectionne le bouton ajouter

    validateAdd.addEventListener("click", function () {
      // au clic sur le bouton ajouter :
      // foncion qui vérifier la conformité

      const inputValues = document.querySelectorAll(".bloc-form__input");

      const checkAllValidity = () => {
        let validity = true;
        for (const inputValue of inputValues) {
          if (inputValue.validity.valid == false) {
            validity = false;
          }
        }
        return validity;
      };

      // récupération des valeurs du formulaire si tout est OK

      if (checkAllValidity()) {
        // on crée un objet temporaire qui comportera le lien et le titre renseignés

        const getInputValue = (inputId) => {
          const inputValue = document.querySelector(`#${inputId}`).value;
          return inputValue;
        };

        const optionsTopicToAdd = {
          link: getInputValue("Link"),
          title: getInputValue("Title"),
        };

        const addToList = () => {
          // si la liste du localStorage est vide, on crée un nouvel élément memolien avec le sujet en question à l'intérieur
          if (!topicsInList) {
            setStorageItem(clef, optionsTopicToAdd);

            topicsInList = getStorageItem(clef);

            arrayOfTopics = formatList();

            listContent();
            closePopup();
            return;
          }

          // si le localStorage contient la clé, on vérifie qu'on ne fait pas un doublon. Si ce n'est pas le cas on ajoute à la liste déjà présente le nouveau lien
          if (topicsInList && arrayOfTopics.every((value) => value.link !== optionsTopicToAdd.link)) {
            arrayOfTopics.push(optionsTopicToAdd);
            setStorageItem(clef, arrayOfTopics);

            topicsInList = getStorageItem(clef);

            arrayOfTopics = formatList();

            listContent();
            closePopup();
            return;
          }

          // si on n'est pas dans les cas précédents, on crée un message d'erreur
          else {
            createPopup("popup-error");
            document.querySelector(".popup-error").innerHTML = `Ce sujet est déjà dans la liste
              <button class="button" id="close"><span>Fermer</span></button>`;

            document.querySelector("#close").addEventListener("click", function () {
              openForm();
            });
          }
        };
        addToList();

        topicsInList = getStorageItem(clef);

        arrayOfTopics = formatList();

        listContent();
        return;
      } else {
        createPopup("popup-error");
        document.querySelector(".popup-error").innerHTML = `Merci de compléter les deux champs du formulaire.
          <button class="button" id="do-it-again"><span>Recommencer</span></button>`;

        document.querySelector("#do-it-again").addEventListener("click", function () {
          openForm();
        });
      }
    });
  };
  openForm();
});

// --> suppression de l'ensemble du panier au clic sur "vider le panier"

const supprAll = document.querySelector("#remove-list");

supprAll.addEventListener("click", () => {
  removeStorageItem(clef);

  topicsInList = getStorageItem(clef);

  arrayOfTopics = formatList();

  listContent();
});
/*
// TON CODE D'ORIGINE --> Je n'y laisse que la partie affichage des div

$(function() {
    $(function() {
    $("#switch_parent").attr("id","newId");
    $('#fa_menulist').html("<div id='fa_usermenu'>" + _userdata.username + "<div id='tool_switch'>" + $("#newId").html()+`</div></div><div class="parentli">
    <div id="receveur"></div>
    <button id="add-to-list" class="addli" data-uw-styling-context="true">+ Ajouter un lien</button
    ><button id="remove-list" class="resetli" data-uw-styling-context="true">Reset</button>
  </div>`);
    $("#newId").remove();
    })
      });*/
