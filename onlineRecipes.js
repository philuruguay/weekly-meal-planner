/*
=========================================================
ONLINE RECIPE SEARCH
FREE THEMEALDB VERSION

Searches multiple ingredient variations, downloads the
actual recipe ingredients, and scores recipes based on
how many ingredients from the user's fridge they contain.
=========================================================
*/

const THE_MEAL_DB_BASE =
  "https://www.themealdb.com/api/json/v1/1";


/*
=========================================================
INGREDIENT GROUPS
=========================================================
*/

const ingredientGroups = {

  chicken: [
    "chicken",
    "chicken breast",
    "chicken breasts",
    "chicken thigh",
    "chicken thighs",
    "chicken fillet",
    "chicken fillets"
  ],

  mushroom: [
    "mushroom",
    "mushrooms",
    "button mushroom",
    "button mushrooms",
    "chestnut mushroom",
    "chestnut mushrooms",
    "portobello mushroom",
    "portobello mushrooms"
  ],

  rice: [
    "rice",
    "basmati rice",
    "brown rice",
    "white rice",
    "long grain rice",
    "jasmine rice"
  ],

  broccoli: [
    "broccoli"
  ],

  spinach: [
    "spinach",
    "baby spinach"
  ],

  potato: [
    "potato",
    "potatoes",
    "baby potato",
    "baby potatoes"
  ],

  sweet_potato: [
    "sweet potato",
    "sweet potatoes"
  ],

  tomato: [
    "tomato",
    "tomatoes",
    "cherry tomato",
    "cherry tomatoes"
  ],

  onion: [
    "onion",
    "onions",
    "red onion",
    "red onions",
    "spring onion",
    "green onion"
  ],

  carrot: [
    "carrot",
    "carrots"
  ],

  pepper: [
    "pepper",
    "peppers",
    "bell pepper",
    "bell peppers",
    "red pepper",
    "red peppers",
    "green pepper",
    "green peppers"
  ],

  salmon: [
    "salmon",
    "salmon fillet",
    "salmon fillets"
  ],

  tuna: [
    "tuna",
    "tuna steak",
    "canned tuna"
  ],

  beef: [
    "beef",
    "steak",
    "beef steak",
    "ground beef",
    "beef mince"
  ],

  turkey: [
    "turkey",
    "turkey breast",
    "ground turkey",
    "turkey mince"
  ],

  pork: [
    "pork",
    "pork chop",
    "pork chops",
    "pork loin",
    "pork tenderloin"
  ],

  bacon: [
    "bacon"
  ],

  shrimp: [
    "shrimp",
    "prawn",
    "prawns"
  ],

  egg: [
    "egg",
    "eggs"
  ],

  yogurt: [
    "yogurt",
    "yoghurt",
    "greek yogurt",
    "greek yoghurt"
  ],

  cheese: [
    "cheese",
    "cheddar",
    "cheddar cheese",
    "mozzarella",
    "parmesan",
    "feta"
  ],

  avocado: [
    "avocado",
    "avocados"
  ],

  zucchini: [
    "zucchini",
    "courgette",
    "courgettes"
  ],

  asparagus: [
    "asparagus"
  ],

  cauliflower: [
    "cauliflower"
  ],

  beans: [
    "bean",
    "beans",
    "green beans",
    "black beans",
    "kidney beans"
  ],

  chickpeas: [
    "chickpea",
    "chickpeas",
    "garbanzo beans"
  ],

  lentils: [
    "lentil",
    "lentils"
  ],

  quinoa: [
    "quinoa"
  ],

  pasta: [
    "pasta",
    "spaghetti",
    "penne",
    "macaroni",
    "linguine",
    "fettuccine",
    "noodles"
  ],

  oats: [
    "oat",
    "oats",
    "rolled oats",
    "porridge oats"
  ],

  bread: [
    "bread",
    "wholemeal bread",
    "whole wheat bread",
    "white bread"
  ],

  apple: [
    "apple",
    "apples"
  ],

  banana: [
    "banana",
    "bananas"
  ],

  strawberry: [
    "strawberry",
    "strawberries"
  ],

  blueberry: [
    "blueberry",
    "blueberries"
  ],

  mango: [
    "mango",
    "mangoes"
  ],

  pineapple: [
    "pineapple",
    "pineapples"
  ],

  lemon: [
    "lemon",
    "lemons"
  ],

  lime: [
    "lime",
    "limes"
  ],

  garlic: [
    "garlic",
    "garlic cloves"
  ],

  ginger: [
    "ginger",
    "fresh ginger"
  ]

};


