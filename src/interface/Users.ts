type User = {
  id: number;
  username: string;
  displayName: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updateAt: Date;
  email: string;
  email_verified: Date;
  image: string;
  bidder: string;
};

// const userMap = new Map<string, User>();

export = User;
