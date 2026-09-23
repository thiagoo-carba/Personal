/* =====================================================
   FRESHLY
   Refrigerator + Personalized Recipes
===================================================== */


/* =====================================================
   DEFAULT FOOD
===================================================== */

const defaultFoods = [
    {
        id: 1,
        name: "Apples",
        quantity: "3 apples",
        days: 5,
        category: "fruit",
        image: "https://imgs.search.brave.com/zp_QRsvFD4tzOrn9rAaGEPuh236hPEZqujxpPqGcT8o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjQvNTI2LzE4OS9zbWFs/bC9hcHBsZS1pc29s/YXRlZC1yZWQtYXBw/bGUtb24tdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZC13aXRoLWZ1/bGwtZGVwdGgtb2Yt/ZmllbGQtYXBwbGUt/cG5nLnBuZw",
        addedAt: new Date().toISOString()
    },

    {
        id: 2,
        name: "Meat",
        quantity: "1 kg",
        days: 8,
        category: "protein",
        image: "https://imgs.search.brave.com/06hjQu_pUcgmhNGciblhPDWmI0h4Vj_BmP5Ysijc9PI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/MjEwLzg0NC9zbWFs/bC9haS1nZW5lcmF0/ZWQtcmF3LW1lYXQt/b24tdHJhbnNwYXJl/bnQtYmFja2dyb3Vu/ZC1haS1nZW5lcmF0/ZWQtcG5nLnBuZw",
        addedAt: new Date().toISOString()
    },

    {
        id: 3,
        name: "Milk",
        quantity: "2 liters",
        days: 1,
        category: "dairy",
        image: "https://imgs.search.brave.com/LdcN571uD14qKijypE8RK8akKeLufNL62j8Rpiueu8k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlzenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDQvMDE1LzU4OS9zbWFs/bC8zZC1yZW5kZXJp/bmctb2YtYS1taWxr/LXNwbGFzaGVzLWlu/LWEtZ2xhc3Mtb24t/dHJhbnNwYXJlbnQt/YmFja2dyb3VuZC1w/bmcucG5n",
        addedAt: new Date().toISOString()
    }
];


/* =====================================================
   RECIPES DATABASE
===================================================== */

const recipes = [

    {
        id: 1,
        name: "Creamy Chicken Pasta",
        description: "A quick creamy pasta using ingredients from your fridge.",
        ingredients: [
            "chicken",
            "pasta",
            "milk",
            "garlic"
        ],
        time: 25,
        difficulty: "Easy",
        tags: ["quick", "easy"],
        icon: "restaurant"
    },

    {
        id: 2,
        name: "Apple Pancakes",
        description: "Soft pancakes with fresh apples and a touch of cinnamon.",
        ingredients: [
            "apples",
            "milk",
            "flour",
            "egg"
        ],
        time: 20,
        difficulty: "Easy",
        tags: ["quick", "easy", "vegetarian"],
        icon: "bakery_dining"
    },

    {
        id: 3,
        name: "Chicken Rice Bowl",
        description: "A simple and filling bowl with chicken, rice and vegetables.",
        ingredients: [
            "chicken",
            "rice",
            "onion",
            "garlic"
        ],
        time: 30,
        difficulty: "Easy",
        tags: ["easy"],
        icon: "rice_bowl"
    },

    {
        id: 4,
        name: "Creamy Vegetable Soup",
        description: "A comforting soup using vegetables and milk.",
        ingredients: [
            "milk",
            "potato",
            "onion",
            "carrot"
        ],
        time: 30,
        difficulty: "Easy",
        tags: ["easy", "vegetarian"],
        icon: "soup_kitchen"
    },

    {
        id: 5,
        name: "Apple & Milk Smoothie",
        description: "A fresh smoothie that takes only a few minutes.",
        ingredients: [
            "apples",
            "milk",
            "honey"
        ],
        time: 5,
        difficulty: "Easy",
        tags: ["quick", "easy", "vegetarian"],
        icon: "local_drink"
    },

    {
        id: 6,
        name: "Chicken Sandwich",
        description: "A simple sandwich perfect for a quick lunch.",
        ingredients: [
            "chicken",
            "bread",
            "cheese",
            "tomato"
        ],
        time: 10,
        difficulty: "Easy",
        tags: ["quick", "easy"],
        icon: "lunch_dining"
    }

];


/* =====================================================
   STATE
===================================================== */

let foods =
    JSON.parse(localStorage.getItem("freshlyFoods")) ||
    defaultFoods;

let currentFilter = "all";
let sortAscending = true;


/* =====================================================
   DOM
===================================================== */

const foodList = document.getElementById("foodList");
const emptyState = document.getElementById("emptyState");

const foodCount = document.getElementById("foodCount");
const expiringText = document.getElementById("expiringText");

const modal = document.getElementById("modal");
const recipeModal = document.getElementById("recipeModal");

const foodForm = document.getElementById("foodForm");

const recipeList = document.getElementById("recipeList");


/* =====================================================
   STORAGE
===================================================== */

function saveFoods() {

    localStorage.setItem(
        "freshlyFoods",
        JSON.stringify(foods)
    );

}


/* =====================================================
   HELPERS
===================================================== */

function normalize(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/gi, "");

}


