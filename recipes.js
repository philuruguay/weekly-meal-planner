const recipeLibrary = [];

function addRecipe(recipe) {
  recipeLibrary.push({
    id: recipeLibrary.length + 1,
    name: recipe.name,
    type: recipe.type,
    calories: recipe.calories,
    protein: recipe.protein,
    difficulty: recipe.difficulty,
    tags: recipe.tags || [],
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    description: recipe.description || ""
  });
}


/* =========================================================
   BREAKFASTS
   125 recipes
   ========================================================= */

const breakfastProteins = [
  {
    name: "Greek Yogurt",
    protein: 30,
    calories: 220,
    ingredient: "1 cup Greek yogurt"
  },
  {
    name: "Eggs",
    protein: 25,
    calories: 260,
    ingredient: "2 eggs"
  },
  {
    name: "Cottage Cheese",
    protein: 28,
    calories: 240,
    ingredient: "1 cup cottage cheese"
  },
  {
    name: "Protein Oats",
    protein: 30,
    calories: 330,
    ingredient: "1/2 cup oats with protein-rich milk"
  },
  {
    name: "Turkey Eggs",
    protein: 32,
    calories: 300,
    ingredient: "2 eggs with 75 g lean turkey"
  }
];

const breakfastFruits = [
  {
    name: "Berry",
    calories: 70,
    ingredient: "1/2 cup mixed berries",
    tag: "berries"
  },
  {
    name: "Banana",
    calories: 105,
    ingredient: "1 banana",
    tag: "banana"
  },
  {
    name: "Apple",
    calories: 95,
    ingredient: "1 apple",
    tag: "apple"
  },
  {
    name: "Peach",
    calories: 60,
    ingredient: "1 peach",
    tag: "peach"
  },
  {
    name: "Mango",
    calories: 100,
    ingredient: "1/2 cup mango",
    tag: "mango"
  }
];

const breakfastStyles = [
  {
    name: "Bowl",
    extraCalories: 90,
    extraIngredient: "2 tbsp granola",
    tag: "bowl"
  },
  {
    name: "Parfait",
    extraCalories: 80,
    extraIngredient: "2 tbsp granola and 1 tsp chia seeds",
    tag: "parfait"
  },
  {
    name: "Toast",
    extraCalories: 160,
    extraIngredient: "2 slices whole grain toast",
    tag: "toast"
  },
  {
    name: "Oatmeal",
    extraCalories: 150,
    extraIngredient: "1/2 cup oats",
    tag: "oatmeal"
  },
  {
    name: "Breakfast Plate",
    extraCalories: 120,
    extraIngredient: "1 slice whole grain toast",
    tag: "breakfast"
  }
];

for (let p = 0; p < breakfastProteins.length; p++) {

  for (let f = 0; f < breakfastFruits.length; f++) {

    for (let s = 0; s < breakfastStyles.length; s++) {

      const protein = breakfastProteins[p];
      const fruit = breakfastFruits[f];
      const style = breakfastStyles[s];

      const calories =
        protein.calories +
        fruit.calories +
        style.extraCalories;

      const proteinAmount =
        protein.protein +
        (style.tag === "oatmeal" ? 4 : 2);

      addRecipe({

        name:
          `${fruit.name} ${protein.name} ${style.name}`,

        type: "Breakfast",

        calories: calories,

        protein: proteinAmount,

        difficulty: "easy",

        tags: [
          "breakfast",
          "healthy",
          "high-protein",
          fruit.tag,
          style.tag
        ],

        ingredients: [
          protein.ingredient,
          fruit.ingredient,
          style.extraIngredient,
          "Cinnamon",
          "Optional: 1 tsp honey"
        ],

        instructions: [
          "Prepare the protein base according to the recipe style.",
          "Add the fruit.",
          "Add the remaining ingredients.",
          "Serve immediately."
        ],

        description:
          `A balanced ${fruit.name.toLowerCase()} breakfast with ${proteinAmount}g of protein.`
      });

    }

  }

}


