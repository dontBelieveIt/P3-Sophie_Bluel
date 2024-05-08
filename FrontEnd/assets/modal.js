/**
 *Here is all element in regards with the Modal and its functions. 

Contents: 
  editMode function : Line ""
  Open and close modal :  Line "" 
  *Open modal & Close modal onlick function(); 
  Generate Photos : Line "" ;
  Delete Photo Modal : Line ""; 
  Add Photo Modal : Line ""; 

  For the login() and looged() function, go see the userLogin.js file (../assets/userLogin.js); 
  For the gallery section of the index.html file and the filter button, see the filter.js file (../assets/filter.js); 
 */



// Authentification token requiered for the modals to appear as well as the "Delete" and "Add Work" functions. 


/**********************************************Open and close modal**********************************************************/
// This function check, in the first place, the presence of the authentication token. If present, then the "edit" button is present. 
//***if not present, the edit button is hidden. 
//***if the edit button is shown, then, once clicked, it opens the modal, where deleting and/or adding a new work is possible. 
const editModeButton = document.getElementById("mesProjets");

function editMode() {
  const token = sessionStorage.getItem("authenticationToken");

  if (token) {
        // To open the Modal onclick
    editModeButton.style.display = "flex";
    const openModal = document.createElement("button"); 
      openModal.id = "data-open-modal"; 
      openModal.classList.add("mes-projets-btn"); 
      openModal.innerHTML = `<span class="material-symbols-outlined">edit_square</span>`+` modifier`;
      editModeButton.appendChild(openModal);
    
    openModal.onclick = function() {
      console.log("I clicked !");
      showModals();
    };
  };
};
editMode();

