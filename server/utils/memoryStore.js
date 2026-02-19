class MemoryStore {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async createUser(userData) {
    const id = this.nextId++;
    const user = {
      id: id.toString(),
      email: userData.email,
      password: userData.password, // In production, this would be hashed
      favorites: [],
      watchlist: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id.toString(), user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async updateUserFavorites(userId, favorites) {
    const user = this.users.get(userId);
    if (user) {
      user.favorites = favorites;
      user.updatedAt = new Date();
      return user;
    }
    return null;
  }

  async updateUserWatchlist(userId, watchlist) {
    const user = this.users.get(userId);
    if (user) {
      user.watchlist = watchlist;
      user.updatedAt = new Date();
      return user;
    }
    return null;
  }
}

module.exports = new MemoryStore();
