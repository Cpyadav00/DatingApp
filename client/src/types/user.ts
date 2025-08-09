export type User ={
    id:string;
    email:string;
    displayName:string;
    imageUrl?:string;
    token:string;
    roles:string[];
}

export type LoginCreds={
        email:string;
        password:string;
}
export type RegisterCreds={
        email:string;
        displayName:string;
       password:string;
       dateOfBirth:string;
       gender:string;
       city:string;
       country:string;
}