/* =========================================================
   LUNCHES
   125 recipes
   ========================================================= */

const lunchProteins = [
  {
    name: "Chicken",
    ingredient: "170 g grilled chicken breast",
    protein: 52,
    calories: 280,
    tag: "chicken"
  },
  {
    name: "Turkey",
    ingredient: "170 g lean ground turkey",
    protein: 45,
    calories: 300,
    tag: "turkey"
  },
  {
    name: "Lean Beef",
    ingredient: "150 g lean beef",
    protein: 42,
    calories: 320,
    tag: "beef"
  },
  {
    name: "Shrimp",
    ingredient: "170 g cooked shrimp",
    protein: 40,
    calories: 180,
    tag: "shrimp"
  },
  {
    name: "Tofu",
    ingredient: "200 g firm tofu",
    protein: 28,
    calories: 240,
    tag: "tofu"
  }
];

const lunchBases = [
  {
    name: "Rice Bowl",
    calories: 220,
    ingredient: "1 cup cooked rice",
    tag: "rice"
  },
  {
    name: "Quinoa Bowl",
    calories: 220,
    ingredient: "1 cup cooked quinoa",
    tag: "quinoa"
  },
  {
    name: "Whole Grain Wrap",
    calories: 190,
    ingredient: "1 large whole grain tortilla",
    tag: "wrap"
  },
  {
    name: "Sweet Potato Bowl",
    calories: 200,
    ingredient: "250 g roasted sweet potato",
    tag: "sweet-potato"
  },
  {
    name: "Salad",
    calories: 120,
    ingredient: "3 cups mixed salad greens",
    tag: "salad"
  }
];

const lunchFlavors = [
  {
    name: "Greek",
    ingredients: [
      "Cucumber",
      "Tomato",
      "Greek yogurt",
      "Lemon",
      "Oregano"
    ],
    tag: "greek"
  },
  {
    name: "Mexican",
    ingredients: [
      "Black beans",
      "Tomato",
      "Salsa",
      "Lime",
      "Cilantro"
    ],
    tag: "mexican"
  },
  {
    name: "Mediterranean",
    ingredients: [
      "Tomato",
      "Cucumber",
      "Olives",
      "Feta",
      "Lemon"
    ],
    tag: "mediterranean"
  },
  {
    name: "Teriyaki",
    ingredients: [
      "Broccoli",
      "Carrots",
      "Low-sodium teriyaki sauce",
      "Green onion"
    ],
    tag: "teriyaki"
  },
  {
    name: "Herb",
    ingredients: [
      "Broccoli",
      "Bell pepper",
      "Garlic",
      "Parsley",
      "Lemon"
    ],
    tag: "herb"
  }
];

for (let p = 0; p < lunchProteins.length; p++) {

  for (let b = 0; b < lunchBases.length; b++) {

    for (let f = 0; f < lunchFlavors.length; f++) {

      const protein = lunchProteins[p];
      const base = lunchBases[b];
      const flavor = lunchFlavors[f];

      const calories =
        protein.calories +
        base.calories +
        130;

      addRecipe({

        name:
          `${flavor.name} ${protein.name} ${base.name}`,

        type: "Lunch",

        calories: calories,

        protein:
          protein.protein + 5,

        difficulty:
          base.tag === "wrap" || base.tag === "salad"
            ? "easy"
            : "moderate",

        tags: [
          "lunch",
          "healthy",
          "high-protein",
          protein.tag,
          base.tag,
          flavor.tag
        ],

        ingredients: [
          protein.ingredient,
          base.ingredient,
          ...flavor.ingredients,
          "1 tbsp olive oil"
        ],

        instructions: [
          "Prepare the protein until fully cooked.",
          "Prepare the grain, wrap, potato or salad base.",
          "Add the vegetables and flavor ingredients.",
          "Combine everything and serve."
        ],

        description:
          `A balanced ${flavor.name.toLowerCase()}-style ${protein.name.toLowerCase()} lunch.`
      });

    }

  }

}


