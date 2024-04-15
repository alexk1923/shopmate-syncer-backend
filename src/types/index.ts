export type UserCreation = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    birthday: string;
    password: string;
}

export type UserUpdate = {
    firstName?: string;
    lastName?: string;
    birthday: string;
}
