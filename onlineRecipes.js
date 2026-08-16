/* =========================================================
   ONLINE RECIPES
   Free online recipe search using TheMealDB
   Only returns recipes with calorie information
   ========================================================= */

const THE_MEAL_DB_BASE =
  "https://www.themealdb.com/api/json/v1/1";


/* =========================================================
   INGREDIENT ALIASES
   ========================================================= */

const ingredientAliases = {

  mushrooms: [
    "mushroom",
    "mushrooms"
  ],

  mushroom: [
    "mushroom",
    "mushrooms"
  ],

  chicken: [
    "chicken",
    "chicken breast",
    "chicken breasts",
    "chicken thigh",
    "chicken thighs"
  ],

  rice: [
    "rice",
    "basmati rice",
    "brown rice",
    "white rice"
  ],

  tomato: [
    "tomato",
    "tomatoes"
  ],

  tomatoes: [
    "tomato",
    "tomatoes"
  ],

  potato: [
    "potato",
    "potatoes"
  ],

  potatoes: [
    "potato",
    "potatoes"
  ],

  onion: [
    "onion",
    "onions"
  ],

  garlic: [
    "garlic"
  ],

  broccoli: [
    "broccoli"
  ],

  spinach: [
    "spinach"
  ],

  carrot: [
    "carrot",
    "carrots"
  ],

  beef: [
    "beef",
    "ground beef",
    "minced beef"
  ],

  steak: [
    "steak",
    "beef steak"
  ],

  turkey: [
    "turkey",
    "ground turkey"
  ],

  shrimp: [
    "shrimp",
    "prawns"
  ],

  salmon: [
    "salmon"
  ],

  egg: [
    "egg",
    "eggs"
  ],

  eggs: [
    "egg",
    "eggs"
  ],

  cheese: [
    "cheese"
  ],

  mozzarella: [
    "mozzarella",
    "mozzarella cheese"
  ],

  cheddar: [
    "cheddar",
    "cheddar cheese"
  ],

  avocado: [
    "avocado",
    "avocados"
  ],

  cucumber: [
    "cucumber",
    "cucumbers"
  ],

  pepper: [
    "pepper",
    "bell pepper",
    "bell peppers"
  ],

  peppers: [
    "pepper",
    "bell pepper",
    "bell peppers"
  ],

  pasta: [
    "pasta",
    "spaghetti",
    "penne",
    "linguine",
    "macaroni"
  ],

  noodles: [
    "noodles",
    "noodle"
  ],

  bread: [
    "bread"
  ],

  tortilla: [
    "tortilla",
    "tortillas"
  ],

  beans: [
    "bean",
    "beans",
    "kidney beans",
    "black beans",
    "white beans"
  ],

  chickpeas: [
    "chickpea",
    "chickpeas",
    "garbanzo beans"
  ],

  corn: [
    "corn"
  ],

  peas: [
    "pea",
    "peas"
  ],

  lemon: [
    "lemon",
    "lemons"
  ],

  lime: [
    "lime",
    "limes"
  ],

  apple: [
    "apple",
    "apples"
  ],

  banana: [
    "banana",
    "bananas"
  ]

};


/* =========================================================
   NORMALIZE INGREDIENT
   ========================================================= */

function normalizeIngredient(value) {

  let ingredient =
    String(value || "")
      .toLowerCase()
      .trim();

  ingredient =
    ingredient
      .replace(/[(),]/g, " ")
      .replace(/\s+/g, " ")
      .trim();


  if (
    ingredientAliases[ingredient]
  ) {

    return ingredient;

  }


  const singular =
    ingredient.endsWith("s") &&
    !ingredient.endsWith("ss")
      ? ingredient.slice(0, -1)
      : ingredient;


  if (
    ingredientAliases[singular]
  ) {

    return singular;

  }


  return ingredient;

}


/* =========================================================
   INGREDIENT VARIATIONS
   ========================================================= */

function getIngredientVariations(
  ingredient
) {

  const normalized =
    normalizeIngredient(
      ingredient
    );


  if (
    ingredientAliases[normalized]
  ) {

    return [
      ...ingredientAliases[normalized]
    ];

  }


  return [
    normalized
  ];

}


/* =========================================================
   FETCH JSON
   ========================================================= */

async function fetchJSON(
  url
) {

  const response =
    await fetch(url);


  if (!response.ok) {

    throw new Error(
      `Online recipe request failed: ${response.status}`
    );

  }


  return response.json();

}


/* =========================================================
   SEARCH ONE INGREDIENT
   ========================================================= */

