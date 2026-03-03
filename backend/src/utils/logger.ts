export const log = (message: string) => {
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  console.log(`[${time}]: ${message}`);
};
