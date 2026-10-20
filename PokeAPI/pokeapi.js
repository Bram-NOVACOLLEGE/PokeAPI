let s_input = document.querySelector('#zoek-input');
let selected_box = document.querySelector('#vak1-middel');
let row_number = null

let current_pokemon = null;

function get_bar_color(base_stat) {
    if (base_stat < 30) {
        return "#FF4422";
    } else if (base_stat < 60) {
        return "#FF9933";
    } else if (base_stat < 90) {
        return "#FFCC33";
    } else if (base_stat < 120) {
        return "#77CC55";
    } else if (base_stat < 150) {
        return "#2E9B3E";
    } else {
        return "#3399FF";
    }
}

let stat_labels = {
    "hp": "HP",
    "attack": "ATK",
    "defense": "DEF",
    "special-attack": "SP.ATK",
    "special-defense": "SP.DEF",
    "speed": "SPD"
};

let type_colors = {
    normal: "#D3D3D3",
    fire: "#FF4422",
    water: "#3399FF",
    electric: "#FFCC33",
    grass: "#77CC55",
    ice: "#66CCFF",
    fighting: "#BB5544",
    poison: "#AA5599",
    ground: "#DDBB55",
    flying: "#8899FF",
    psychic: "#FF5599",
    bug: "#AABB22",
    rock: "#BBAA66",
    ghost: "#6666BB",
    dragon: "#7766EE",
    dark: "#775544",
    steel: "#AAAABB",
    fairy: "#EE99EE"
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

        let sprite = data.sprites.front_default;

        if (!sprite) {
            s_input.value = "";
            s_input.placeholder = "No sprite available";
            return;
        }

        current_pokemon = data;

        row_number = document.getElementById(data.name);

        if (row_number) {
            row_number.scrollIntoView({behavior: "smooth", block: "center"}); // HOLY SHIT HET WERKT!!!!
        }

        selected_box.innerHTML = "";

        let img = document.createElement("img");
        img.src = sprite;
        img.alt = data.name;
        img.style.width = '100%';
        img.style.height = '100%';
        selected_box.appendChild(img);

        let stats_box = document.querySelector('#vak4-middel');
        stats_box.innerHTML = "";

        data.stats.forEach(function (s) {
            let row = document.createElement("div");
            row.className = "stat-rij";

            let stat_name = document.createElement("span");
            stat_name.className = "stat-naam";
            stat_name.textContent = stat_labels[s.stat.name];

            let percentage = (s.base_stat / 255) * 100;

            let bar_bg = document.createElement("div");
            bar_bg.className = "stat-balk-bg";

            let bar = document.createElement("div");
            bar.className = "stat-balk";
            bar.style.width = "0%";
            bar.style.backgroundColor = get_bar_color(s.base_stat);


            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    bar.style.width = percentage + "%";
                })
            })
            bar_bg.appendChild(bar);

            let value = document.createElement("span");
            value.className = "stat-waarde";
            value.textContent = s.base_stat;

            row.appendChild(stat_name);
            row.appendChild(bar_bg);
            row.appendChild(value);
            stats_box.appendChild(row);
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

        s_input.placeholder = "Type here to search";

    } catch (error) {
        s_input.value = "";
        s_input.placeholder = "Something went wrong, try again";
        console.error(error);
    }
}


s_input.addEventListener('keydown', function (keypress) {
    if (keypress.key === 'Enter') {
        search_pokemon();
    }
});

selected_box.addEventListener('click', function () {
    if (!current_pokemon) return;

    let img = selected_box.querySelector('img');
    if (!img) return;

    if (img.src === current_pokemon.sprites.front_default) {
        img.src = current_pokemon.sprites.front_shiny || current_pokemon.sprites.front_default;
    } else {
        img.src = current_pokemon.sprites.front_default;
    }
});

document.querySelector('#vak1-onder').addEventListener('click', function () {
    current_pokemon = null;
    selected_box.innerHTML = "";
    selected_box.style.background = "";
    document.querySelector('#vak2-middel').innerHTML = "";
    document.querySelector('#vak3-middel').innerHTML = "";
    document.querySelector('#vak4-middel').innerHTML = "";
    document.querySelector('#zoek-input').value = "";
    document.querySelector('#rechte-blok').scrollTop = 0;
    s_input.placeholder = "Type here to search";
});

let CrySound = null
document.querySelector('#vak2-onder').addEventListener('click', function () {
    if (!current_pokemon) return;

    if (CrySound) {
        CrySound.pause();
    }

    CrySound = new Audio(current_pokemon.cries.latest || current_pokemon.cries.legacy);
    CrySound.play();

});
let list_box = document.querySelector('#rechte-blok');

async function load_pokemon_list() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    let pokemon_list = await response.json()
    pokemon_list.results.forEach(function (p) {
        let id = p.url.split("/").filter(Boolean).pop();
        let item = document.createElement("div");
        let list_sprite = document.createElement("img")
        list_sprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png";
        list_sprite.alt = p.name;
        item.className = "lijst-item";
        let name_and_id = document.createElement("div");
        name_and_id.className = "name_and_id"
        name_and_id.textContent = "#" + id + " " + p.name;
        item.id = p.name;

        item.append(list_sprite);
        item.append(name_and_id);

        item.addEventListener('click', function () {
            s_input.value = p.name;
            search_pokemon();

        });
        list_box.append(item)
    });

}

load_pokemon_list()

//Gemaakt met het lijden van Matthew