async function searchIngredient(
  ingredient
) {

  const variations =
    getIngredientVariations(
      ingredient
    );


  const allMeals = [];


  for (
    const variation of variations
  ) {

    try {

      const data =
        await fetchJSON(
          `${THE_MEAL_DB_BASE}/filter.php?i=${encodeURIComponent(
            variation
          )}`
        );


      if (
        data &&
        Array.isArray(data.meals)
      ) {

        data.meals.forEach(
          function(meal) {

            if (
              !allMeals.some(
                function(existing) {

                  return (
                    existing.idMeal ===
                    meal.idMeal
                  );

                }
              )
            ) {

              allMeals.push(
                meal
              );

            }

          }
        );

      }

    }
    catch (error) {

      console.warn(
        "Ingredient search failed:",
        variation,
        error
      );

    }

  }


  return allMeals;

}


/* =========================================================
   GET FULL RECIPE DETAILS
   ========================================================= */

async function getDetails(
  mealId
) {

  const data =
    await fetchJSON(
      `${THE_MEAL_DB_BASE}/lookup.php?i=${encodeURIComponent(
        mealId
      )}`
    );


  if (
    !data ||
    !Array.isArray(data.meals) ||
    !data.meals.length
  ) {

    return null;

  }


  return data.meals[0];

}


/* =========================================================
   EXTRACT INGREDIENTS
   ========================================================= */

function extractIngredients(
  meal
) {

  const ingredients = [];


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

      const cleanIngredient =
        ingredient.trim();


      const cleanMeasure =
        measure
          ? measure.trim()
          : "";


      ingredients.push(
        cleanMeasure
          ? `${cleanMeasure} ${cleanIngredient}`
          : cleanIngredient
      );

    }

  }


  return ingredients;

}


/* =========================================================
   EXTRACT INGREDIENT NAMES ONLY
   ========================================================= */

function extractIngredientNames(
  meal
) {

  const ingredients = [];


  for (
    let i = 1;
    i <= 20;
    i++
  ) {

    const ingredient =
      meal[`strIngredient${i}`];


    if (
      ingredient &&
      ingredient.trim()
    ) {

      ingredients.push(
        ingredient
          .trim()
          .toLowerCase()
      );

    }

  }


  return ingredients;

}


/* =========================================================
   CALORIE EXTRACTION
   =========================================================

   TheMealDB does not consistently provide calories.

   We therefore look for calorie information in any
   available recipe metadata or text.

   Recipes without a usable calorie number are rejected.
   ========================================================= */

function extractCalories(
  meal
) {

  const possibleFields = [

    meal.calories,

    meal.strCalories,

    meal.Calories,

    meal.strNutrition,

    meal.strNutritionalInformation,

    meal.strNotes

  ];


  for (
    const value of possibleFields
  ) {

    if (
      value === null ||
      value === undefined
    ) {

      continue;

    }


    const text =
      String(value);


    const match =
      text.match(
        /(\d+(?:\.\d+)?)\s*(?:kcal|calories|cal)/i
      );


    if (match) {

      const calories =
        Number(match[1]);


      if (
        Number.isFinite(calories) &&
        calories > 0
      ) {

        return Math.round(
          calories
        );

      }

    }

  }


  return null;

}


/* =========================================================
   CALORIE LOOKUP
   =========================================================

   TheMealDB itself does not reliably expose calorie
   information for every recipe.

   We attempt to find it from the recipe's available
   nutritional fields. No invented calorie values are used.
   ========================================================= */

function hasCalories(
  meal
) {

  const calories =
    extractCalories(
      meal
    );


  return (
    calories !== null &&
    calories > 0
  );

}


/* =========================================================
   MATCH INGREDIENTS
   ========================================================= */

function ingredientMatches(
  fridgeIngredient,
  recipeIngredient
) {

  const fridge =
    normalizeIngredient(
      fridgeIngredient
    );


  const recipe =
    normalizeIngredient(
      recipeIngredient
    );


  const variations =
    getIngredientVariations(
      fridge
    );


  return variations.some(
    function(variation) {

      return (

        recipe === variation

        ||

        recipe.includes(
          variation
        )

        ||

        variation.includes(
          recipe
        )

      );

    }
  );

}


/* =========================================================
   CALCULATE MATCHES
   ========================================================= */

function calculateMatches(
  meal,
  fridgeIngredients
) {

  const recipeIngredients =
    extractIngredientNames(
      meal
    );


  const matchedIngredients = [];


  fridgeIngredients.forEach(
    function(fridgeIngredient) {

      const matched =
        recipeIngredients.some(
          function(recipeIngredient) {

            return ingredientMatches(
              fridgeIngredient,
              recipeIngredient
            );

          }
        );


      if (matched) {

        matchedIngredients.push(
          fridgeIngredient
        );

      }

    }
  );


  return matchedIngredients;

}


