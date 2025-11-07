// lib/discount-utils.ts
// Funções para calcular descontos automáticos de dependentes

import type { Produto } from './types';

/**
 * Obtém o número de dependentes grátis de um produto móvel
 * Usa o campo dependentesGratis do Firestore (preenchido pelo seed)
 * @param movelPrincipal Produto móvel principal
 * @returns Número de dependentes grátis (0 se não houver)
 */
export function extrairDependentesGratis(movelPrincipal: Produto | undefined): number {
  if (!movelPrincipal || movelPrincipal.tipo !== 'Movel') {
    return 0;
  }
  // Usa o campo dependentesGratis do Firestore (preenchido pelo seed-utils.ts)
  return movelPrincipal.dependentesGratis ?? 0;
}

/**
 * Calcula o preço de dependentes com desconto automático
 * @param movelPrincipal Produto de móvel principal selecionado
 * @param dependentesAdicionados Array de produtos Dependente Móvel adicionados
 * @returns Array com informações de cada dependente (quantos são grátis e quantos são pagos)
 */
export function calcularDescontoDependentes(
  movelPrincipal: Produto | undefined,
  dependentesAdicionados: Produto[]
): Array<{
  index: number;
  dependente: Produto;
  precoAplicado: number;
  isGratis: boolean;
  descricao: string;
}> {
  if (!movelPrincipal || movelPrincipal.tipo !== 'Movel') {
    // Se não há móvel principal, todos os dependentes são pagos
    return dependentesAdicionados.map((dep, index) => ({
      index,
      dependente: dep,
      precoAplicado: dep.precoMensal,
      isGratis: false,
      descricao: `Dependente ${index + 1}: R$ ${dep.precoMensal.toFixed(2)}`,
    }));
  }

  // Extrair quantidade de dependentes grátis do plano móvel (do Firestore)
  const dependentesGratis = extrairDependentesGratis(movelPrincipal);

  // Calcular qual é grátis e qual é pago
  return dependentesAdicionados.map((dep, index) => {
    const isGratis = index < dependentesGratis;
    const precoAplicado = isGratis ? 0 : dep.precoMensal;

    return {
      index,
      dependente: dep,
      precoAplicado,
      isGratis,
      descricao: isGratis
        ? `Dependente ${index + 1}: GRÁTIS (incluído no plano)`
        : `Dependente ${index + 1}: R$ ${dep.precoMensal.toFixed(2)}`,
    };
  });
}

/**
 * Calcula o total mensal incluindo descontos de dependentes
 * @param produtos Array com todos os produtos da oferta
 * @returns Total com descontos aplicados
 */
export function calcularTotalComDescontos(produtos: Produto[]): number {
  const movelPrincipal = produtos.find(p => p.tipo === 'Movel');
  const dependentes = produtos.filter(p => p.tipo === 'Dependente Móvel');

  // Calcular descontos
  const dependentesComDesconto = calcularDescontoDependentes(movelPrincipal, dependentes);

  // Somar preços com desconto dos dependentes
  const totalDependentes = dependentesComDesconto.reduce(
    (sum, item) => sum + item.precoAplicado,
    0
  );

  // Somar todos os outros produtos
  const totalOutrosProdutos = produtos
    .filter(p => p.tipo !== 'Dependente Móvel')
    .reduce((sum, p) => sum + p.precoMensal, 0);

  return totalOutrosProdutos + totalDependentes;
}

/**
 * Retorna um array de strings descrevendo o cálculo de dependentes
 * Útil para exibir na UI
 */
export function obterDescricaoDependentes(
  movelPrincipal: Produto | undefined,
  dependentesAdicionados: Produto[]
): string[] {
  if (!movelPrincipal || movelPrincipal.tipo !== 'Movel') {
    return dependentesAdicionados.map((dep, index) => 
      `Dependente ${index + 1}: R$ ${dep.precoMensal.toFixed(2).replace('.', ',')}`
    );
  }

  const resultado = calcularDescontoDependentes(movelPrincipal, dependentesAdicionados);
  return resultado.map(r => r.descricao.replace('.', ','));
}
