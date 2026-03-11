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

        try {
            storage.add(newFood)

            // 성공하면 폼 초기화
            form.reset()
            console.log('저장 성공')

        } catch (error) {
            console.error("저장 실패", error)
        }
    })
}