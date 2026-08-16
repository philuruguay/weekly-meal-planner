/*
=========================================================
ONLINE RECIPE SEARCH
Weekly Meal Planner

FREE VERSION - TheMealDB

This module:
1. Searches TheMealDB by individual ingredients.
2. Combines all search results.
3. Downloads the full recipe details.
4. Normalizes ingredient names.
5. Correctly counts multiple fridge-ingredient matches.
6. Ranks recipes with the most matches first.
=========================================================
*/


const THE_MEAL_DB_BASE =
  "https://www.themealdb.com/api/json/v1/1";


/*
=========================================================
INGREDIENT ALIASES

Different words can refer to the same ingredient.

Example:
chicken
chicken breast
chicken breasts

should all count as CHICKEN.
=========================================================
*/


const ingredientAliases = {

  chicken: [
    "chicken",
    "chicken breast",
    "chicken breasts",
    "chicken thigh",
    "chicken thighs",
    "chicken leg",
    "chicken legs",
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
    "long grain rice",
    "brown rice",
    "white rice",
    "wild rice",
    "jasmine rice"
  ],

  broccoli: [
    "broccoli",
    "broccoli florets"
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
    "beef mince",
    "ground beef"
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
    "bacon",
    "back bacon",
    "streaky bacon"
  ],

  shrimp: [
    "shrimp",
    "prawn",
    "prawns",
    "king prawns"
  ],

  egg: [
    "egg",
    "eggs",
    "hard boiled egg",
    "hard boiled eggs"
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
    "black beans",
    "kidney beans",
    "green beans"
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

  peanut_butter: [
    "peanut butter"
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
SEARCH TERM MAP

IMPORTANT:

We deliberately search the broad ingredient name.

For example:

chicken → chicken

NOT:

chicken → chicken_breast

This gives us a much larger search pool.
=========================================================
*/


const searchTerms = {

  chicken: "chicken",

  mushroom: "mushroom",

  rice: "rice",

  broccoli: "broccoli",

  spinach: "spinach",

  potato: "potato",

  sweet_potato: "sweet_potato",

  tomato: "tomato",

  onion: "onion",

  carrot: "carrot",

  pepper: "pepper",

  salmon: "salmon",

  tuna: "tuna",

  beef: "beef",

  turkey: "turkey",

  pork: "pork",

  bacon: "bacon",

  shrimp: "shrimp",

  egg: "egg",

  yogurt: "yogurt",

  cheese: "cheese",

  avocado: "avocado",

  zucchini: "zucchini",

  asparagus: "asparagus",

  cauliflower: "cauliflower",

  beans: "beans",

  chickpeas: "chickpeas",

  lentils: "lentils",

  quinoa: "quinoa",

  pasta: "pasta",

  oats: "oats",

  bread: "bread",

  peanut_butter: "peanut_butter",

  apple: "apple",

  banana: "banana",

  strawberry: "strawberry",

  blueberry: "blueberry",

  mango: "mango",

  pineapple: "pineapple",

  lemon: "lemon",

  lime: "lime",

  garlic: "garlic",

  ginger: "ginger"

};


/*
=========================================================
NORMALIZE TEXT
=========================================================
*/


function normalizeText(
  value
) {

  return String(
    value || ""
  )

    .toLowerCase()

    .replace(
      /&/g,
      " and "
    )

    .replace(
      /[^a-z0-9\s]/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim();

}


/*
=========================================================
GET CANONICAL INGREDIENT

Example:

"chicken breast"
→ chicken

"mushrooms"
→ mushroom

"brown rice"
→ rice
=========================================================
*/


function getCanonicalIngredient(
  ingredient
) {

  const normalized =
    normalizeText(
      ingredient
    );


  if (!normalized) {

    return "";

  }


  const aliasKeys =
    Object.keys(
      ingredientAliases
    );


  for (
    let i = 0;
    i < aliasKeys.length;
    i++
  ) {

    const key =
      aliasKeys[i];


    const aliases =
      ingredientAliases[
        key
      ];


    for (
      let j = 0;
      j < aliases.length;
      j++
    ) {

      const alias =
        normalizeText(
          aliases[j]
        );


      if (
        normalized ===
        alias
      ) {

        return key;

      }


      /*
       * Also recognize phrases such as:
       *
       * "diced chicken breast"
       * "fresh mushrooms"
       * "cooked white rice"
       */

      if (
        normalized.includes(
          alias
        )
      ) {

        return key;

      }

    }

  }


  /*
   * Simple fallback for unknown ingredients.
   */

  if (
    normalized.endsWith("ies")
  ) {

    return (
      normalized.slice(
        0,
        -3
      ) + "y"
    );

  }


  if (
    normalized.endsWith("s") &&
    normalized.length > 3
  ) {

    return normalized.slice(
      0,
      -1
    );

  }


  return normalized;

}


/*
=========================================================
NORMALIZE USER INGREDIENT
=========================================================
*/


function normalizeOnlineIngredient(
  ingredient
) {

  const canonical =
    getCanonicalIngredient(
      ingredient
    );


  if (
    searchTerms[
      canonical
    ]
  ) {

    return searchTerms[
      canonical
    ];

  }


  return canonical
    .replace(
      /\s+/g,
      "_"
    );

}


/*
=========================================================
GET USER CANONICAL INGREDIENTS
=========================================================
*/


function getUserCanonicalIngredients(
  ingredients
) {

  return [

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

}


/*
=========================================================
SEARCH ONE INGREDIENT
=========================================================
*/


async function searchOnlineIngredient(
  ingredient
) {

  const canonical =
    getCanonicalIngredient(
      ingredient
    );


  const searchTerm =
    searchTerms[
      canonical
    ] ||
    canonical;


  if (!searchTerm) {

    return [];

  }


  const url =
    `${THE_MEAL_DB_BASE}/filter.php?i=${encodeURIComponent(
      searchTerm
    )}`;


  console.log(
    "Searching TheMealDB for:",
    searchTerm
  );


  try {

    const response =
      await fetch(
        url
      );


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
SEARCH MULTIPLE INGREDIENTS
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


  const cleanIngredients =
    ingredients

      .map(function(item) {

        return String(
          item || ""
        ).trim();

      })

      .filter(function(item) {

        return item.length > 0;

      });


  const userCanonicalIngredients =
    getUserCanonicalIngredients(
      cleanIngredients
    );


  if (
    !userCanonicalIngredients.length
  ) {

    return [];

  }


  /*
   * Search every ingredient separately.
   */

  const searchResults =
    await Promise.all(

      userCanonicalIngredients.map(
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
   * Combine all recipe results.
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

                searchMatches:
                  new Set(),

                searchMatchCount:
                  0

              }

            );

          }


          const recipe =
            recipeMap.get(
              meal.idMeal
            );


          recipe.searchMatches.add(
            result.ingredient
          );


          recipe.searchMatchCount =
            recipe.searchMatches.size;


        }
      );

    }
  );


  let recipes =
    [
      ...recipeMap.values()
    ];


  /*
   * Download enough full recipes
   * to give us a good selection.
   *
   * We download more than the final
   * number because the actual ingredient
   * list may change the match ranking.
   */

  const maxDetails =
    options.maxDetails ||
    40;


  /*
   * First sort by how many searches
   * returned the recipe.
   */

  recipes.sort(
    function(a, b) {

      if (
        b.searchMatchCount !==
        a.searchMatchCount
      ) {

        return (
          b.searchMatchCount -
          a.searchMatchCount
        );

      }


      return a.name.localeCompare(
        b.name
      );

    }
  );


  recipes =
    recipes.slice(
      0,
      maxDetails
    );


  /*
   * Get full recipe details.
   */

  const detailedRecipes =
    await Promise.all(

      recipes.map(
        async function(recipe) {

          return await getOnlineRecipeDetails(
            recipe.id,
            recipe,
            userCanonicalIngredients
          );

        }
      )

    );


  /*
   * Remove failed lookups.
   */

  const validRecipes =
    detailedRecipes.filter(
      function(recipe) {

        return recipe !== null;

      }
    );


  /*
   * Sort AGAIN using the actual
   * ingredient list.
   *
   * This is the important part.
   */

  validRecipes.sort(
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


      /*
       * If both have the same number
       * of matches, prefer recipes where
       * the ingredients appear directly
       * in the recipe rather than only
       * in the search result.
       */

      if (
        b.searchMatchCount !==
        a.searchMatchCount
      ) {

        return (
          b.searchMatchCount -
          a.searchMatchCount
        );

      }


      return a.name.localeCompare(
        b.name
      );

    }
  );


  const maxResults =
    options.maxResults ||
    12;


  return validRecipes.slice(
    0,
    maxResults
  );

}


