export default class NutritionData {
    constructor() {
        this.entries = []
    }

    addEntry(carbs, protein, fat) {
        const entry = {
            carbs: Number.parseInt(carbs, 10),
            protein: Number.parseInt(protein, 10),
            fat: Number.parseInt(fat, 10),
        }
        this.entries.push(entry)
    }

    getTotalCarbs() {
        let sumCarbs = 0
        this.entries.forEach(entry => {
            sumCarbs += entry.carbs
        })
        return sumCarbs
    }
    getTotalProtein() {
        let sumProtein = 0
        this.entries.forEach(entry => {
            sumProtein += entry.protein
        })
        return sumProtein
    }
    getTotalFat() {
        let sumFat = 0
        this.entries.forEach(entry => {
            sumFat += entry.fat
        })
        return sumFat
    }
    getTotalCalories() {
        return this.getTotalCarbs() * 4 + this.getTotalProtein() * 4 + this.getTotalFat() * 9
    }
}