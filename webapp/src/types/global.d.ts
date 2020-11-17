interface Window {
  room: any; // Jitsi
}

type AtLeastOne<T> = Partial<T> & { [K in keyof T]: Pick<T, K> }[keyof T];
