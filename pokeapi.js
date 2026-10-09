let s_input = document.querySelector('#zoek-input');
let selected_box = document.querySelector('#vak1-middel');

let type_colors = {
    normal:   "#D3D3D3",
    fire:     "#FF4422",
    water:    "#3399FF",
    electric: "#FFCC33",
    grass:    "#77CC55",
    ice:      "#66CCFF",
    fighting: "#BB5544",
    poison:   "#AA5599",
    ground:   "#DDBB55",
    flying:   "#8899FF",
    psychic:  "#FF5599",
    bug:      "#AABB22",
    rock:     "#BBAA66",
    ghost:    "#6666BB",
    dragon:   "#7766EE",
    dark:     "#775544",
    steel:    "#AAAABB",
    fairy:    "#EE99EE"
};

let fallback_color = "#CCCCCC";

async function search_pokemon() {
    let name = s_input.value.trim().toLowerCase();

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

        let species_response = await fetch(data.species.url);
        let species = await species_response.json();

        let stats = data.stats;

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
        img.style.width = '100%';
        img.style.height = '100%';
        selected_box.appendChild(img);


        document.querySelector('#vak1-middel').addEventListener('click', function() {
            if (img.src === data.sprites.front_default) {
                img.src = data.sprites.front_shiny;
            }
            else {
                img.src = data.sprites.front_default;
            }
        });

        let types = data.types.map(function (e) {
            return e.type.name;
        });

        const entry = species.flavor_text_entries.find(e => e.language.name === "en");
        document.querySelector("#vak3-middel").innerHTML =
            entry ? entry.flavor_text.replace(/[\n\f]/g, " ") : "No description available";

        let color1 = type_colors[types[0]] || fallback_color;

        if (types.length === 2) {
            document.querySelector("#vak2-middel").innerHTML =
                "#" + species.id + " " + data.name.toUpperCase() +
                "<br>" + "Type: " + types[0] + " & " + types[1];

            let color2 = type_colors[types[1]] || fallback_color;

            selected_box.style.background =
                "linear-gradient(210deg, " + color1 + " 50%, " + color2 + " 50%)";

        } else {
            document.querySelector("#vak2-middel").innerHTML =
                "#" + species.id + " " + data.name.toUpperCase() +
                "<br>" + "Type: " + types[0];

            selected_box.style.background = color1;
        }

    } catch (error) {
        s_input.value = "";
        s_input.placeholder = "Something went wrong, try again";
        console.error(error);
    }
}

document.querySelector('#vak4-middel').innerHTML =
    "HP" + "<br>" + "Atk" + "<br>" + "Def" + "<br>" + "Sp.Atk" + "<br>" + "Sp.Def" + "<br>" + "Speed";


s_input.addEventListener('keydown', function (keypress) {
    if (keypress.key === 'Enter') {
        search_pokemon();
    }
});