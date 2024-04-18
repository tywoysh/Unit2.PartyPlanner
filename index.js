const COHORT = "2402-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

const deleteButtons = document.getElementsByClassName("delete");
console.log(deleteButtons);

// const deleteButton = document.querySelector("#delete")
// deleteButton.addEventListener("click", deleteParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with artists from API
 */
async function getParties() {
  // TODO
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.parties = data.data;
    console.log("state:", state.parties);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render artists from state
 */
function renderParties() {
  // TODO
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No parties to list</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${party.name}</h2>
        <h4>Date: ${party.date.slice(0, 10)}</h4>
        <h4>Time: ${party.date.slice(11, 16)}<h4>
        <h4>Location: ${party.location}</h4>
        <p>${party.description}</p>
        <button onclick="deleteParty(${party.id})">Delete Party</button>
      `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();
  // TODO

  const name = addPartyForm.name.value;
  const description = addPartyForm.description.value;
  const date =
    addPartyForm.date.value + "T" + addPartyForm.time.value + ":00.000Z";
  const location = addPartyForm.location.value;

  console.log(date);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        date,
        location,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  }

  render();
}
