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
let endorsementDetails = {};

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

function clearInputFields() {
  textEndorsement.value = "";
  fromEndorsement.value = "";
  toEndorsement.value = "";
}
