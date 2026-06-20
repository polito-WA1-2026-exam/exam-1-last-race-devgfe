export function UserLoginRequestDTO(email, password){
    this.username = email;
    this.password = password;
}

export function UserResponseDTO(id, name, email){
    this.id = id;
    this.name = name;
    this.email = email;
}