/* =========================================================
   DINNERS
   125 recipes
   ========================================================= */

const dinnerProteins = [
  {
    name: "Grilled Chicken",
    ingredient: "200 g chicken breast",
    protein: 60,
    calories: 330,
    tag: "chicken"
  },
  {
    name: "Lean Steak",
    ingredient: "180 g lean steak",
    protein: 52,
    calories: 390,
    tag: "steak"
  },
  {
    name: "Turkey",
    ingredient: "200 g lean ground turkey",
    protein: 52,
    calories: 340,
    tag: "turkey"
  },
  {
    name: "Shrimp",
    ingredient: "200 g shrimp",
    protein: 48,
    calories: 210,
    tag: "shrimp"
  },
  {
    name: "Chicken Thigh",
    ingredient: "200 g boneless skinless chicken thigh",
    protein: 48,
    calories: 360,
    tag: "chicken"
  }
];

const dinnerBases = [
  {
    name: "Roasted Potatoes",
    calories: 230,
    ingredient: "300 g roasted potatoes",
    tag: "potatoes"
  },
  {
    name: "Brown Rice",
    calories: 215,
    ingredient: "1 cup cooked brown rice",
    tag: "rice"
  },
  {
    name: "Whole Wheat Pasta",
    calories: 260,
    ingredient: "90 g whole wheat pasta",
    tag: "pasta"
  },
  {
    name: "Quinoa",
    calories: 220,
    ingredient: "1 cup cooked quinoa",
    tag: "quinoa"
  },
  {
    name: "Sweet Potato",
    calories: 220,
    ingredient: "250 g roasted sweet potato",
    tag: "sweet-potato"
  }
];

const dinnerStyles = [
  {
    name: "Garlic Herb",
    calories: 110,
    ingredients: [
      "Garlic",
      "Rosemary",
      "Parsley",
      "Lemon"
    ],
    tag: "garlic-herb"
  },
  {
    name: "Mediterranean",
    calories: 130,
    ingredients: [
      "Tomato",
      "Cucumber",
      "Feta",
      "Oregano"
    ],
    tag: "mediterranean"
  },
  {
    name: "Fajita",
    calories: 120,
    ingredients: [
      "Bell peppers",
      "Onion",
      "Fajita seasoning",
      "Lime"
    ],
    tag: "fajita"
  },
  {
    name: "Teriyaki",
    calories: 130,
    ingredients: [
      "Broccoli",
      "Carrots",
      "Low-sodium teriyaki sauce",
      "Green onion"
    ],
    tag: "teriyaki"
  },
  {
    name: "Pesto",
    calories: 140,
    ingredients: [
      "Spinach",
      "Cherry tomatoes",
      "Pesto",
      "Parmesan"
    ],
    tag: "pesto"
  }
];

for (let p = 0; p < dinnerProteins.length; p++) {

  for (let b = 0; b < dinnerBases.length; b++) {

    for (let s = 0; s < dinnerStyles.length; s++) {

      const protein = dinnerProteins[p];
      const base = dinnerBases[b];
      const style = dinnerStyles[s];

      addRecipe({

        name:
          `${style.name} ${protein.name} with ${base.name}`,

        type: "Dinner",

        calories:
          protein.calories +
          base.calories +
          style.calories,

        protein:
          protein.protein + 7,

        difficulty:
          base.tag === "pasta"
            ? "moderate"
            : "easy",

        tags: [
          "dinner",
          "healthy",
          "high-protein",
          protein.tag,
          base.tag,
          style.tag
        ],

        ingredients: [
          protein.ingredient,
          base.ingredient,
          ...style.ingredients,
          "1 tbsp olive oil"
        ],

        instructions: [
          "Season the protein with the selected flavor ingredients.",
          "Cook the protein until fully cooked.",
          "Prepare the chosen grain, pasta or potato.",
          "Cook the vegetables.",
          "Combine and serve."
        ],

        description:
          `A balanced ${style.name.toLowerCase()} dinner featuring ${protein.name.toLowerCase()}.`
      });

    }

  }

}


