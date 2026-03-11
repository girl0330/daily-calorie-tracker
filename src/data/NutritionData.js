export default class NutritionData {
    constructor() {
        this.food = []
    }

    addFood(carbs, protein, fat) {
        const entry = {
            carbs: Number.parseInt(carbs, 10),
            protein: Number.parseInt(protein, 10),
            fat: Number.parseInt(fat, 10),
        }

        this.food.push(entry)
    }

    getTotalCarbs() {
        let sumCarbs = 0
        this.food.forEach(food => {
            sumCarbs += food.carbs
        })
        return sumCarbs
    }
    getTotalProtein() {
        let sumProtein = 0
        this.food.forEach(food => {
            sumProtein += food.protein
        })
        return sumProtein
    }
    getTotalFat() {
        let sumFat = 0
        this.food.forEach(food => {
            sumFat += food.fat
        })
        return sumFat
    }
    getTotalCalories() {
        return this.getTotalCarbs() * 4 + this.getTotalProtein() * 4 + this.getTotalFat() * 9
    }
}