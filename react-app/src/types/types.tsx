// TODO: 이후 Food 입력/렌더링에서 사용할 도메인 타입
type MealType = 'breakfast' | 'lunch' | 'dinner'

type Food = {
    id: number
    name: string
    carbs: number
    protein: number
    fat: number
    date: string
    mealType: MealType
}