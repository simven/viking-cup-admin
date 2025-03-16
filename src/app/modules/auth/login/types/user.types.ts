export interface Login {
    username: string;
    password: string;
}

export interface User {
    email: string;
    avatarPath: string;
    company: Company
}

export interface Company {
    id: number;
    code: string;
    name: string;
}