//This is to create the main modal, where it is possible to delete photos, or go to the "ajouter une photo" modal
//***for the "Ajouter une photo", see the showAddModal() function 
const modalLocation = document.getElementById("modalsAreHere"); 
function showModals() {

  const overlay = document.createElement("div"); 
    overlay.classList.add("overlayed"); 
    const body = document.querySelector("body"); 
    body.appendChild(overlay);

  //creation of the Main Modal and the event linked to button
  const mainModal = document.createElement("dialog"); 
    mainModal.classList.add("modal"); 
    mainModal.id = "data-modal"; 
    mainModal.style.display = "block"; 
    modalLocation.appendChild(mainModal); 
  const modalContent = document.createElement("div"); 
    modalContent.classList.add("modal-content"); 
    mainModal.appendChild(modalContent); 
  const buttonCloseModal = document.createElement("button");
    buttonCloseModal.id = "data-close-modal"; 
    buttonCloseModal.classList.add("btn-close-modal"); 
    buttonCloseModal.innerHTML = `<span class="material-symbols-outlined">close</span>`; 
    modalContent.appendChild(buttonCloseModal); 
    buttonCloseModal.addEventListener("click", () => {
      console.log("I clicked on the close modal button !");
      mainModal.remove();
    });
  const galleryPhotoH1 = document.createElement("h1"); 
    galleryPhotoH1.innerText = `Galerie photo`; 
    modalContent.appendChild(galleryPhotoH1);
  const galleryContentDiv = document.createElement("div"); 
    galleryContentDiv.classList.add("gallery-content"); 
    modalContent.appendChild(galleryContentDiv);
  const modalHr = document.createElement("hr"); 
    modalContent.appendChild(modalHr);
  const buttonOpenAddModal = document.createElement("button"); 
    buttonOpenAddModal.classList.add("btn", "btn-green"); 
    buttonOpenAddModal.id = "openAddModal";
    buttonOpenAddModal.innerText = `Ajouter une photo`; 
    modalContent.appendChild(buttonOpenAddModal);
    buttonOpenAddModal.addEventListener("click", () => { 
      console.log("I clicked to go to the second modal !")
      mainModal.remove();
      overlay.remove();
      addPhotoModal(); 
    });
    overlay.addEventListener("click", () => {
      mainModal.remove();
      overlay.remove()
    })

  /**********************************************Generate photo***(main modal)*******************************************************/
  // Function for the photos to appear in the modal, (duplication from the generatePhoto(works) (function from the "assets/filter.js" file))
  function genererModalPhotos(){
    // modalWorks = galleryContentDivFunction(); 
    // To fetch the ressources in the gallerie-content for the modal
    fetch('http://localhost:5678/api/works')
      .then(resp => resp.json())
      .then(works => {
      
        works.forEach(item => {

          // Creation des figures et images de la modal
          const modalFigure = document.createElement("figure");
          modalFigure.id = `figure-${item.id}`;
          const modalPhotoURL = document.createElement("img");
          modalPhotoURL.src = item.imageUrl;
          modalPhotoURL.alt = item.alt; 
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-btn");
          deleteButton.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
          deleteButton.setAttribute("dataId", item.id);
          
          galleryContentDiv.appendChild(modalFigure);
          modalFigure.appendChild(modalPhotoURL); 
          modalFigure.appendChild(deleteButton);

          // Event listener for the delete work function 
          deleteButton.addEventListener("click", deleteWork);         
        })
      })
  }; //function genererModalPhotos() 
  genererModalPhotos();

  /******************************************************************************************************************************************
  *********************************************** delete photo (main Modal)***************************************************************************
  ******************************************************************************************************************************************/
  function deleteWork(e) {
    e.preventDefault();
    const token = sessionStorage.getItem("authenticationToken");  
    const itemId = e.currentTarget.getAttribute("dataId");

    fetch(`http://localhost:5678/api/works/${itemId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    })
    .then(response => {
      if (response.ok) {
          alert("Delete successful !");
          window.location.reload();
      }
    })
    .catch(error => {
      console.error(error);
      alert('Une erreur s\'est produite lors de la suppression du travail');
      reject(error);
    });
  };  //function deleteWork(e)

  /******************************************************************************************************************************************
  *********************************************** add photo modal***(secondary modal)************************************************************************
  ******************************************************************************************************************************************/
  function addPhotoModal() {
    const overlay2 = document.createElement("div"); 
    overlay2.classList.add("overlayed"); 
    const body = document.querySelector("body"); 
    body.appendChild(overlay2);
    
    const dialogAddPhoto = document.createElement("dialog"); 
      dialogAddPhoto.classList.add("modal"); 
      dialogAddPhoto.style.display = "block"; 
      modalLocation.appendChild(dialogAddPhoto); 
    const addPhotoDiv = document.createElement("div"); 
      addPhotoDiv.classList.add("add-photo-modal", "modal-content"); 
      dialogAddPhoto.appendChild(addPhotoDiv); 
    const btnCloseAddModal = document.createElement("button"); 
      btnCloseAddModal.id = "add-close-modal"; 
      btnCloseAddModal.classList.add("btn-close-modal"); 
      btnCloseAddModal.innerHTML = `<span class="material-symbols-outlined">close</span>`; 
      addPhotoDiv.appendChild(btnCloseAddModal); 
      btnCloseAddModal.addEventListener("click", () => {
        dialogAddPhoto.remove(); 
      }) 
    const btnBackMainModal = document.createElement("button"); 
      btnBackMainModal.id = "return-main-modal"; 
      btnBackMainModal.classList.add("btn-return"); 
      btnBackMainModal.innerHTML = `<span class="material-symbols-outlined">arrow_back</span></button>`;
      addPhotoDiv.appendChild(btnBackMainModal); 
      btnBackMainModal.addEventListener("click", () => {
        dialogAddPhoto.remove(); 
        showModals(); 
      } )
    const titleAddModal = document.createElement("h1"); 
      titleAddModal.innerText = "Ajout photo"; 
      addPhotoDiv.appendChild(titleAddModal); 
    
      overlay2.addEventListener("click", () => {
        dialogAddPhoto.remove();
        overlay2.remove()
      })
    
    /****************************add form***(secondary modal)*********************************************/
    //Form  
    const newWorkForm = document.createElement("form"); 
      newWorkForm.method = "post"; 
      newWorkForm.id = "addPhoto"; 
      addPhotoDiv.appendChild(newWorkForm); 
      newWorkForm.addEventListener('change', () => { 
        formSubmitBtnActive(); 
      })
      
      //create element of the div for the adding file section
      const addImgFileDiv = document.createElement("div"); 
        addImgFileDiv.id = "addImg";  
        addImgFileDiv.classList.add("add-img");
        newWorkForm.appendChild(addImgFileDiv);
      const addImgPicture = document.createElement("span"); 
        addImgPicture.innerText= `image`;
        addImgPicture.classList.add("material-symbols-outlined");
        addImgFileDiv.appendChild(addImgPicture); 
      const addImgFileLabel = document.createElement("label"); 
        addImgFileLabel.htmlFor = "myImage";
        addImgFileLabel.href = "myImage";
        addImgFileLabel.innerText = `+ Ajouter photo`;  
        addImgFileDiv.appendChild(addImgFileLabel);
      const addImgFile = document.createElement("input");
        addImgFile.type = "file"; 
        addImgFile.name = "myImage"; 
        addImgFile.id = "myImage";
        addImgFile.accept = "image/png, image/jpeg";
        addImgFile.required = true;
        addImgFile.style.display = "none";
        addImgFileDiv.appendChild(addImgFile);
      const addImgP = document.createElement("p"); 
        addImgP.innerText = `jpg, png: 4mo max`; 
        addImgFileDiv.appendChild(addImgP); 
      const breakTag = document.createElement("br"); 
        addImgFileDiv.appendChild(breakTag);

      //Title input 
      const formTitleLabel = document.createElement("label"); 
        formTitleLabel.htmlFor = "title"; 
        formTitleLabel.innerText = "Title"; 
        newWorkForm.appendChild(formTitleLabel); 
        const breakTag2a = document.createElement("br"); 
        newWorkForm.appendChild(breakTag2a);
      const formTitleInput = document.createElement("input");
        formTitleInput.setAttribute("type", "text");
        formTitleInput.name = "title"; 
        formTitleInput.id = "title"; 
        formTitleInput.required = true; 
        formTitleInput.autocomplete = "off";
        newWorkForm.appendChild(formTitleInput); 
        const breakTag2b = document.createElement("br"); 
        newWorkForm.appendChild(breakTag2b);
      
      //Categorie input 
      const formCatLabel = document.createElement("label");
        formCatLabel.htmlFor = "categorie-listbox"; 
        formCatLabel.innerText = "Catégories"; 
        newWorkForm.appendChild(formCatLabel); 
      const formCatInput = document.createElement("select"); 
        formCatInput.name = "categorie-listbox"; 
        formCatInput.id = "categorie-listbox"; 
        formCatInput.required = true; 
        newWorkForm.appendChild(formCatInput); 
        const breakTag3a = document.createElement("br"); 
        newWorkForm.appendChild(breakTag3a);
        const option1 = document.createElement("option");
          option1.text = "Objet";
          option1.value = 1; 
          formCatInput.add(option1);
        const option2 = document.createElement("option");
          option2.text = "Appartements";
          option2.value = 2; 
          formCatInput.add(option2);
        const option3 = document.createElement("option");
          option3.text = "Hôtels et Restaurants";
          option3.value = 3; 
          formCatInput.add(option3);
      const breakTag3b = document.createElement("br"); 
      newWorkForm.appendChild(breakTag3b);
  
      //Submit button 
      const formSubmitBtn = document.createElement("input"); 
        formSubmitBtn.setAttribute("type", "submit");
        formSubmitBtn.id = "submit-grey"; 
        formSubmitBtn.classList.add("btn"); 
        formSubmitBtn.value = "Valider"; 
        formSubmitBtn.disabled = true;
        newWorkForm.appendChild(formSubmitBtn); 
        formSubmitBtn.addEventListener("submit", (e) => {
          e.preventDefault();
          addImg();
        })
      
      /****************************addImgFile btn***(secondary modal)*********************************************/
      //***Add event listener : for the add file section
      addImgFile.addEventListener('input', (e) => { 
        const imgFileLength = addImgFile.files[0].size; 
        if(imgFileLength > 0){
            let fileSizeMb = imgFileLength /1024 / 1024 ; //convert byte to kiloBytes (first 1024) then to Megabytes (second 1024); 
            let fileSizeLimit = 32 //Megabits : because 4Mo = 32Mb. 
            if (fileSizeMb < fileSizeLimit) {
              console.log("Your image respect the size limit."); 
              // addImgPicture.remove(); 
              // addImgFileLabel.remove(); 
              // addImgFile.remove();
              // addImgP.remove();
        
              const addPreviewImg = document.createElement("img"); 
                addPreviewImg.classList.add("addedPhoto");
                addPreviewImg.src = URL.createObjectURL(addImgFile.files[0]);
                addPreviewImg.appendChild(addImgFileDiv);              
              return true
            } else { 
              alert("Image trop lourde. Veuillez choisir un autre fichier.")
              return false 
            };
        } else { 
          alert("Fichier invalide. Veuillez choisir un autre fichier.")
          return false
        };
      });

    function formSubmitBtnActive() {
      if (addImgFile.files[0] != undefined && formTitleInput.value != "") {
        formSubmitBtn.disabled = false; 
      }
    }

  } //end of the addModalPhoto() function 


  // /**********************************************add photo function***API*******************************************************/

  function addImg() {
    const token = sessionStorage.getItem("authenticationToken");
    const formData = new FormData(); 
    
    formData.append("title", document.getElementById("title").value); 
    formData.append("category", document.getElementById("categorie-listbox").value); 
    formData.append("image", addImgFile.files[0]);
  
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        })
  
        .then(response => {
            if (response.status !== 201) {
                alert("Erreur : l'image n'a pas pu être ajoutée. Veuillez réessayer.");
            } else {
                return response.json();
            }
            
        })
        .then(authorization => {
            const token = authorization.token;
            sessionStorage.setItem("authenticationToken", token);
            window.location.href = "index.html";
        })
        .catch(err => {
            console.log(err);
            alert("Une erreur s'est produite lors de l'importation du fichier'. Veuillez réessayer plus tard.");
        });
  };
};