/*
=========================================================
NORMALIZE TEXT
=========================================================
*/

function normalizeText(value) {

  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}


/*
=========================================================
CANONICAL INGREDIENT

Turns:

mushrooms → mushroom
chicken breast → chicken
brown rice → rice
=========================================================
*/

function getCanonicalIngredient(value) {

  const text =
    normalizeText(value);

  if (!text) {
    return "";
  }

  const groups =
    Object.keys(ingredientGroups);

  for (const group of groups) {

    const aliases =
      ingredientGroups[group];

    for (const alias of aliases) {

      const normalizedAlias =
        normalizeText(alias);

      if (
        text === normalizedAlias ||
        text.includes(normalizedAlias)
      ) {

        return group;

      }

    }

  }

  return text
    .replace(/ies$/, "y")
    .replace(/s$/, "");

}


/*
=========================================================
SEARCH TERMS

IMPORTANT:
For some ingredients we search both singular and plural.
=========================================================
*/

const searchTerms = {

  chicken: [
    "chicken"
  ],

  mushroom: [
    "mushroom",
    "mushrooms"
  ],

  rice: [
    "rice"
  ],

  broccoli: [
    "broccoli"
  ],

  spinach: [
    "spinach"
  ],

  potato: [
    "potato",
    "potatoes"
  ],

  sweet_potato: [
    "sweet potato"
  ],

  tomato: [
    "tomato",
    "tomatoes"
  ],

  onion: [
    "onion"
  ],

  carrot: [
    "carrot"
  ],

  pepper: [
    "pepper"
  ],

  salmon: [
    "salmon"
  ],

  tuna: [
    "tuna"
  ],

  beef: [
    "beef"
  ],

  turkey: [
    "turkey"
  ],

  pork: [
    "pork"
  ],

  bacon: [
    "bacon"
  ],

  shrimp: [
    "shrimp",
    "prawns"
  ],

  egg: [
    "egg"
  ],

  yogurt: [
    "yogurt"
  ],

  cheese: [
    "cheese"
  ],

  avocado: [
    "avocado"
  ],

  zucchini: [
    "zucchini",
    "courgette"
  ],

  asparagus: [
    "asparagus"
  ],

  cauliflower: [
    "cauliflower"
  ],

  beans: [
    "beans"
  ],

  chickpeas: [
    "chickpeas"
  ],

  lentils: [
    "lentils"
  ],

  quinoa: [
    "quinoa"
  ],

  pasta: [
    "pasta"
  ],

  oats: [
    "oats"
  ],

  bread: [
    "bread"
  ],

  apple: [
    "apple"
  ],

  banana: [
    "banana"
  ],

  strawberry: [
    "strawberry",
    "strawberries"
  ],

  blueberry: [
    "blueberry",
    "blueberries"
  ],

  mango: [
    "mango"
  ],

  pineapple: [
    "pineapple"
  ],

  lemon: [
    "lemon"
  ],

  lime: [
    "lime"
  ],

  garlic: [
    "garlic"
  ],

  ginger: [
    "ginger"
  ]

};


/*
=========================================================
SEARCH THEMEALDB
=========================================================
*/

async function searchMealDB(term) {

  const url =
    `${THE_MEAL_DB_BASE}/filter.php?i=${encodeURIComponent(term)}`;

  try {

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }

    const data =
      await response.json();

    return data.meals || [];

  }

  catch (error) {

    console.error(
      "TheMealDB search failed:",
      term,
      error
    );

    return [];

  }

}


/*
=========================================================
SEARCH ALL VARIATIONS OF ONE INGREDIENT
=========================================================
*/

