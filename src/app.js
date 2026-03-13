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
    let newFood = {}

    const displayEntry = (cardId, foodId, name, carbs, protein, fat) => {
        nutritionData.addEntry(carbs, protein, fat)
        foodList.insertAdjacentHTML(
            "beforeend",
            `<div id="card-div"><li class="card" data-id="${foodId}" data-card-id="${cardId}">
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
                  </li></div>`
                );
            };

    // TODO 빈 상태 ui
    const renderEmptyCard = (card) => {
        const foodId = card.dataset.id
        const cardId = card.dataset.cardId
        const name = card.querySelector('.name').textContent
        const carbs = card.querySelector('.carbs .value').textContent.replace('g', '')
        const protein = card.querySelector('.protein .value').textContent.replace('g', '')
        const fat = card.querySelector('.fat .value').textContent.replace('g', '')


        card.innerHTML =
            `<div id="card-div"><li class="card" data-id="${foodId}" data-card-id="${cardId}">
              <button class="delete-btn" type="button">✕</button>
              <button class="save-btn" type="button">✔</button>
            
              <div>
                <h3 class="name">
                    <input class="card-name-input" id="edit-name-input" placeholder="Food name" value="${name}" />
                </h3>
            
                <div class="calories">${calculateCalories(
                carbs,
                protein,
                fat
            )} calories</div>
            
                <ul class="macros">
                  <li class="carbs">
                    <div>Carbs</div>
                    <input type="number" class="value-input carbs-input" id="edit-carbs-input" value="${carbs}" placeholder="0 g">
                  </li>
            
                  <li class="protein">
                    <div>Protein</div>
                    <input type="number" class="value-input protein-input" id="edit-protein-input" value="${protein}" placeholder="0 g">
                  </li>
            
                  <li class="fat">
                    <div>Fat</div>
                    <input type="number" class="value-input fat-input" id="edit-fat-input" value="${fat}" placeholder="0 g">
                  </li>
                </ul>
              </div>
            </li></div>
        `
    }

    // 음식 추가 기능
    form.addEventListener('submit', event => {
        event.preventDefault()

        newFood = {
            foodId: Date.now(),
            name: foodNameInput.value,
            carbs: carbsInput.value,
            protein: proteinInput.value,
            fat: fatInput.value
        }

        try {
            storage.addFood(newFood)
            Snackbar.show('저장 성공')
            form.reset()
        } catch (error) {
            console.error("저장 실패", error)
            Snackbar.show('저장 실패')
        }

        displayEntry(newFood.foodId, newFood.name, newFood.carbs, newFood.protein, newFood.fat)
        render()
    })

    // TODO 칼로리 카드 삭제 기능

    // TODO 칼로리 카드 수정 기능
    foodList.addEventListener('click', (event) => {
        const editButton = event.target.closest('.edit-btn')
        if (editButton) {
            const card = editButton.closest('.card')
            if (!card) return
            renderEmptyCard(card)
            return
        }

        const saveButton = event.target.closest('.save-btn')
        if (saveButton) {
            const card = saveButton.closest('.card')
            if (!card) return

            const foodId = card.dataset.id
            const cardId = card.dataset.cardId

            const updatedFood = {
                foodId: Number(foodId),
                name: card.querySelector('.card-name-input').value,
                carbs: card.querySelector('.carbs-input').value,
                protein: card.querySelector('.protein-input').value,
                fat: card.querySelector('.fat-input').value,
            }

            storage.updateFoods(updatedFood)

            card.innerHTML = `
            <button class="delete-btn" type="button" aria-label="Delete entry">✕</button>
            <button class="edit-btn" type="button">✎</button>
            <div>
              <h3 class="name">${updatedFood.name}</h3>
              <div class="calories">${calculateCalories(
                updatedFood.carbs,
                updatedFood.protein,
                updatedFood.fat
            )} calories</div>
              <ul class="macros">
                <li class="carbs"><div>Carbs</div><div class="value">${updatedFood.carbs}g</div></li>
                <li class="protein"><div>Protein</div><div class="value">${updatedFood.protein}g</div></li>
                <li class="fat"><div>Fat</div><div class="value">${updatedFood.fat}g</div></li>
              </ul>
            </div>
        `

            return
        }
    })
    // TODO 유효성 검사

    // TODO 수정/삭제 성공 메시지


    const init = () => {
        storagedData = storage.getAll()
        console.log('저장된 데이터?', storagedData)

        storagedData?.forEach((food, index) => {
            if (storagedData) {
                displayEntry(index, food.foodId, food.name, food.carbs, food.protein, food.fat)

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
