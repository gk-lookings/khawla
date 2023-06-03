
export function selectedCategory(body) {
    return { type: 'SELECTED_CATEGORY', category: body.category }
}