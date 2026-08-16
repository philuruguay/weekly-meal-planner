/* =========================================================
   ONLINE RECIPES
   Recipe search through Cloudflare Worker
   Only returns recipes with calorie information
   ========================================================= */

const RECIPE_WORKER_BASE =
  "https://floral-sun-d01a.philuruguay29.workers.dev";


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

  onions: [
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

  carrots: [
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
      `Recipe request failed: ${response.status}`
    );

  }


  return response.json();

}


/* =========================================================
   NORMALIZE RECIPE INGREDIENTS
   ========================================================= */

function normalizeRecipeIngredients(
  recipe
) {

  if (
    Array.isArray(recipe.ingredients)
  ) {

    return recipe.ingredients
      .map(function(item) {

        if (
          typeof item === "string"
        ) {

          return item;

        }

        if (
          item &&
          typeof item === "object"
        ) {

          const name =
            item.name ||
            item.ingredient ||
            item.item ||
            "";

          const measure =
            item.measure ||
            item.amount ||
            "";

          if (measure && name) {
            return `${measure} ${name}`;
          }

          return name;

        }

        return "";

      })
      .filter(function(item) {

        return String(item).trim().length > 0;

      });

  }


  const result = [];


  for (
    let i = 1;
    i <= 20;
    i++
  ) {

    const ingredient =
      recipe[`strIngredient${i}`];

    const measure =
      recipe[`strMeasure${i}`];


    if (
      ingredient &&
      String(ingredient).trim()
    ) {

      const cleanIngredient =
        String(ingredient).trim();

      const cleanMeasure =
        measure
          ? String(measure).trim()
          : "";


      result.push(
        cleanMeasure
          ? `${cleanMeasure} ${cleanIngredient}`
          : cleanIngredient
      );

    }

  }


  return result;

}


/* =========================================================
   INGREDIENT NAMES
   ========================================================= */

function extractIngredientNames(
  recipe
) {

  return normalizeRecipeIngredients(
    recipe
  )
    .map(function(item) {

      return item
        .replace(
          /^\s*[\d./¼½¾⅓⅔⅛]+\s*(?:cups?|tbsp|tsp|tablespoons?|teaspoons?|oz|ounces?|lb|lbs|pounds?|g|grams?|kg|ml|cl)\s*/i,
          ""
        )
        .trim()
        .toLowerCase();

    });

}


/* =========================================================
   EXTRACT CALORIES
   ========================================================= */

