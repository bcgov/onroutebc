import { useEffect, useState } from "react";

import { areOrderedSequencesEqual } from "../helpers/equality";

/**
 * Hook that memoizes a sequence of objects.
 * The memoized sequence only changes when the size or order of items in the sequence changes.
 * eg. If sequence === [{a: 1}, {a: 2}], and later [{a: 2}, {a: 1}] is passed in,
 * the hook returns the updated sequence [{a: 2}, {a: 1}].
 * @param sequence Sequence of objects
 * @param equalFn Function that determines whether or not two objects of the sequence are equal
 * @returns Memoized sequence of objects
 */
export const useMemoizedSequence = <T>(
  sequence: T[],
  equalFn: (item1: T, item2: T) => boolean,
) => {
  const [sequenceItems, setSequenceItems] = useState<T[]>(sequence);

  useEffect(() => {
    if (!areOrderedSequencesEqual(
      sequenceItems,
      sequence,
      equalFn,
    )) {
      setSequenceItems(sequence);
    }
  }, [sequence]);

  return sequenceItems;
};
