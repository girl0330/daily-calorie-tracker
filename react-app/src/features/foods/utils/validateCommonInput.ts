export const getRequiredInputErrorMessage = (fields: { value: string; message: string }[]) => {
  const emptyField = fields.find(field => isEmptyInput(field.value));

  return emptyField?.message ?? null;
};

export const isEmptyInput = (value: string) => {
  return value.trim().length === 0;
};
