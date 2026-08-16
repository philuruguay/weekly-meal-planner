/*
=========================================================
ONLINE RECIPE SEARCH
FREE THEMEALDB VERSION

- Searches each fridge ingredient
- Combines all candidate recipes
- Prioritizes multi-ingredient matches
- Downloads full recipe details
- Scores actual ingredient matches
- Returns up to 48 recipes
- index.html displays 12 at a time
=========================================================
*/

const THE_MEAL_DB_BASE =
  "https://www.themealdb.com/api/json/v1/1";


/* ========================================================
   INGREDIENT GROUPS
   ======================================================== */

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
    "white onion",
    "yellow onion",
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
    "green peppers",
    "yellow pepper",
    "yellow peppers"
  ],

  salmon: [
    "salmon",
    "salmon fillet",
    "salmon fillets"
  ],

  tuna: [
    "tuna",
    "tuna steak",
    "tuna steaks",
    "canned tuna"
  ],

  beef: [
    "beef",
    "beef steak",
    "steak",
    "steaks",
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
    "prawns",
    "king prawns"
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


/* ========================================================
   SEARCH TERMS
   ======================================================== */

const searchTerms = {

  chicken: ["chicken"],

  mushroom: ["mushroom", "mushrooms"],

  rice: ["rice"],

  broccoli: ["broccoli"],

  spinach: ["spinach"],

  potato: ["potato", "potatoes"],

  sweet_potato: ["sweet potato"],

  tomato: ["tomato", "tomatoes"],

  onion: ["onion"],

  carrot: ["carrot"],

  pepper: ["pepper"],

  salmon: ["salmon"],

  tuna: ["tuna"],

  beef: ["beef"],

  turkey: ["turkey"],

  pork: ["pork"],

  bacon: ["bacon"],

  shrimp: ["shrimp", "prawns"],

  egg: ["egg"],

  yogurt: ["yogurt"],

  cheese: ["cheese"],

  avocado: ["avocado"],

  zucchini: ["zucchini", "courgette"],

  asparagus: ["asparagus"],

  cauliflower: ["cauliflower"],

  beans: ["beans"],

  chickpeas: ["chickpeas"],

  lentils: ["lentils"],

  quinoa: ["quinoa"],

  pasta: ["pasta"],

  oats: ["oats"],

  bread: ["bread"],

  apple: ["apple"],

  banana: ["banana"],

  strawberry: ["strawberry", "strawberries"],

  blueberry: ["blueberry", "blueberries"],

  mango: ["mango"],

  pineapple: ["pineapple"],

  lemon: ["lemon"],

  lime: ["lime"],

  garlic: ["garlic"],

  ginger: ["ginger"]

};


/* ========================================================
   NORMALIZE TEXT
   ======================================================== */

function normalizeText(value) {

  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}


/* ========================================================
   GET CANONICAL INGREDIENT
   ======================================================== */

function getCanonicalIngredient(value) {

  const text =
    normalizeText(value);

  if (!text) {

    return "";

  }

  const groups =
    Object.keys(
      ingredientGroups
    );

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


/* ========================================================
   SEARCH THEMEALDB
   ======================================================== */

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


/* ========================================================
   SEARCH ALL TERMS FOR ONE INGREDIENT
   ======================================================== */

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


  const meals =
    [];

  const seen =
    new Set();


  results.forEach(function(list) {

    list.forEach(function(meal) {

      if (
        !seen.has(
          meal.idMeal
        )
      ) {

        seen.add(
          meal.idMeal
        );

        meals.push(
          meal
        );

      }

    });

  });


  return meals;

}


/* ========================================================
   GET FULL RECIPE DETAILS
   ======================================================== */

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


    return {

      id:
        meal.idMeal,

      name:
        meal.strMeal || "",

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
      "Recipe detail lookup failed:",
      mealId,
      error
    );

    return null;

  }

}


/* ========================================================
   CHECK RECIPE FOR INGREDIENT
   ======================================================== */

