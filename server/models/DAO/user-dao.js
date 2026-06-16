export function UserDAO(id, name, email, password, salt){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.salt = salt;
}