import foodStorage from './storage/FoodStorage.js'
import {calculateCalories} from "./helpers.js";
import Snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";
import NutritionData from "./data/NutritionData.js";

export function initApp() {
    const form = document.querySelector('#create-form')
    const foodNameInput = document.querySelector('#create-name')
    const carbsInput = document.querySelector('#create-carbs')
    const proteinInput = document.querySelector('#create-protein')
    const fatInput = document.querySelector('#create-fat')
    const foodList = document.querySelector('#food-list');

    const storage = new foodStorage()
    const nutritionData = new NutritionData()
    let storagedData = []

    const displayEntry = (name, carbs, protein, fat) => {
        foodList.insertAdjacentHTML(
            "beforeend",
            `<li class="card">
        <div>
          <h3 class="name">${name}</h3>
          <div class="calories">${calculateCalories(
                carbs,
                protein,
                fat
            )} calories</div>
          <ul class="macros">
            <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
            <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
            <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
          </ul>
        </div>
      </li>`
        );
    };

    form.addEventListener('submit', event => {
        event.preventDefault()

        const newFood = {
            name: foodNameInput.value,
            carbs: carbsInput.value,
            protein: proteinInput.value,
            fat: fatInput.value
        }

        try {
            storagedData = storage.add(newFood)

            Snackbar.show('저장 성공')


            form.reset()


        } catch (error) {
            console.error("저장 실패", error)
            Snackbar.show('저장 실패')
        }

        displayEntry(newFood.name, newFood.carbs, newFood.protein, newFood.fat,)
    })

    const init = () => {
        storagedData = storage.getAll()
        console.log('저장된 데이터?', storagedData)

        storagedData?.forEach((food) => {
            if (storagedData) {
                displayEntry(food.name, food.carbs, food.protein, food.fat)

            }
        })
    }
    init()

}
