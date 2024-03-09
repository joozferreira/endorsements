"use strict";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://endorsements-b3db0-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Variables to create and link to new database
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

// Global variables
const publishBtn = document.getElementById("publish");
const textEndorsement = document.getElementById("endorsement-text");
const fromEndorsement = document.getElementById("from");
const toEndorsement = document.getElementById("to");
const endorsementSection = document.getElementById("endorsement-section");
let endorsementDetails = {};
let userLikes = [];
const likesFromLocalStorage = JSON.parse(localStorage.getItem("userLikes"));

if (likesFromLocalStorage) {
  userLikes = likesFromLocalStorage;
  console.log(userLikes);
}

// Capture of endorsement from user and push to DB
publishBtn.addEventListener("click", function () {
  endorsementDetails = {
    text: textEndorsement.value,
    from: fromEndorsement.value,
    to: toEndorsement.value,
    likes: 0,
  };

  push(endorsementListInDB, endorsementDetails);

  clearInputFields();
});

// Update of endorsement list anytime any change/new endorsement is created
onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    const endorsementArr = Object.entries(snapshot.val());

    clearEndorsementSection();

    endorsementArr.forEach((item) => {
      createEndorsement(item);
    });
  } else {
    endorsementSection.innerHTML = "There are no endorsements yet...";
  }
});

// Clearing of input fields after submission
function clearInputFields() {
  textEndorsement.value = "";
  fromEndorsement.value = "";
  toEndorsement.value = "";
}

// Clearing of endorsement section to ensure no endorsement is repeated
function clearEndorsementSection() {
  endorsementSection.innerHTML = "";
}

// Use of template to create new endorsement cards
function createEndorsement(endorsement) {
  if ("content" in document.createElement("template")) {
    const template = document.getElementById("endorsement-template");
    const clone = template.content.cloneNode(true);
    clone.getElementById("endorsement-to").textContent = endorsement[1].to;
    clone.getElementById("endorsement-message").textContent =
      endorsement[1].text;
    clone.getElementById("endorsement-from").textContent = endorsement[1].from;
    clone.getElementById(
      "endorsement-likes"
    ).textContent = `🖤 ${endorsement[1].likes}`;

    clone.getElementById("endorsement-likes").addEventListener("click", () => {
      const key = endorsement[0];
      if (userLikes.includes(key)) {
        console.log("here");
        endorsement[1].likes -= 1;
        update(ref(database, `endorsementList/${key}`), endorsement[1]);
        userLikes.splice(userLikes.indexOf(key), 1);
      } else {
        endorsement[1].likes += 1;
        update(
          ref(database, `endorsementList/${endorsement[0]}`),
          endorsement[1]
        );
        userLikes.push(endorsement[0]);
      }
      localStorage.setItem("userLikes", JSON.stringify(userLikes));
    });

    endorsementSection.appendChild(clone);
  }
}
