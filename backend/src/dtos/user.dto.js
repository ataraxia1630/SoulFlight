class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    // this.role = user.role;
    // this.createdAt = user.createdAt;
  }

  static fromModel(user) {
    return new UserDTO(user);
  }

  static fromList(users) {
    return users.map((u) => new UserDTO(u));
  }
}

module.exports = { UserDTO };
