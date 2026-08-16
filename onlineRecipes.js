/*
=========================================================
ONLINE RECIPE SEARCH
Weekly Meal Planner

Uses TheMealDB's free V1 API.

The app:
1. Takes ingredients from the user's fridge.
2. Searches each ingredient separately.
3. Combines the results.
4. Scores recipes based on how many fridge ingredients
   they contain.
5. Loads full recipe details for the best matches.
=========================================================
*/


const THE_MEAL_DB_BASE =
  "https://www.themealdb.com/api/json/v1/1";


/*
=========================================================
COMMON INGREDIENT ALIASES

This helps translate normal user language into the
ingredient names commonly used by recipe databases.
=========================================================
*/

const ingredientAliases = {

  mushrooms: "mushroom",

  mushroom: "mushroom",

  chicken: "chicken_breast",

  "chicken breast": "chicken_breast",

  chickens: "chicken",

  rice: "rice",

  spinach: "spinach",

  broccoli: "broccoli",

  potatoes: "potatoes",

  potato: "potatoes",

  tomatoes: "tomatoes",

  tomato: "tomatoes",

  onions: "onion",

  onion: "onion",

  carrots: "carrots",

  carrot: "carrots",

  peppers: "pepper",

  pepper: "pepper",

  "bell peppers": "pepper",

  salmon: "salmon",

  tuna: "tuna",

  beef: "beef",

  steak: "beef",

  pork: "pork",

  bacon: "bacon",

  shrimp: "shrimp",

  prawns: "prawns",

  eggs: "egg",

  egg: "egg",

  "greek yogurt": "greek_yogurt",

  yogurt: "yogurt",

  yoghurt: "yoghurt",

  "sweet potato": "sweet_potato",

  "sweet potatoes": "sweet_potato",

  avocado: "avocado",

  avocados: "avocado",

  zucchini: "courgette",

  courgette: "courgette",

  asparagus: "asparagus",

  cauliflower: "cauliflower",

  beans: "beans",

  "black beans": "black_beans",

  chickpeas: "chickpeas",

  lentils: "lentils",

  quinoa: "quinoa",

  pasta: "pasta",

  noodles: "noodles",

  cheese: "cheese",

  cheddar: "cheddar_cheese",

  mozzarella: "mozzarella",

  "peanut butter": "peanut_butter",

  apples: "apple",

  apple: "apple",

  bananas: "banana",

  banana: "banana",

  strawberries: "strawberries",

  blueberries: "blueberries",

  mango: "mango",

  pineapple: "pineapple",

  lemon: "lemon",

  lemons: "lemon",

  lime: "lime",

  garlic: "garlic",

  ginger: "ginger",

  "olive oil": "olive_oil",

  bread: "bread",

  tortillas: "tortillas",

  oats: "oats"

};


/*
=========================================================
NORMALIZE USER INGREDIENT
=========================================================
*/

function normalizeOnlineIngredient(
  ingredient
) {

  let value =
    String(ingredient || "")
      .trim()
      .toLowerCase();


  value =
    value
      .replace(/\s+/g, " ")
      .trim();


  if (!value) {
    return "";
  }


  if (
    ingredientAliases[value]
  ) {

    return ingredientAliases[
      value
    ];

  }


  /*
   * Remove simple plural endings.
   */

  if (
    value.endsWith("ies")
  ) {

    value =
      value.slice(
        0,
        -3
      ) + "y";

  }

  else if (
    value.endsWith("es")
  ) {

    value =
      value.slice(
        0,
        -2
      );

  }

  else if (
    value.endsWith("s")
  ) {

    value =
      value.slice(
        0,
        -1
      );

  }


  return value
    .replace(/\s+/g, "_");

}


/*
=========================================================
SEARCH ONE INGREDIENT
=========================================================
*/

