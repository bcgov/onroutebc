export const readStreamToString = async (
  stream: NodeJS.ReadableStream,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    stream.setEncoding('utf8');

    let data = '';

    stream.on('data', (chunk: string) => {
      data += chunk;
    });

    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
};
