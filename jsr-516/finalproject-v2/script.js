// variables
const apiKey = `42c14e22346849658899cae26d704ef6`;
const searchBtn = document.getElementById('searchBtn');
const ingredientInput = document.getElementById('ingredientInput');
const recipeList = document.getElementById('recipeList');

searchBtn.addEventListener('click', searchRecipes);

async function searchRecipes() {
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) return;

  try {
    const recipes = await getRecipesByIngredients(ingredients);
    if (recipes.length === 0) {
      recipeList.innerHTML = '<p>No recipes found.</p>';
      return;
    }
    const recipeDetails = await Promise.all(recipes.map(recipe => getRecipeDetails(recipe.id)));
    displayRecipes(recipeDetails);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeList.innerHTML = '<p>Oops! Something went wrong while fetching recipes.</p>';
  }
}

async function getRecipesByIngredients(ingredients) {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=2&apiKey=${apiKey}`, {
      params: {
        apiKey: apiKey,
        ingredients: ingredients
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    throw error;
  }
}

async function getRecipeDetails(recipeId) {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
      params: {
        apiKey: apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
}

function displayRecipes(recipes) {
  const recipesHTML = recipes.map(recipe => `
    <div>
      <h2>${recipe.title}</h2>
      <a href="${recipe.sourceUrl}" target="_blank">Recipe Source</a>
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>${recipe.summary}</p>
      <h3>Instructions</h3>
      <ol>
        ${recipe.instructions.split('.').filter(item => item.trim() !== '').map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>
  `).join('');

  recipeList.innerHTML = recipesHTML;
}