async function searchOnlineIngredient(
  ingredient
) {

  const normalized =
    normalizeOnlineIngredient(
      ingredient
    );


  if (!normalized) {
    return [];
  }


  const url =
    `${THE_MEAL_DB_BASE}/filter.php?i=${encodeURIComponent(normalized)}`;


  try {

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Recipe search failed: ${response.status}`
      );

    }


    const data =
      await response.json();


    return data.meals || [];

  }

  catch (error) {

    console.error(
      "Online recipe search error:",
      error
    );


    return [];

  }

}


/*
=========================================================
SEARCH MULTIPLE FRIDGE INGREDIENTS

The free API only allows one ingredient per request.

We therefore perform multiple searches and combine
the results ourselves.
=========================================================
*/

async function searchOnlineRecipes(
  ingredients,
  options = {}
) {

  const cleanIngredients =
    ingredients
      .map(function(item) {

        return String(item || "")
          .trim()
          .toLowerCase();

      })
      .filter(function(item) {

        return item.length > 0;

      });


  if (
    !cleanIngredients.length
  ) {

    return [];

  }


  const uniqueIngredients =
    [
      ...new Set(
        cleanIngredients
      )
    ];


  /*
   * Search all ingredients.
   */

  const searchResults =
    await Promise.all(

      uniqueIngredients.map(
        async function(ingredient) {

          const meals =
            await searchOnlineIngredient(
              ingredient
            );


          return {

            ingredient:
              ingredient,

            meals:
              meals

          };

        }
      )

    );


  /*
   * Combine duplicate recipes.
   */

  const recipeMap =
    new Map();


  searchResults.forEach(
    function(result) {

      result.meals.forEach(
        function(meal) {

          if (
            !recipeMap.has(
              meal.idMeal
            )
          ) {

            recipeMap.set(
              meal.idMeal,
              {

                id:
                  meal.idMeal,

                name:
                  meal.strMeal,

                image:
                  meal.strMealThumb,

                matchedIngredients:
                  [],

                matchCount:
                  0

              }
            );

          }


          const recipe =
            recipeMap.get(
              meal.idMeal
            );


          if (
            !recipe.matchedIngredients.includes(
              result.ingredient
            )
          ) {

            recipe
              .matchedIngredients
              .push(
                result.ingredient
              );

          }


          recipe.matchCount =
            recipe
              .matchedIngredients
              .length;

        }
      );

    }
  );


  let recipes =
    [
      ...recipeMap.values()
    ];


  /*
   * Sort by number of matching fridge
   * ingredients.
   */

  recipes.sort(
    function(a, b) {

      if (
        b.matchCount !==
        a.matchCount
      ) {

        return (
          b.matchCount -
          a.matchCount
        );

      }


      return (
        a.name.localeCompare(
          b.name
        )
      );

    }
  );


  /*
   * Limit how many full recipes we
   * download.
   */

  const maxResults =
    options.maxResults || 12;


  recipes =
    recipes.slice(
      0,
      maxResults
    );


  /*
   * Download complete recipe details.
   */

  const detailedRecipes =
    await Promise.all(

      recipes.map(
        async function(recipe) {

          return await getOnlineRecipeDetails(
            recipe.id,
            recipe
          );

        }
      )

    );


  return detailedRecipes
    .filter(function(recipe) {

      return recipe !== null;

    });

}


/*
=========================================================
GET FULL RECIPE DETAILS
=========================================================
*/

async function getOnlineRecipeDetails(
  mealId,
  existingData = {}
) {

  const url =
    `${THE_MEAL_DB_BASE}/lookup.php?i=${encodeURIComponent(mealId)}`;


  try {

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Recipe lookup failed: ${response.status}`
      );

    }


    const data =
      await response.json();


    if (
      !data.meals ||
      !data.meals.length
    ) {

      return null;

    }


    const meal =
      data.meals[0];


    /*
     * Build ingredient list.
     */

    const ingredients = [];


    for (
      let i = 1;
      i <= 20;
      i++
    ) {

      const ingredient =
        meal[
          `strIngredient${i}`
        ];


      const measure =
        meal[
          `strMeasure${i}`
        ];


      if (
        ingredient &&
        ingredient.trim()
      ) {

        ingredients.push({

          name:
            ingredient.trim(),

          amount:
            measure
              ? measure.trim()
              : ""

        });

      }

    }


    /*
     * Build a searchable ingredient string.
     */

    const ingredientText =
      ingredients
        .map(function(item) {

          return item.name
            .toLowerCase();

        })
        .join(" ");


    /*
     * Calculate how many of the user's
     * ingredients appear in the actual
     * recipe.
     */

    const matchedIngredients =
      (
        existingData
          .matchedIngredients || []
      ).filter(
        function(userIngredient) {

          const normalized =
            normalizeOnlineIngredient(
              userIngredient
            );


          const readable =
            normalized
              .replace(/_/g, " ")
              .toLowerCase();


          return (
            ingredientText.includes(
              readable
            ) ||
            meal.strMeal
              .toLowerCase()
              .includes(
                readable
              )
          );

        }
      );


    return {

      id:
        meal.idMeal,

      name:
        meal.strMeal,

      type:
        "Online Recipe",

      category:
        meal.strCategory || "",

      area:
        meal.strArea || "",

      image:
        meal.strMealThumb || "",

      source:
        meal.strSource || "",

      youtube:
        meal.strYoutube || "",

      description:
        meal.strTags
          ? meal.strTags
          : "",

      ingredients:
        ingredients,

      instructions:
        meal.strInstructions
          ? meal.strInstructions
          : "",

      matchedIngredients:
        matchedIngredients,

      matchCount:
        matchedIngredients.length,

      online:
        true

    };

  }

  catch (error) {

    console.error(
      "Recipe detail error:",
      error
    );


    return null;

  }

}


