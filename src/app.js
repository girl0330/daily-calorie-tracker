import foodStorage from './storage/FoodStorage.js'

export function initApp() {
    const form = document.querySelector('#create-form')
    const foodNameInput = document.querySelector('#create-name')
    const carbsInput = document.querySelector('#create-carbs')
    const proteinInput = document.querySelector('#create-protein')
    const fatInput = document.querySelector('#create-fat')

    const storage = new foodStorage()

    form.addEventListener('submit', event => {
        event.preventDefault()

        const newFood = {
            name: foodNameInput.value,
            carbs: carbsInput.value,
            protein: proteinInput.value,
            fat: fatInput.value
        }

        const foods = storage.add(newFood)

        console.log("저장 완료:", foods);
    })
}