//Author: Barteld Van Nieuwenhove
//Date: 2022/11/17

import type { User } from '../user/user.js';
import { Channel } from './channel.js';

export class DirectMessageChannel extends Channel {
  constructor(name: string, user1: User, user2: User) {
    super(name);
    this.users.add(user1.getUUID());
    this.users.add(user2.getUUID());
    user1.addChannel(this);
    user2.addChannel(this);
  }
}
