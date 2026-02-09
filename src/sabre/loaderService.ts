export const loadSabreService = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const req = (window as any).require;

    if (!req) {
      reject(new Error('RequireJS is not available (not running in SRW)'));
      return;
    }

    req(['sabre/Service'], (Service: any) => {
      resolve(Service);
    });
  });
}