async function searchIngredientGroup(
  canonical
) {

  const terms =
    searchTerms[canonical] || [
      canonical
    ];

  const results =
    await Promise.all(
      terms.map(function(term) {

        return searchMealDB(term);

      })
    );

  const combined =
    [];

  const seen =
    new Set();

  results.forEach(function(meals) {

    meals.forEach(function(meal) {

      if (!seen.has(meal.idMeal)) {

        seen.add(meal.idMeal);

        combined.push(meal);

      }

    });

  });

  return combined;

}


/*
=========================================================
GET FULL RECIPE
=========================================================
*/

async function getRecipeDetails(
  mealId
) {

  const url =
    `${THE_MEAL_DB_BASE}/lookup.php?i=${encodeURIComponent(mealId)}`;

  try {

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
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

    const ingredients =
      [];

    for (
      let i = 1;
      i <= 20;
      i++
    ) {

      const ingredient =
        meal[`strIngredient${i}`];

      const measure =
        meal[`strMeasure${i}`];

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

    return {

      id:
        meal.idMeal,

      name:
        meal.strMeal,

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

      tags:
        meal.strTags || "",

      ingredients:
        ingredients,

      instructions:
        meal.strInstructions || ""

    };

  }

  catch (error) {

    console.error(
      "TheMealDB recipe lookup failed:",
      mealId,
      error
    );

    return null;

  }

}


/*
=========================================================
CHECK WHETHER A RECIPE CONTAINS AN INGREDIENT

This is the key part.

Example:

User:
mushrooms

Recipe:
Fresh mushrooms

MATCH ✓

User:
chicken

Recipe:
Chicken breast

MATCH ✓

User:
rice

Recipe:
Brown rice

MATCH ✓
=========================================================
*/

function recipeContainsIngredient(
  recipe,
  canonical
) {

  const aliases =
    ingredientGroups[canonical] || [
      canonical
    ];

  const recipeIngredientText =
    recipe.ingredients
      .map(function(item) {

        return normalizeText(
          item.name
        );

      })
      .join(" ");

  const recipeName =
    normalizeText(
      recipe.name
    );

  const combinedText =
    `${recipeIngredientText} ${recipeName}`;


  for (const alias of aliases) {

    const normalizedAlias =
      normalizeText(alias);

    if (
      combinedText.includes(
        normalizedAlias
      )
    ) {

      return true;

    }

  }

  return false;

}


/*
=========================================================
SCORE RECIPE

Example:

chicken + mushroom + rice

Recipe contains all 3:

3 / 3 ⭐⭐⭐

Recipe contains chicken + mushroom:

2 / 3 ⭐⭐

Recipe contains chicken:

1 / 3 ⭐
=========================================================
*/

function scoreRecipe(
  recipe,
  userIngredients
) {

  const matched =
    [];

  const missing =
    [];

  userIngredients.forEach(
    function(canonical) {

      if (
        recipeContainsIngredient(
          recipe,
          canonical
        )
      ) {

        matched.push(
          canonical
        );

      }

      else {

        missing.push(
          canonical
        );

      }

    }
  );


  return {

    recipe:
      recipe,

    matched:
      matched,

    missing:
      missing,

    matchCount:
      matched.length,

    totalIngredients:
      userIngredients.length,

    score:
      matched.length

  };

}


/*
=========================================================
MAIN SEARCH FUNCTION
=========================================================
*/

async function searchOnlineRecipes(
  ingredients,
  options = {}
) {

  if (
    !ingredients ||
    !ingredients.length
  ) {

    return [];

  }


  /*
   * Convert user's input into canonical
   * ingredients.
   */

  const userIngredients =
    [
      ...new Set(

        ingredients

          .map(function(item) {

            return getCanonicalIngredient(
              item
            );

          })

          .filter(function(item) {

            return item.length > 0;

          })

      )
    ];


  if (
    !userIngredients.length
  ) {

    return [];

  }


  console.log(
    "User fridge ingredients:",
    userIngredients
  );


  /*
   * Search every ingredient.
   */

  const candidateMap =
    new Map();


  for (
    const ingredient of userIngredients
  ) {

    const meals =
      await searchIngredientGroup(
        ingredient
      );


    console.log(
      ingredient,
      "found",
      meals.length,
      "candidate recipes"
    );


    meals.forEach(function(meal) {

      if (
        !candidateMap.has(
          meal.idMeal
        )
      ) {

        candidateMap.set(
          meal.idMeal,
          meal
        );

      }

    });

  }


  let candidates =
    [
      ...candidateMap.values()
    ];


  console.log(
    "Total unique candidates:",
    candidates.length
  );


  /*
   * Download full details.
   *
   * We download more candidates than we
   * eventually display so that a genuine
   * 3/3 recipe has a chance to rise to
   * the top.
   */

  const maxDetails =
    options.maxDetails || 60;


  candidates =
    candidates.slice(
      0,
      maxDetails
    );


  const detailedRecipes =
    [];


  /*
   * Download in small batches.
   */

  const batchSize =
    8;


  for (
    let i = 0;
    i < candidates.length;
    i += batchSize
  ) {

    const batch =
      candidates.slice(
        i,
        i + batchSize
      );


    const details =
      await Promise.all(

        batch.map(function(meal) {

          return getRecipeDetails(
            meal.idMeal
          );

        })

      );


    details.forEach(function(recipe) {

      if (recipe) {

        detailedRecipes.push(
          recipe
        );

      }

    });

  }


  /*
   * Score every recipe using the
   * ACTUAL ingredient list.
   */

  const scored =
    detailedRecipes.map(
      function(recipe) {

        return scoreRecipe(
          recipe,
          userIngredients
        );

      }
    );


  /*
   * Sort:
   *
   * 3/3 first
   * 2/3 second
   * 1/3 third
   *
   * Never put a lower match above
   * a higher match.
   */

  scored.sort(
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


      return a.recipe.name.localeCompare(
        b.recipe.name
      );

    }
  );


  /*
   * Return the best results.
   */

  const maxResults =
    options.maxResults || 12;


  return scored
    .slice(
      0,
      maxResults
    )
    .map(function(item) {

      return {

        id:
          item.recipe.id,

        name:
          item.recipe.name,

        category:
          item.recipe.category,

        area:
          item.recipe.area,

        image:
          item.recipe.image,

        source:
          item.recipe.source,

        youtube:
          item.recipe.youtube,

        description:
          item.recipe.tags,

        ingredients:
          item.recipe.ingredients,

        instructions:
          item.recipe.instructions,

        matchedIngredients:
          item.matched,

        missingIngredients:
          item.missing,

        matchCount:
          item.matchCount,

        totalIngredients:
          item.totalIngredients,

        online:
          true

      };

    });

}


