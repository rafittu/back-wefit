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

// === CNPJ Validation ===
export const isValidCNPJ = (cnpj: string): boolean => {
  if (!cnpj || cnpj.length !== 14) return false;

  // Reject CNPJs with all identical digits
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, multipliers: number[]): number => {
    const sum = base
      .split('')
      .reduce((acc, num, idx) => acc + parseInt(num) * multipliers[idx], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondMultipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const base = cnpj.substring(0, 12);
  const firstCheckDigit = calcCheckDigit(base, firstMultipliers);
  const secondCheckDigit = calcCheckDigit(
    base + firstCheckDigit,
    secondMultipliers,
  );

  return (
    firstCheckDigit === parseInt(cnpj[12]) &&
    secondCheckDigit === parseInt(cnpj[13])
  );
};
