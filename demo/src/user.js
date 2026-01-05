// User management module
export class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  getProfile() {
    return {
      name: this.name,
      email: this.email,
      memberSince: this.createdAt
    };
  }
}