/* =========================================================
   CONVERT RECIPE
   ========================================================= */

function convert(
  meal
) {

  if (!meal) {

    return null;

  }


  /*
   * IMPORTANT:
   * Reject recipes without calories.
   */

  const calories =
    extractCalories(
      meal
    );


  if (
    calories === null ||
    calories <= 0
  ) {

    return null;

  }


  const ingredients =
    extractIngredients(
      meal
    );


  const instructions =
    meal.strInstructions
      ? meal.strInstructions
          .split(/\r?\n/)
          .map(function(step) {

            return step.trim();

          })
          .filter(function(step) {

            return step.length > 0;

          })
      : [];


  return {

    id:
      meal.idMeal,

    name:
      meal.strMeal || "Online Recipe",

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

    ingredients:
      ingredients,

    instructions:
      instructions,

    calories:
      calories,

    /*
     * We intentionally do not invent protein.
     */

    protein:
      null,

    difficulty:
      "Online",

    tags:
      [],

    matchCount:
      0,

    matchedIngredients:
      [],

    online:
      true

  };

}


/* =========================================================
   SEARCH RECIPES
   ========================================================= */

async function search(
  fridgeIngredients,
  options = {}
) {

  const maxResults =
    options.maxResults || 48;


  if (
    !Array.isArray(fridgeIngredients) ||
    !fridgeIngredients.length
  ) {

    return [];

  }


  const cleanedIngredients =
    fridgeIngredients
      .map(function(item) {

        return normalizeIngredient(
          item
        );

      })
      .filter(function(item) {

        return item.length > 0;

      });


  /*
   * Remove duplicates.
   */

  const uniqueIngredients =
    [
      ...new Set(
        cleanedIngredients
      )
    ];


  /*
   * Search each ingredient.
   */

  const mealMap =
    new Map();


  for (
    const ingredient
    of uniqueIngredients
  ) {

    const meals =
      await searchIngredient(
        ingredient
      );


    meals.forEach(
      function(meal) {

        if (
          !mealMap.has(
            meal.idMeal
          )
        ) {

          mealMap.set(
            meal.idMeal,
            {
              meal: meal,
              possibleMatches: []
            }
          );

        }


        mealMap
          .get(meal.idMeal)
          .possibleMatches
          .push(
            ingredient
          );

      }
    );

  }


  /*
   * Get complete recipe details.
   */

  const detailResults = [];


  for (
    const entry
    of mealMap.values()
  ) {

    try {

      const details =
        await getDetails(
          entry.meal.idMeal
        );


      if (!details) {

        continue;

      }


      /*
       * IMPORTANT:
       * Only keep recipes with calories.
       */

      if (
        !hasCalories(details)
      ) {

        continue;

      }


      const matchedIngredients =
        calculateMatches(
          details,
          uniqueIngredients
        );


      /*
       * Only keep recipes that actually match
       * at least one fridge ingredient.
       */

      if (
        matchedIngredients.length === 0
      ) {

        continue;

      }


      const converted =
        convert(
          details
        );


      if (!converted) {

        continue;

      }


      converted.matchCount =
        matchedIngredients.length;


      converted.matchedIngredients =
        matchedIngredients;


      detailResults.push(
        converted
      );

    }
    catch (error) {

      console.warn(
        "Could not load recipe details:",
        entry.meal.idMeal,
        error
      );

    }

  }


  /*
   * Sort:
   *
   * 1. Most fridge matches
   * 2. Recipes with more ingredients matching
   * 3. Alphabetically
   */

  detailResults.sort(
    function(a,b) {

      if (
        b.matchCount !==
        a.matchCount
      ) {

        return (
          b.matchCount -
          a.matchCount
        );

      }


      return a.name.localeCompare(
        b.name
      );

    }
  );


  /*
   * Remove duplicates by recipe ID.
   */

  const uniqueResults = [];

  const seen = new Set();


  detailResults.forEach(
    function(recipe) {

      if (
        seen.has(recipe.id)
      ) {

        return;

      }


      seen.add(
        recipe.id
      );


      uniqueResults.push(
        recipe
      );

    }
  );


  return uniqueResults.slice(
    0,
    maxResults
  );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.onlineRecipeSearch = {

  search:
    search,

  getDetails:
    getDetails,

  convert:
    convert,

  normalizeIngredient:
    normalizeIngredient

};
