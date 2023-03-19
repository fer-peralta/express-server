export const convertToDto = (data, dtoModel) => {
    if (Array.isArray(data)) {
        const newData = data.map(data => new dtoModel(data))
        return newData
    } else {
        const newData = new dtoModel(data)
        return newData
    }
}