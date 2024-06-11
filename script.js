// JavaScript for App Logic
document.addEventListener('DOMContentLoaded', () => {
    const ingredientForm = document.getElementById('ingredient-form');
    const recipesContainer = document.getElementById('recipes');
    const API_KEY = 'c357206fe98f4e64b563b699a1319683'; // Replace with your Spoonacular API key

    ingredientForm.addEventListener('submit', fetchRecipes);

    async function fetchRecipes(event) {
        event.preventDefault();
        const ingredients = document.getElementById('ingredients').value;
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${API_KEY}`);
        const data = await response.json();
        displayRecipes(data);
    }

    function displayRecipes(recipes) {
        recipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeEl = document.createElement('div');
            recipeEl.classList.add('recipe');
            recipeEl.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <div class="recipe-content">
                    <h2 class="recipe-title">${recipe.title}</h2>
                    <button class="details-button" data-id="${recipe.id}">View Details</button>
                    <div class="recipe-instructions" id="instructions-${recipe.id}"></div>
                </div>
            `;
            recipesContainer.appendChild(recipeEl);
        });

        document.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', fetchRecipeDetails);
        });
    }

    async function fetchRecipeDetails(event) {
        const id = event.target.dataset.id;
        const instructionsEl = document.getElementById(`instructions-${id}`);
        if (instructionsEl.classList.contains('show')) {
            instructionsEl.classList.remove('show');
            instructionsEl.innerHTML = '';
        } else {
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
            const data = await response.json();
            instructionsEl.innerHTML = `
                <h3>Ingredients:</h3>
                <ul>
                    ${data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                </ul>
                <h3>Instructions:</h3>
                <p>${data.instructions}</p>
            `;
            instructionsEl.classList.add('show');
        }
    }
});