/*
=========================================================
GET FULL RECIPE DETAILS
=========================================================
*/


async function getOnlineRecipeDetails(

  mealId,

  existingData = {},

  userCanonicalIngredients = []

) {


  const url =
    `${THE_MEAL_DB_BASE}/lookup.php?i=${encodeURIComponent(
      mealId
    )}`;


  try {

    const response =
      await fetch(
        url
      );


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
     * Build complete ingredient list.
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
     * Create one searchable string
     * from the recipe name AND ingredients.
     */

    const recipeText =
      [

        meal.strMeal || "",

        ...ingredients.map(
          function(item) {

            return item.name;

          }
        )

      ]

        .map(function(item) {

          return normalizeText(
            item
          );

        })

        .join(" ");


    /*
     * Find the user's ingredients
     * inside the ACTUAL recipe.
     */

    const matchedIngredients = [];


    userCanonicalIngredients.forEach(
      function(userIngredient) {


        const aliases =
          ingredientAliases[
            userIngredient
          ] || [

            userIngredient

          ];


        let found =
          false;


        aliases.forEach(
          function(alias) {


            if (
              found
            ) {

              return;

            }


            const normalizedAlias =
              normalizeText(
                alias
              );


            if (
              recipeText.includes(
                normalizedAlias
              )
            ) {

              found =
                true;

            }


          }
        );


        /*
         * Also check canonical
         * ingredient names.
         */

        if (
          !found &&
          recipeText.includes(
            userIngredient
              .replace(
                /_/g,
                " "
              )
          )
        ) {

          found =
            true;

        }


        if (found) {

          matchedIngredients.push(
            userIngredient
          );

        }


      }
    );


    /*
     * Remove duplicate matches.
     */

    const uniqueMatches =
      [

        ...new Set(
          matchedIngredients
        )

      ];


    return {

      id:
        meal.idMeal,

      name:
        meal.strMeal,

      category:
        meal.strCategory ||
        "",

      area:
        meal.strArea ||
        "",

      image:
        meal.strMealThumb ||
        "",

      source:
        meal.strSource ||
        "",

      youtube:
        meal.strYoutube ||
        "",

      description:
        meal.strTags ||
        "",

      ingredients:
        ingredients,

      instructions:
        meal.strInstructions ||
        "",

      matchedIngredients:
        uniqueMatches,

      matchCount:
        uniqueMatches.length,

      searchMatchCount:
        existingData
          .searchMatchCount ||
        0,

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
CONVERT ONLINE RECIPE INTO APP FORMAT
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


  return {

    id:
      `online-${onlineRecipe.id}`,

    name:
      onlineRecipe.name,

    type:
      onlineRecipe.category ||
      "Online Recipe",

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
          .matchedIngredients ||
        []
      )

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
      onlineRecipe.matchCount ||
      0,


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
    normalizeOnlineIngredient,

  getCanonicalIngredient:
    getCanonicalIngredient

};


console.log(
  "Online recipe search loaded."
);