function extractCalories(
  recipe
) {

  const possibleValues = [

    recipe.calories,

    recipe.Calories,

    recipe.strCalories,

    recipe.kcal,

    recipe.nutrition &&
      recipe.nutrition.calories,

    recipe.nutrition &&
      recipe.nutrition.kcal

  ];


  for (
    const value of possibleValues
  ) {

    if (
      value === null ||
      value === undefined
    ) {

      continue;

    }


    if (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    ) {

      return Math.round(value);

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


    const numeric =
      Number(text);


    if (
      Number.isFinite(numeric) &&
      numeric > 0
    ) {

      return Math.round(
        numeric
      );

    }

  }


  return null;

}


/* =========================================================
   HAS CALORIES
   ========================================================= */

function hasCalories(
  recipe
) {

  const calories =
    extractCalories(
      recipe
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
  recipe,
  fridgeIngredients
) {

  const recipeIngredients =
    extractIngredientNames(
      recipe
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
  recipe
) {

  if (!recipe) {

    return null;

  }


  /*
   * The Cloudflare Worker already returns
   * normalized recipe objects.
   */

  const calories =
    extractCalories(
      recipe
    );


  /*
   * Never show a recipe without
   * a calorie count.
   */

  if (
    calories === null ||
    calories <= 0
  ) {

    return null;

  }


  const ingredients =
    normalizeRecipeIngredients(
      recipe
    );


  let instructions = [];


  if (
    Array.isArray(
      recipe.instructions
    )
  ) {

    instructions =
      recipe.instructions
        .map(function(step) {

          return String(step)
            .trim();

        })
        .filter(function(step) {

          return step.length > 0;

        });

  }
  else if (
    typeof recipe.instructions ===
    "string"
  ) {

    instructions =
      recipe.instructions
        .split(/\r?\n/)
        .map(function(step) {

          return step.trim();

        })
        .filter(function(step) {

          return step.length > 0;

        });

  }
  else if (
    recipe.strInstructions
  ) {

    instructions =
      String(
        recipe.strInstructions
      )
        .split(/\r?\n/)
        .map(function(step) {

          return step.trim();

        })
        .filter(function(step) {

          return step.length > 0;

        });

  }


  let matchedIngredients =
    Array.isArray(
      recipe.matchedIngredients
    )
      ? recipe.matchedIngredients
      : [];


  if (
    !matchedIngredients.length
  ) {

    matchedIngredients =
      calculateMatches(
        recipe,
        window.__currentRecipeFridgeIngredients || []
      );

  }


  const matchCount =
    Number(
      recipe.matchCount
    ) ||
    matchedIngredients.length;


  const id =
    recipe.id ||
    recipe.idMeal ||
    recipe.recipeId ||
    recipe.uuid ||
    "";


  const name =
    recipe.name ||
    recipe.title ||
    recipe.strMeal ||
    "Online Recipe";


  const image =
    recipe.image ||
    recipe.imageUrl ||
    recipe.thumbnail ||
    recipe.strMealThumb ||
    "";


  const source =
    recipe.source ||
    recipe.sourceUrl ||
    recipe.url ||
    recipe.strSource ||
    "";


  const youtube =
    recipe.youtube ||
    recipe.youtubeUrl ||
    recipe.video ||
    recipe.strYoutube ||
    "";


  const category =
    recipe.category ||
    recipe.type ||
    recipe.strCategory ||
    "";


  const area =
    recipe.area ||
    recipe.cuisine ||
    recipe.strArea ||
    "";


  const protein =
    recipe.protein !== undefined &&
    recipe.protein !== null
      ? recipe.protein
      : (
          recipe.nutrition &&
          recipe.nutrition.protein !== undefined
            ? recipe.nutrition.protein
            : null
        );


  return {

    id:

      id,

    name:

      name,

    category:

      category,

    area:

      area,

    image:

      image,

    source:

      source,

    youtube:

      youtube,

    ingredients:

      ingredients,

    instructions:

      instructions,

    calories:

      calories,

    protein:

      protein,

    difficulty:

      "Online",

    tags:

      Array.isArray(recipe.tags)
        ? recipe.tags
        : [],

    matchCount:

      matchCount,

    matchedIngredients:

      matchedIngredients,

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
    !Array.isArray(
      fridgeIngredients
    ) ||
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


  const uniqueIngredients =
    [
      ...new Set(
        cleanedIngredients
      )
    ];


  if (
    !uniqueIngredients.length
  ) {

    return [];

  }


  /*
   * Give the Worker the ingredients
   * in one request.
   */

  const ingredientsParam =
    uniqueIngredients.join(",");


  const url =
    `${RECIPE_WORKER_BASE}/search?ingredients=${encodeURIComponent(
      ingredientsParam
    )}`;


  const data =
    await fetchJSON(
      url
    );


  if (
    !data ||
    !Array.isArray(
      data.recipes
    )
  ) {

    return [];

  }


  /*
   * Make the fridge ingredients available
   * to convert() for match calculation.
   */

  window.__currentRecipeFridgeIngredients =
    uniqueIngredients;


  const results =
    data.recipes

      .map(function(recipe) {

        return convert(
          recipe
        );

      })

      .filter(function(recipe) {

        return recipe !== null;

      });


  /*
   * Make sure match information exists
   * even if the Worker did not provide it.
   */

  results.forEach(
    function(recipe) {

      if (
        !Array.isArray(
          recipe.matchedIngredients
        ) ||
        !recipe.matchedIngredients.length
      ) {

        recipe.matchedIngredients =
          calculateMatches(
            recipe,
            uniqueIngredients
          );

      }


      recipe.matchCount =
        Number(
          recipe.matchCount
        ) ||
        recipe.matchedIngredients.length;

    }
  );


  /*
   * Sort strongest matches first.
   */

  results.sort(
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


      return a.name.localeCompare(
        b.name
      );

    }
  );


  /*
   * Remove duplicate recipes.
   */

  const uniqueResults = [];

  const seen = new Set();


  results.forEach(
    function(recipe) {

      const key =
        String(
          recipe.id ||
          recipe.name
        );


      if (
        seen.has(key)
      ) {

        return;

      }


      seen.add(key);

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
   GET DETAILS
   ========================================================= */

async function getDetails(
  recipeId
) {

  /*
   * The Worker already returns the
   * complete recipe information used
   * by the planner.
   *
   * Search the current results first.
   */

  const cached =
    window.__onlineRecipeCache || [];


  const found =
    cached.find(
      function(recipe) {

        return String(
          recipe.id
        ) === String(
          recipeId
        );

      }
    );


  if (found) {

    return found;

  }


  return null;

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
