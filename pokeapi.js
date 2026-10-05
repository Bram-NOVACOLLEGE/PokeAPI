let s_input = document.querySelector('.zoek-balk');
async function search_pokemon() {
    let name = s_input.value.trim().toLowerCase();

    if (selected_box === null) {
        selected_box = document.querySelector(.vak1-middel');
    }

    if (name === "" || selected_box === null) {
        return;
    }
  try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(name));

        if (!response.ok) {
            s_input.value = "";
            s_input.placeholder = "Pokémon not found, try again";
            return;
        }

        let data = await response.json();
        let sprite = data.sprites.front_default;

        if (!sprite) {
            s_input.value = "";
            s_input.placeholder = "No sprite available";
            return;
        }
    selected_box.innerHTML = "";
        let img = document.createElement("img");
        img.src = sprite;
        img.alt = data.name;
        selected_box.appendChild(img);
    s_input.addEventListener('keydown', function (keypress) {
    if (keypress.key === 'Enter') {
        void search_pokemon();
    }