/*
=========================================================
CONVERT TO APP FORMAT
=========================================================
*/

function convertOnlineRecipeForApp(
  recipe
) {

  if (!recipe) {

    return null;

  }


  return {

    id:
      `online-${recipe.id}`,

    name:
      recipe.name,

    type:
      recipe.category ||
      "Online Recipe",

    calories:
      null,

    protein:
      null,

    difficulty:
      "unknown",

    tags: [
      "online",
      recipe.category || ""
    ],

    ingredients:
      recipe.ingredients.map(
        function(item) {

          return item.amount
            ? `${item.amount} ${item.name}`
            : item.name;

        }
      ),

    instructions:
      recipe.instructions
        .split(/\r?\n/)
        .map(function(step) {

          return step.trim();

        })
        .filter(function(step) {

          return step.length > 0;

        }),

    description:
      recipe.description ||
      "Recipe found online through TheMealDB.",

    image:
      recipe.image,

    source:
      recipe.source,

    youtube:
      recipe.youtube,

    matchedIngredients:
      recipe.matchedIngredients || [],

    missingIngredients:
      recipe.missingIngredients || [],

    matchCount:
      recipe.matchCount || 0,

    totalIngredients:
      recipe.totalIngredients || 0,

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

  convert:
    convertOnlineRecipeForApp,

  normalizeIngredient:
    function(value) {

      return getCanonicalIngredient(
        value
      );

    },

  getCanonicalIngredient:
    getCanonicalIngredient

};


console.log(
  "Online recipe search loaded - multi-match scoring enabled."
);
