const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// create Elements amd render cafe
function renderCafe(doc) {
   let li = document.createElement("li");
   let name = document.createElement("span");
   let city = document.createElement("span");

   let iconsContainer = document.createElement("div");
   let deleteIcon = document.createElement("i");
   let editIcon = document.createElement("i");

   li.setAttribute("data-id", doc.id);
   li.setAttribute("class", "list");

   deleteIcon.setAttribute("class", "material-icons");
   deleteIcon.textContent = "delete";
   editIcon.setAttribute("class", "material-icons edit");
   editIcon.textContent = "edit";

   name.textContent = doc.data().name;
   city.textContent = doc.data().city;

   li.appendChild(name);
   li.appendChild(city);
   iconsContainer.appendChild(deleteIcon);
   iconsContainer.appendChild(editIcon);
   li.appendChild(iconsContainer);

   cafeList.appendChild(li);

   //deleting data
   deleteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      //.list item data id
      let id = li.getAttribute("data-id");
      //.console.log(id);
      db.collection("cafes").doc(id).delete();
   });

   //editing the data
   let edited = false;
   editIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (edited == false) {
         editIcon.textContent = "check";
         //.making the content editable
         name.contentEditable = true;
         city.contentEditable = true;
         edited = true;
         //.adding border
         name.style.borderBottom = "2px solid #88236f";
         city.style.borderBottom = "1px solid #88236f";
      } else if (edited == true) {
         name.contentEditable = false;
         city.contentEditable = false;
         editIcon.textContent = "edit";
         edited = false;
         //.getting the id
         let id = li.getAttribute("data-id");
         //.removing the border
         name.style.borderBottom = "none";
         city.style.borderBottom = "none";
         //.console.log(id);
         db.collection("cafes").doc(id).update({
            name: name.textContent,
            city: city.textContent,
         });
      }
   });
}

//modifying the data
function modify(data, list) {
   let spans = list.getElementsByTagName("span");
   spans[0].textContent = data.name;
   spans[1].textContent = data.city;
}

//Calling the data
db.collection("cafes").onSnapshot((snapshot) => {
   let changes = snapshot.docChanges();
   changes.forEach((change) => {
      if (change.type == "added") {
         renderCafe(change.doc);
      } else if (change.type == "removed") {
         let li = cafeList.querySelector(`li[data-id="${change.doc.id}"]`);
         li.remove();
      } else if (change.type == "modified") {
         //.console.log("modified");
         let li = cafeList.querySelector(`li[data-id="${change.doc.id}"]`);
         modify(change.doc.data(), li);
      }
   });
});

//saving data
form.addEventListener("submit", (e) => {
   e.preventDefault();
   if (
      form.name.value == "" ||
      form.city.value == "" ||
      (form.name.value == "" && form.city.value == "")
   ) {
      var elem = document.querySelector(".modal");
      var instance = M.Modal.init(elem, {});
      instance.open();
   } else {
      db.collection("cafes").add({
         name: form.name.value,
         city: form.city.value,
      });
      form.name.value = "";
      form.city.value = "";
   }
});