function recipeContainsIngredient(
  recipe,
  canonical
) {

  const aliases =
    ingredientGroups[canonical] || [
      canonical
    ];


  const recipeIngredients =
    recipe.ingredients.map(
      function(item) {

        return normalizeText(
          item.name
        );

      }
    );


  for (
    const ingredientName
    of recipeIngredients
  ) {

    for (
      const alias
      of aliases
    ) {

      const normalizedAlias =
        normalizeText(
          alias
        );


      if (
        ingredientName ===
        normalizedAlias
      ) {

        return true;

      }


      if (
        ingredientName.includes(
          normalizedAlias
        )
      ) {

        return true;

      }


      if (
        normalizedAlias.includes(
          ingredientName
        )
      ) {

        return true;

      }

    }

  }


  return false;

}


/* ========================================================
   SCORE RECIPE
   ======================================================== */

function scoreRecipe(
  recipe,
  userIngredients,
  candidateCounts
) {

  const matched =
    [];

  const missing =
    [];


  userIngredients.forEach(
    function(ingredient) {


      if (
        recipeContainsIngredient(
          recipe,
          ingredient
        )
      ) {

        matched.push(
          ingredient
        );

      }

      else {

        missing.push(
          ingredient
        );

      }

    }
  );


  const searchOverlap =
    candidateCounts[
      recipe.id
    ] || 0;


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

    searchOverlap:
      searchOverlap

  };

}


/* ========================================================
   MAIN SEARCH
   ======================================================== */

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
    "Fridge ingredients:",
    userIngredients
  );


  const candidateMap =
    new Map();


  const candidateCounts =
    {};


  /*
   * Search EVERY fridge ingredient
   * before downloading recipe details.
   */

  for (
    const ingredient
    of userIngredients
  ) {

    const meals =
      await searchIngredientGroup(
        ingredient
      );


    console.log(
      "Search:",
      ingredient,
      "returned",
      meals.length,
      "recipes"
    );


    meals.forEach(function(meal) {

      const id =
        meal.idMeal;


      if (
        !candidateMap.has(id)
      ) {

        candidateMap.set(
          id,
          meal
        );

      }


      candidateCounts[id] =
        (
          candidateCounts[id] || 0
        ) + 1;

    });

  }


  let candidates =
    [
      ...candidateMap.values()
    ];


  /*
   * Recipes appearing in multiple
   * ingredient searches come first.
   */

  candidates.sort(
    function(a, b) {

      const countA =
        candidateCounts[
          a.idMeal
        ] || 0;

      const countB =
        candidateCounts[
          b.idMeal
        ] || 0;


      if (
        countB !== countA
      ) {

        return (
          countB -
          countA
        );

      }


      return a.strMeal.localeCompare(
        b.strMeal
      );

    }
  );


  console.log(
    "Total unique candidates:",
    candidates.length
  );


  /*
   * IMPORTANT:
   *
   * We now inspect up to 100 candidates,
   * rather than stopping at 12.
   */

  const maxDetails =
    options.maxDetails || 100;


  candidates =
    candidates.slice(
      0,
      maxDetails
    );


  const detailedRecipes =
    [];


  /*
   * Download details in batches.
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
   * Score actual ingredients.
   */

  const scored =
    detailedRecipes.map(
      function(recipe) {

        return scoreRecipe(
          recipe,
          userIngredients,
          candidateCounts
        );

      }
    );


  /*
   * Highest number of actual
   * ingredient matches first.
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


      if (
        b.searchOverlap !==
        a.searchOverlap
      ) {

        return (
          b.searchOverlap -
          a.searchOverlap
        );

      }


      return a.recipe.name.localeCompare(
        b.recipe.name
      );

    }
  );


  /*
   * IMPORTANT:
   *
   * Return up to 48 results.
   */

  const maxResults =
    options.maxResults || 48;


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

        searchOverlap:
          item.searchOverlap,

        online:
          true

      };

    });

}


/* ========================================================
   CONVERT FOR APP
   ======================================================== */

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

    searchOverlap:
      recipe.searchOverlap || 0,

    online:
      true

  };

}


/* ========================================================
   PUBLIC API
   ======================================================== */

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
  "Online recipe search loaded - up to 48 results."
);
