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
    const totalCalories = document.querySelector("#total-calories");

    const storage = new foodStorage()
    const nutritionData = new NutritionData()

    let storagedData = []

    // 카드 랜더링 함수
    const foodCard = (food, cardId) => {
        foodList.insertAdjacentHTML(
            "beforeend",
            `
                <div id="card-div">
                    <li class="card" data-id="${food.foodId}" data-card-id="${cardId}">
                        <button class="delete-btn" type="button" aria-label="Delete entry">✕</button>
                        <button class="edit-btn" type="button">✎</button>
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
                </div>
            `
        );
    };

    // 빈 상태 ui
    const renderEditCard = (card) => {
        const foodId = card.dataset.id
        const cardId = card.dataset.cardId
        const name = card.querySelector('.name').textContent
        const carbs = card.querySelector('.carbs .value').textContent.replace('g', '')
        const protein = card.querySelector('.protein .value').textContent.replace('g', '')
        const fat = card.querySelector('.fat .value').textContent.replace('g', '')


        card.innerHTML =
            `<li class="card" data-id="${foodId}" data-card-id="${cardId}">
              <button class="delete-btn" type="button">✕</button>
              <button class="save-btn" type="button">✔</button>
            
              <div>
                <h3 class="name">
                    <input class="card-name-input" id="edit-name-input" placeholder="Food name" value="${name}" />
                </h3>
            
                <div class="calories">${calculateCalories(Number(carbs), Number(protein), Number(fat))} calories</div>
            
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
            </li>
        `
    }

    // 음식카드 추가 이벤트
    form.addEventListener('submit', event => {
        event.preventDefault()

        let newFood = {
            foodId: Date.now(),
            name: foodNameInput.value,
            carbs: carbsInput.value,
            protein: proteinInput.value,
            fat: fatInput.value
        }

        const errorMessage = validateFood(newFood)
        if (errorMessage) {
            Snackbar.show(errorMessage)
            return
        }
        const normalizedFood = normalizeFood(newFood)

        try {
            storage.addFood(normalizedFood)
            Snackbar.show('저장 성공')
            form.reset()
            init()
        } catch (error) {
            console.error("저장 실패", error)
            Snackbar.show('저장 실패')
        }
    })

    // 음식카드 삭제/수정 이벤트
    foodList.addEventListener('click', event => {
        event.preventDefault()
        // 삭제 버튼
        const deleteButton = event.target.closest('.delete-btn')
        if(deleteButton) {
            const card = deleteButton.closest('.card')
            if (!card) return

            const foodId = card.dataset.id
            storage.removeFood(Number(foodId))
            init()
            return
        }

        // 수정 버튼
        const editButton = event.target.closest('.edit-btn')
        if (editButton) {
            const card = editButton.closest('.card')
            if (!card) return

            renderEditCard(card)
            return
        }

        // 저장 버튼
        const saveButton = event.target.closest('.save-btn')
        if (saveButton) {
            const card = saveButton.closest('.card')
            if (!card) return

            let updatedFood = {
                foodId: Number(card.dataset.id),
                name: card.querySelector('.card-name-input').value,
                carbs: card.querySelector('.carbs-input').value,
                protein: card.querySelector('.protein-input').value,
                fat: card.querySelector('.fat-input').value,
            }

            const errorMessage = validateFood(updatedFood)
            if (errorMessage) {
                Snackbar.show(errorMessage)
                return
            }
            const normalizedFood = normalizeFood(updatedFood)

            storage.updateFoods(normalizedFood)
            init()
        }
    })

    // TODO 유효성 검사
    const validateFood = ({ name, carbs, protein, fat }) => {
        if (!name || !name.trim()) return '음식 이름을 입력해주세요.'
        if (carbs === '' || protein === '' || fat === '') return '탄수화물, 단백질, 지방 값을 모두 입력해주세요.'

        if ([carbs, protein, fat].some(value => Number.isNaN(Number(value)))) {
            return '탄수화물, 단백질, 지방은 숫자여야 합니다.'
        }

        if ([carbs, protein, fat].some(value => Number(value) < 0)) {
            return '탄수화물, 단백질, 지방은 0 이상이어야 합니다.'
        }

        return null
    }

    const normalizeFood = (food) => ({
        ...food,
        name: food.name.trim(),
        carbs: Number(food.carbs),
        protein: Number(food.protein),
        fat: Number(food.fat),
    })

    const init = () => {
        foodList.innerHTML = ''
        nutritionData.reset()

        storagedData = storage.getAll()

        console.log('storagedData확인:: ',storagedData)

        storagedData.forEach((food, index) => {
            nutritionData.addEntry(food.carbs, food.protein, food.fat)
            foodCard(food, index)
        })
        render()
    }

    const renderTotalCalories = () => {
        totalCalories.textContent = nutritionData.getTotalCalories();
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

    const render = () => {
        renderChart();
        renderTotalCalories();
    }

    init()
}