function daysRemaining(food) {

    const added =
        new Date(food.addedAt);

    const now =
        new Date();

    const elapsed =
        Math.floor(
            (now - added) /
            (1000 * 60 * 60 * 24)
        );

    return food.days - elapsed;

}


function getFoodStatus(food) {

    const remaining =
        daysRemaining(food);

    if (remaining <= 0) {
        return "danger";
    }

    if (remaining <= 2) {
        return "warning";
    }

    return "fresh";

}


function expiryText(food) {

    const remaining =
        daysRemaining(food);

    if (remaining <= 0) {
        return "Expired";
    }

    if (remaining === 1) {
        return "Expires tomorrow";
    }

    return `Fresh for ${remaining} days`;

}


function formatAddedDate(date) {

    return new Date(date).toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric"
        }
    );

}


/* =====================================================
   RENDER FOOD
===================================================== */

function renderFoods() {

    foodList.innerHTML = "";

    if (!foods.length) {

        emptyState.style.display = "block";

        updateStats();

        return;

    }

    emptyState.style.display = "none";


    let sortedFoods = [...foods];

    if (sortAscending) {

        sortedFoods.sort(
            (a, b) =>
                daysRemaining(a) -
                daysRemaining(b)
        );

    } else {

        sortedFoods.sort(
            (a, b) =>
                daysRemaining(b) -
                daysRemaining(a)
        );

    }


    sortedFoods.forEach(food => {

        const status =
            getFoodStatus(food);

        const item =
            document.createElement("article");

        item.className =
            `food-item ${status}`;

        item.innerHTML = `

            <div class="food-image">

                <img
                    src="${food.image || fallbackImage(food.category)}"
                    alt="${food.name}"
                    onerror="this.src='${fallbackImage(food.category)}'"
                >

            </div>


            <div class="food-info">

                <div class="food-title">
                    ${capitalize(food.name)}
                </div>

                <div class="food-quantity">
                    ${food.quantity}
                </div>

                <div class="food-bottom">

                    <span class="status-dot"></span>

                    <span class="food-expiry">
                        ${expiryText(food)}
                    </span>

                </div>

            </div>


            <div class="food-date">
                Added ${formatAddedDate(food.addedAt)}
            </div>

        `;


        item.addEventListener(
            "click",
            () => removeFood(food.id)
        );


        foodList.appendChild(item);

    });


    updateOverview();

}


/* =====================================================
   FALLBACK IMAGE
===================================================== */

function fallbackImage(category) {

    const icons = {

        fruit:
            "https://cdn-icons-png.flaticon.com/512/415/415733.png",

        vegetable:
            "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",

        protein:
            "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",

        dairy:
            "https://cdn-icons-png.flaticon.com/512/2405/2405479.png",

        grain:
            "https://cdn-icons-png.flaticon.com/512/3075/3075984.png",

        other:
            "https://cdn-icons-png.flaticon.com/512/3082/3082031.png"

    };

    return icons[category] || icons.other;

}


/* =====================================================
   ADD FOOD
===================================================== */

foodForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document
                .getElementById("foodName")
                .value
                .trim();

        const quantity =
            document
                .getElementById("foodQuantity")
                .value
                .trim();

        const days =
            Number(
                document
                    .getElementById("foodDays")
                    .value
            );

        const category =
            document
                .getElementById("foodCategory")
                .value;

        const image =
            document
                .getElementById("foodImage")
                .value
                .trim();


        const newFood = {

            id: Date.now(),

            name,

            quantity,

            days,

            category,

            image,

            addedAt:
                new Date().toISOString()

        };


        foods.push(newFood);

        saveFoods();

        renderFoods();

        renderRecipes();

        closeModal();

        foodForm.reset();

        navigate("fridge");

    }
);


/* =====================================================
   REMOVE FOOD
===================================================== */

function removeFood(id) {

    const food =
        foods.find(
            item => item.id === id
        );

    if (!food) return;


    const confirmed =
        confirm(
            `Remove ${food.name} from your refrigerator?`
        );


    if (!confirmed) return;


    foods =
        foods.filter(
            item => item.id !== id
        );

    saveFoods();

    renderFoods();

    renderRecipes();

}


/* =====================================================
   OVERVIEW
===================================================== */

function updateOverview() {

    foodCount.textContent =
        foods.length;


    const expiring =
        foods.filter(
            food =>
                daysRemaining(food) <= 2
        );


    if (!expiring.length) {

        expiringText.textContent =
            "Nothing is expiring soon.";

    } else {

        expiringText.textContent =
            `${expiring.length} item${
                expiring.length > 1
                    ? "s are"
                    : " is"
            } expiring soon.`;

    }

}


/* =====================================================
   RECIPES
===================================================== */

function getAvailableFoodNames() {

    return foods.map(
        food => normalize(food.name)
    );

}


function ingredientAvailable(ingredient) {

    const available =
        getAvailableFoodNames();


    return available.some(
        foodName =>
            foodName.includes(
                normalize(ingredient)
            ) ||
            normalize(ingredient)
                .includes(foodName)
    );

}


function getRecipeScore(recipe) {

    const matches =
        recipe.ingredients.filter(
            ingredient =>
                ingredientAvailable(ingredient)
        );


    if (!matches.length) {
        return 0;
    }


    return Math.round(
        (matches.length /
            recipe.ingredients.length) *
        100
    );

}


function getRecipePriority(recipe) {

    let score =
        getRecipeScore(recipe);


    recipe