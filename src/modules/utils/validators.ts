// === CPF Validation ===
export const isValidCPF = (cpf: string): boolean => {
  if (!cpf || cpf.length !== 11) return false;

  // Reject CPFs with all identical digits (e.g., 11111111111)
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder: number;

  // First check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  // Second check digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;

  return remainder === parseInt(cpf.substring(10, 11));
};
