import foodStorage from './storage/FoodStorage.js'
import {calculateCalories} from "./helpers.js";
import Snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";
import NutritionData from "./data/NutritionData.js";
import { Chart } from "chart.js/auto";

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
        nutritionData.addEntry(carbs, protein, fat)
        foodList.insertAdjacentHTML(
            "beforeend",
            `<li class="card">
                    <button class="delete-btn" type="button" aria-label="Delete entry">✕</button>
                    <button class="edit-btn" type="button">✎</button>
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

    // 음식 추가 기능
    form.addEventListener('submit', event => {
        event.preventDefault()

        const newFood = {
            name: foodNameInput.value,
            carbs: carbsInput.value,
            protein: proteinInput.value,
            fat: fatInput.value
        }

        try {
            storagedData = storage.addFood(newFood)
            Snackbar.show('저장 성공')
            form.reset()
        } catch (error) {
            console.error("저장 실패", error)
            Snackbar.show('저장 실패')
        }

        displayEntry(newFood.name, newFood.carbs, newFood.protein, newFood.fat,)
        render()
    })

    // TODO 칼로리 카드 삭제 기능

    // TODO 칼로리 카드 수정 기능
    // TODO 유효성 검사
    // TODO 빈 상태 ui
    // TODO 수정/삭제 성공 메시지


    const init = () => {
        storagedData = storage.getAll()
        console.log('저장된 데이터?', storagedData)

        storagedData?.forEach((food) => {
            if (storagedData) {
                displayEntry(food.name, food.carbs, food.protein, food.fat)

            }
        })
        render()
    }

    let chartInstance = null;
    const renderChart = () => {
        chartInstance?.destroy();

        const context = document.querySelector("#app-chart").getContext("2d");

        chartInstance = new Chart(context, {
            type: "bar",
            data: {
                labels: ["탄수화물", "단백질", "지방"],
                datasets: [
                    {
                        label: "Macronutrients",
                        data: [nutritionData.getTotalCarbs(), nutritionData.getTotalProtein(), nutritionData.getTotalFat()],
                        backgroundColor: ["#f3ad6c", "#c7443e", "#f9dc6e"],
                        borderWidth: 1, // example of other customization
                    },
                ],
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    const totalCalories = document.querySelector("#total-calories");

    const updateTotalCalories = () => {
        totalCalories.textContent = nutritionData.getTotalCalories();
    }

    const render = () => {
        renderChart();
        updateTotalCalories();
    }
    init()

}
