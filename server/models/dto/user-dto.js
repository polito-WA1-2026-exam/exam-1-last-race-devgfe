export function UserLoginRequestDTO(email, password){
    this.email = email;
    this.password = password;
}

export function UserResponseDTO(id, name, email, best_score = null){
    this.id = id;
    this.name = name;
    this.email = email;
    this.best_score = best_score;
}