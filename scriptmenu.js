const btnExpandir = document.querySelector('.btn-expandir');
const damageRelations = document.querySelector('.damage-relations');

btnExpandir.addEventListener('click', () => {
    if (damageRelations.style.left === '63.5%') {
        damageRelations.style.left = '40%';
    } else {
        damageRelations.style.left = '63.5%';
    }
});
