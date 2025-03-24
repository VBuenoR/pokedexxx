const pokemonName = document.querySelector('.pokemon_name');
const pokemonNamecompleto = document.querySelector('.pokemon_data');

const pokemonID = document.querySelector('.pokemon_id');
const pokemonIMG = document.querySelector('.pokemonImg');


const form = document.querySelector('.form');
const input = document.querySelector('.input_search');

const pokemonType1 = document.querySelector('.tipo1')
const pokemonType2 = document.querySelector('.tipo2')

const tipo1Img = document.getElementById('tipo1-img');
const tipo2Img = document.getElementById('tipo2-img');

const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const relationsContainer = document.querySelector('.damage-relations');


let searchPokemon = 1;


const typeImages = {
    grass: 'imagem/grass.svg',
    fire: 'imagem/fire.svg',
    water: 'imagem/water.svg',
    bug: 'imagem/bug.svg',
    normal: 'imagem/normal.svg',
    electric: 'imagem/electric.svg',
    psychic: 'imagem/psychic.svg',
    ice: 'imagem/ice.svg',
    fighting: 'imagem/fighting.svg',
    poison: 'imagem/poison.svg',
    ground: 'imagem/ground.svg',
    flying: 'imagem/flying.svg',
    rock: 'imagem/rock.svg',
    ghost: 'imagem/ghost.svg',
    dragon: 'imagem/dragon.svg',
    dark: 'imagem/dark.svg',
    steel: 'imagem/steel.svg',
    fairy: 'imagem/fairy.svg',
  };


const fetchPokemon = async (pokemon) => {

    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
   
    if (APIResponse.status == 200){

        const data = await APIResponse.json();
        
        return data;
    } 
}

const fetchPokemonTypes = async (types) => {
    const typesData = [];
    for (const type of types) {
        const typeResponse = await fetch(type.type.url);
        const typeData = await typeResponse.json();
        typesData.push(typeData);
    }
    return typesData;
};

const fetchTypeDamageRelations = async (typeUrl) => {
    const response = await fetch(typeUrl);
    if (response.status === 200) {
        return await response.json();
    }
    return null;
};

const renderTypeDamageRelations = async (types) => {
    relationsContainer.innerHTML = '';

    for (const type of types) {
        const typeData = await fetchTypeDamageRelations(type.type.url);

        if (typeData) {
            const { double_damage_to, double_damage_from } = typeData.damage_relations;

            // Criar um contêiner base
            const typeRelationContainer = document.createElement('div');
            typeRelationContainer.classList.add('type-relation');

            const title = document.createElement('h3');
            title.textContent = type.type.name.toUpperCase();
            typeRelationContainer.appendChild(title);

            const generateTypeList = (relationTypes, listClass) => {
                const listContainer = document.createElement('div');
                listContainer.classList.add('relation-list', listClass);
                if (relationTypes.length > 0) {
                    relationTypes.forEach((type) => {
                        const item = document.createElement('div');
                        item.style.display = 'flex';
                        item.style.alignItems = 'center';
                        item.style.margin = '5px 0';

                        const img = document.createElement('img');
                        img.src = typeImages[type.name];
                        img.alt = type.name;
                        img.style.width = '20px';
                        img.style.marginRight = '5px';

                        const text = document.createElement('span');
                        text.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);

                        item.appendChild(img);
                        item.appendChild(text);
                        listContainer.appendChild(item);
                    });
                } else {
                    const noneText = document.createElement('span');
                    noneText.textContent = 'Nenhum';
                    listContainer.appendChild(noneText);
                }
                return listContainer;
            };

            const strongContainer = document.createElement('div');
            strongContainer.innerHTML = `<p><strong>Forte contra:</strong></p>`;
            strongContainer.appendChild(generateTypeList(double_damage_to, 'strong-list'));

            const weakContainer = document.createElement('div');
            weakContainer.innerHTML = `<p><strong>Fraco contra:</strong></p>`;
            weakContainer.appendChild(generateTypeList(double_damage_from, 'weak-list'));

            const content = document.createElement('div');
            content.classList.add('relation-content');
            content.style.display = 'grid';
            content.style.gridTemplateColumns = '1fr 1fr';
            content.style.gap = '20px';

            content.appendChild(strongContainer);
            content.appendChild(weakContainer);

            typeRelationContainer.appendChild(content);
            relationsContainer.appendChild(typeRelationContainer);
        }
    }
};


const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = 'Procurando';
    pokemonID.innerHTML = '';

    
    const data = await fetchPokemon(pokemon);

    if(data) {
        pokemonIMG.style.display ='block';

        if(data.name.length > 10) { 
            pokemonNamecompleto.style.fontSize = 'clamp(8px, 19px, 25px)'; 
            pokemonName.innerHTML = data.name;

        } else {
            pokemonNamecompleto.style.fontSize = 'clamp(8px, 5vw, 25px)'; 
        }

        pokemonName.innerHTML = data.name;


        const typesData = data.types; 
        renderTypeDamageRelations(typesData);
        
        pokemonType1.innerHTML = '';
        pokemonType2.innerHTML = '';
        tipo1Img.style.display = 'none';
        tipo2Img.style.display = 'none';
        
        if (typesData.length > 0) {
            pokemonType1.innerHTML = typesData[0].type.name;  
            tipo1Img.style.display = 'inline'; 
            tipo1Img.src = typeImages[typesData[0].type.name]; 
        }

        if (typesData.length > 1) {
            pokemonType2.innerHTML = typesData[1].type.name; 
            tipo2Img.style.display = 'inline';  
            tipo2Img.src = typeImages[typesData[1].type.name];  
        }



        pokemonID.innerHTML = data.id;

        pokemonIMG.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    
        input.value ='';
        searchPokemon = data.id;

    } else {
        pokemonIMG.style.display ='none';
        pokemonName.innerHTML = 'Não Encontrado'

        pokemonID.innerHTML = '';

    } 
}

form.addEventListener('submit',(event)=> {

    event.preventDefault();

    renderPokemon(input.value.toLowerCase());

});

buttonPrev.addEventListener('click',()=> {
    if(searchPokemon> 1){
        searchPokemon -= 1;
    renderPokemon(searchPokemon);
    }
    
});

buttonNext.addEventListener('click',()=> {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);
