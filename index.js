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

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

const publishBtn = document.getElementById("publish");
const textEndorsement = document.getElementById("endorsement-text");
const fromEndorsement = document.getElementById("from");
const toEndorsement = document.getElementById("to");
const likesEndorsement = document.getElementById("likes");
const endorsementSection = document.getElementById("endorsement-section");
let endorsementDetails = {};

publishBtn.addEventListener("click", function () {
  endorsementDetails = {
    text: textEndorsement.value,
    from: fromEndorsement.value,
    to: toEndorsement.value,
    likes: 0,
  };

  push(endorsementListInDB, endorsementDetails);
  createEndorsement(endorsementDetails);
  clearInputFields();
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    const endorsementArr = Object.values(snapshot.val());
    endorsementArr.forEach((item) => createEndorsement(item));
  } else {
    endorsementSection.innerHTML = "There are no endorsements yet...";
  }
});

function clearInputFields() {
  textEndorsement.value = "";
  fromEndorsement.value = "";
  toEndorsement.value = "";
}

function createEndorsement(endorsement) {
  if ("content" in document.createElement("template")) {
    const template = document.getElementById("endorsement-template");
    const clone = template.content.cloneNode(true);
    clone.getElementById("endorsement-to").textContent = endorsement.to;
    clone.getElementById("endorsement-message").textContent = endorsement.text;
    clone.getElementById("endorsement-from").textContent = endorsement.from;
    clone.getElementById(
      "endorsement-likes"
    ).textContent = `🖤 ${endorsement.likes}`;
    endorsementSection.appendChild(clone);
  }
}
