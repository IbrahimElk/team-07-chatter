export class JSonSet<T> extends Set {
  toJson() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [...this];
  }
}
