export default class FoodStorage  {
    constructor(key = 'foods') {
        this.key = key
    }

    getAll() {
        const data = localStorage.getItem(this.key)
        return data ? JSON.parse(data) : []
    }

    addFood(food) {
        const storedFoods = localStorage.getItem(this.key)
        const foods = storedFoods ? JSON.parse(storedFoods) : []

        foods.push(food)
        localStorage.setItem(this.key, JSON.stringify(foods))
    }


    updateFoods(updatedFood) {
        const storedFoods = localStorage.getItem(this.key)
        const foods = storedFoods ? JSON.parse(storedFoods) : []

        const newFoods = foods.map(food => {
            return food.foodId === updatedFood.foodId ? updatedFood : food
        })

        localStorage.setItem(this.key, JSON.stringify(newFoods))
    }

}