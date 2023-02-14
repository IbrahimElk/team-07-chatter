import Debug from 'debug';

const debug = Debug('chat-user: ');
import { emitKeypressEvents } from 'node:readline';

type keyInterface = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};
export class ClientUser {
  private name: string;
  private ngramMAP: Map<string, number>;
  private friendName: string;
  private CHATMODUS: boolean;
  private UninformativeKeys: string[];
  private timings: [string, number][];
  private pauseState: boolean;
  private chatFriendModus: string;
  constructor() {
    this.name = '';
    this.friendName = '';
    this.ngramMAP = new Map<string, number>();
    this.CHATMODUS = false;
    this.UninformativeKeys = ['\b', '\r'];
    this.timings = [];
    this.pauseState = true;
    this.chatFriendModus = '';

    emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    debug('ON');
    process.stdin.on('keypress', this.keypresscb);
  }
  public setName(nwname: string) {
    this.name = nwname;
  }
  public setFriendName(nwname: string) {
    this.friendName = nwname;
  }
  public setNgramMAP(ngram: Map<string, number>) {
    this.ngramMAP = ngram;
  }
  public setChatModus(value: boolean, friendname: string) {
    this.CHATMODUS = value;
    this.chatFriendModus = friendname;
  }
  public getName() {
    return this.name;
  }
  public getFriendName() {
    return this.friendName;
  }
  public getNgramMAP() {
    return new Map(this.ngramMAP);
  }
  public getChatModus(friend: string): boolean {
    return this.CHATMODUS && friend === this.chatFriendModus;
  }

  public getTiming() {
    return this.timings.map((e) => e);
  }
  public resumeKeydetection(): void {
    // debug('resumeKeydetection');

    this.timings = [];
    this.pauseState = false;
  }
  public keypresscb = (char: string, key: keyInterface) => {
    if (!this.pauseState) {
      // debug('HUHUUHH');
      // debug('char: ', char);
      let state = true;
      if (this.UninformativeKeys.includes(key.sequence)) {
        state = false;
      }
      if (state) {
        this.timings.push([key.sequence, Date.now()]);
      } else {
        this.timings.pop();
      }
    }
  };
  public pauseKeydetection(): void {
    // debug('pauseKeydetection');
    this.pauseState = true;
  }

  public getPauseState() {
    return this.pauseState;
  }
}
