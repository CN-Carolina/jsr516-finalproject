// variables
const apiKey = '42c14e22346849658899cae26d704ef6';
const searchBtn = document.getElementById('searchBtn');
const ingredientInput = document.getElementById('ingredientInput');
const recipeList = document.getElementById('recipeList');

//search recipe functions

const searchRecipes = async () => {
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) return; //prevents unneccessary API calls when ingredients are not listed//
  const recipes = await getRecipesByIngredients(ingredients);

  if (recipes.length === 0) {
    recipeList.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  const recipeDetails = await Promise.all(recipes.map(recipe => getRecipeDetails(recipe.id)));
  displayRecipes(recipeDetails);
};

//Spoonacular API functions
const getRecipesByIngredients = async (ingredients) => {
  const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=6&apiKey=${apiKey}`);
  return response.data;
};

const getRecipeDetails = async (recipeId) => {
  const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
    params: {
      apiKey: apiKey
    }
  });
  return response.data;
};

//display recipe functions

const displayRecipes = (recipes) => {
  const recipesHTML = recipes.map(recipe => `
    <div class="recipe-card">
      <h2>${recipe.title}</h2>
      
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>This recipe will be ready in ${recipe.readyInMinutes} minutes</p>
      <h3>Full Ingredient List!</h3>
      <ul>
        ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
      </ul>
      <p>Have all of the ingredients? Follow the link to get the full recipe! </p>
      <a href="${recipe.sourceUrl}" target="_blank">Link to Original Recipe</a>
    </div>
  `).join('');

  recipeList.innerHTML = recipesHTML;
};

searchBtn.addEventListener('click', searchRecipes);

