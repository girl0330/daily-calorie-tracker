export const calculateCalories = (carbs = 0, protein = 0, fat = 0) => {
    return carbs * 4 + protein * 4 + fat * 9
}