/*
=========================================================
CONVERT ONLINE RECIPE INTO THE FORMAT USED BY OUR APP
=========================================================
*/

function convertOnlineRecipeForApp(
  onlineRecipe
) {

  if (
    !onlineRecipe
  ) {

    return null;

  }


  /*
   * TheMealDB doesn't consistently provide
   * calories or protein for every recipe.
   *
   * We therefore leave these as unknown
   * rather than inventing nutritional data.
   */

  return {

    id:
      `online-${onlineRecipe.id}`,

    name:
      onlineRecipe.name,

    type:
      onlineRecipe.category ||
      "Recipe",

    calories:
      null,

    protein:
      null,

    difficulty:
      "unknown",

    tags: [

      "online",

      onlineRecipe.category
        ? onlineRecipe.category
            .toLowerCase()
        : "",

      ...(
        onlineRecipe
          .matchedIngredients || []
      ).map(function(item) {

        return item
          .toLowerCase();

      })

    ].filter(Boolean),

    ingredients:
      onlineRecipe.ingredients
        .map(function(item) {

          return item.amount
            ? `${item.amount} ${item.name}`
            : item.name;

        }),

    instructions:
      onlineRecipe.instructions
        .split(/\r?\n/)
        .map(function(step) {

          return step.trim();

        })
        .filter(function(step) {

          return step.length > 0;

        }),

    description:
      onlineRecipe.description ||
      "Recipe found online through TheMealDB.",

    image:
      onlineRecipe.image,

    source:
      onlineRecipe.source,

    youtube:
      onlineRecipe.youtube,

    matchedIngredients:
      onlineRecipe.matchedIngredients ||
      [],

    matchCount:
      onlineRecipe.matchCount || 0,

    online:
      true

  };

}


/*
=========================================================
PUBLIC API
=========================================================
*/

window.onlineRecipeSearch = {

  search:
    searchOnlineRecipes,

  getDetails:
    getOnlineRecipeDetails,

  convert:
    convertOnlineRecipeForApp,

  normalizeIngredient:
    normalizeOnlineIngredient

};


console.log(
  "Online recipe search loaded."
);