/* =========================================================
   SNACKS
   125 recipes
   ========================================================= */

const snackBases = [
  {
    name: "Greek Yogurt",
    calories: 150,
    protein: 17,
    ingredient: "3/4 cup Greek yogurt",
    tag: "yogurt"
  },
  {
    name: "Cottage Cheese",
    calories: 170,
    protein: 20,
    ingredient: "3/4 cup cottage cheese",
    tag: "cottage-cheese"
  },
  {
    name: "Protein Smoothie",
    calories: 220,
    protein: 25,
    ingredient: "1 scoop protein powder blended with milk",
    tag: "smoothie"
  },
  {
    name: "Hard-Boiled Eggs",
    calories: 140,
    protein: 12,
    ingredient: "2 hard-boiled eggs",
    tag: "eggs"
  },
  {
    name: "Peanut Butter Toast",
    calories: 210,
    protein: 10,
    ingredient: "1 slice whole grain toast with 1 tbsp peanut butter",
    tag: "peanut-butter"
  }
];

const snackAdditions = [
  {
    name: "Berries",
    calories: 60,
    protein: 1,
    ingredient: "1/2 cup berries",
    tag: "berries"
  },
  {
    name: "Banana",
    calories: 105,
    protein: 1,
    ingredient: "1 banana",
    tag: "banana"
  },
  {
    name: "Apple",
    calories: 95,
    protein: 0,
    ingredient: "1 apple",
    tag: "apple"
  },
  {
    name: "Peach",
    calories: 60,
    protein: 1,
    ingredient: "1 peach",
    tag: "peach"
  },
  {
    name: "Mango",
    calories: 80,
    protein: 1,
    ingredient: "1/2 cup mango",
    tag: "mango"
  }
];

const snackFinishes = [
  {
    name: "Cinnamon",
    calories: 5,
    ingredient: "Cinnamon",
    tag: "cinnamon"
  },
  {
    name: "Chia",
    calories: 60,
    ingredient: "1 tbsp chia seeds",
    tag: "chia"
  },
  {
    name: "Almonds",
    calories: 90,
    ingredient: "12 almonds",
    tag: "almonds"
  },
  {
    name: "Honey",
    calories: 65,
    ingredient: "1 tbsp honey",
    tag: "honey"
  },
  {
    name: "Dark Chocolate",
    calories: 80,
    ingredient: "15 g dark chocolate",
    tag: "dark-chocolate"
  }
];

for (let b = 0; b < snackBases.length; b++) {

  for (let a = 0; a < snackAdditions.length; a++) {

    for (let f = 0; f < snackFinishes.length; f++) {

      const base = snackBases[b];
      const addition = snackAdditions[a];
      const finish = snackFinishes[f];

      addRecipe({

        name:
          `${addition.name} ${base.name} with ${finish.name}`,

        type: "Snack",

        calories:
          base.calories +
          addition.calories +
          finish.calories,

        protein:
          base.protein +
          addition.protein +
          (finish.tag === "almonds" ? 3 : 0),

        difficulty: "easy",

        tags: [
          "snack",
          "healthy",
          base.tag,
          addition.tag,
          finish.tag
        ],

        ingredients: [
          base.ingredient,
          addition.ingredient,
          finish.ingredient
        ],

        instructions: [
          "Combine the ingredients.",
          "Serve chilled or immediately as appropriate."
        ],

        description:
          `A simple ${addition.name.toLowerCase()} snack with protein and satisfying ingredients.`
      });

    }

  }

}


/* =========================================================
   MAKE THE RECIPE LIBRARY AVAILABLE TO THE APP
   ========================================================= */

window.recipeLibrary = recipeLibrary;


/*
 * SAFETY CHECK
 *
 * The app should have exactly 500 generated recipes:
 *
 * 125 breakfasts
 * 125 lunches
 * 125 dinners
 * 125 snacks
 */

console.log(
  "Weekly Meal Planner recipe library loaded:",
  recipeLibrary.length,
  "recipes"
);
