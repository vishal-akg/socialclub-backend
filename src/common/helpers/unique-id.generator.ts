import ShortUniqueId from 'short-unique-id';

export const numericUniqueId = (length = 12) => {
  const uid = new ShortUniqueId({
    length,
    dictionary: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  });
  return uid();
};

export const uniqueId = (length = 10) => {
  const uid = new ShortUniqueId({ length });
  return uid();
};
