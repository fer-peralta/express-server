class UserDto {
    constructor({ name, username }) {
        this.name = name
        this.email = username
    }
}

export const convertToDto = (users) => {
    if (Array.isArray(users)) {
        const newData = users.map(user => new UserDto(user))
        return newData
    } else {
        const newData = new UserDto(users)
        return newData
    }
}