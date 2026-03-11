import foodStorage from './storage/FoodStorage.js'
import {calculateCalories} from "./helpers.js";
import Snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";
import FoodStorage from "./storage/FoodStorage.js";

export function initApp() {
    const form = document.querySelector('#create-form')
    const foodNameInput = document.querySelector('#create-name')
    const carbsInput = document.querySelector('#create-carbs')
    const proteinInput = document.querySelector('#create-protein')
    const fatInput = document.querySelector('#create-fat')
    const foodList = document.querySelector('#food-list');

    const storage = new foodStorage()
    let storagedData = []

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

        foodList.insertAdjacentHTML('beforeend', `
            <li class="card">
                <div>
                  <h3 class="name">${newFood.name}</h3>
                  <div class="calories">${calculateCalories(newFood.carbs, newFood.protein, newFood.fat)} calories</div>
                  <ul class="macros">
                    <li class="carbs"><div>Carbs</div><div class="value">탄수화물 g</div></li>
                    <li class="protein"><div>Protein</div><div class="value">단백질 g</div></li>
                    <li class="fat"><div>Fat</div><div class="value">지방 g</div></li>
                  </ul>
                </div>
              </li>
            `)
    })

    const init = () => {
        storagedData = storage.getAll()
        console.log('저장된 데이터?', storagedData)

        storagedData?.forEach((food) => {
            if (storagedData) {
                foodList.insertAdjacentHTML('beforeend', `
                    <li class="card">
                        <div>
                            <h3 class="name">${food.name}</h3>
                            <div class="calories">${calculateCalories(food.carbs, food.protein, food.fat)} calories</div>
                            <ul class="macros">
                               <li class="carbs"><div>Carbs</div><div class="value">${food.carbs}g</div></li>
                               <li class="protein"><div>Protein</div><div class="value">${food.protein}g</div></li>
                               <li class="fat"><div>Fat</div><div class="value">${food.fat}g</div></li>
                            </ul>
                        </div>
                    </li>
                `)
            }
        })
    }
    init()

}
