/**
 * Creates a file from a stream of data.
 * @param data - The stream of data to create a file from.
 * @returns A Promise resolving to a Buffer representing the created file.
 */
export const createFile = async (
  data: NodeJS.ReadableStream,
): Promise<Buffer> => {
  // Read the stream data and concatenate all chunks into a single Buffer
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    data.on('data', (chunk: Buffer) => chunks.push(chunk));
    data.on('end', () => resolve(Buffer.concat(chunks)));
    data.on('error', (err: Error) => reject(err));
  });
};
