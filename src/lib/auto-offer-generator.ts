import { produtosBandaLarga } from '@/data/seedBandaLarga';
import { produtosTV } from '@/data/seedTV';
import { produtosOpcionais } from '@/data/seedOpcionais';
import { regioes } from '@/data/seedRegioes';
import type { Produto, Gastos } from '@/lib/types';

export interface AutoOfferResult {
    success: boolean;
    products: Produto[];
    errors: string[];
    warnings: string[];
}

/**
 * Mapear cidade → regiaoId
 */
function getRegiaoIdByCity(city: string): string | null {
    for (const regiao of regioes) {
        if (regiao.cidades.includes(city)) {
            return regiao.id;
        }
    }
    return null; // Cidade não encontrada
}

/**
 * Buscar produtos por região e tipo
 * Retorna produtos brutos do seed (sem id/fidelidade ainda)
 */
function getProductsByRegionAndType(regiaoId: string, tipo: string): any[] {
    let allProducts: any[] = [];

    // Mapear tipo para o dataset correto
    if (tipo === 'Banda Larga' || tipo === 'Internet') {
        allProducts = produtosBandaLarga as any[];
    } else if (tipo === 'TV') {
        // Para TV, buscar em TODOS os produtos de TV (Cabeada, Box, APP)
        allProducts = produtosTV as any[];
    } else if (tipo === 'Fixo') {
        // Para Fixo, buscar apenas produtos com tipo exato "Fixo"
        allProducts = (produtosOpcionais as any[]).filter(p => p.tipo === 'Fixo');
    } else if (tipo === 'WiFi Mesh') {
        // Para WiFi Mesh, buscar em Opcionais
        allProducts = (produtosOpcionais as any[]).filter(p => p.tipo === 'Opcional' && p.nome.includes('Mesh'));
    }

    // Filtrar por região
    const regionProducts = allProducts.filter(p => p.regiaoId === regiaoId);
    const nationalProducts = allProducts.filter(p => p.regiaoId === 'nacional');

    // SEMPRE incluir produtos nacionais junto com regionais
    // Isso permite que produtos nacionais mais baratos sejam selecionados
    const combinedProducts = [...regionProducts, ...nationalProducts];

    // Se não houver nenhum produto, retornar vazio
    return combinedProducts.length > 0 ? combinedProducts : [];
}

/**
 * Algoritmo de seleção: prioriza produto com preço <= maxPrice
 * Ordena por preço decrescente (pegar o mais próximo do valor atual)
 * Se múltiplos com mesmo preço, prioriza por mais benefícios
 * 
 * FALLBACK: Se não houver produtos <= maxPrice, retorna o mais barato disponível
 */
function selectBestProduct(products: any[], maxPrice: number): any | null {
    if (products.length === 0) return null;

    // Filtrar produtos com preço <= maxPrice (ideal)
    let affordableProducts = products.filter(p => p.precoMensal <= maxPrice);

    // FALLBACK: Se não houver produtos na faixa, pegar o mais barato disponível
    if (affordableProducts.length === 0) {
        affordableProducts = products.slice(); // Copiar todos os produtos

        // Ordenar por preço crescente (mais barato primeiro)
        affordableProducts.sort((a, b) => a.precoMensal - b.precoMensal);

        return affordableProducts[0]; // Retornar o mais barato
    }

    // Ordenar por preço CRESCENTE (pegar o mais barato)
    // Se empate, ordenar por quantidade de benefícios (mais benefícios = melhor)
    const sorted = affordableProducts.sort((a, b) => {
        if (a.precoMensal !== b.precoMensal) {
            return a.precoMensal - b.precoMensal; // CRESCENTE - mais barato primeiro
        }
        return b.beneficios.length - a.beneficios.length; // Mais benefícios primeiro
    });

    return sorted[0];
}

/**
 * Função principal de geração automática de oferta
 */
export function generateAutoOffer(
    gastos: Gastos,
    selectedCity: string | null
): AutoOfferResult {
    const result: AutoOfferResult = {
        success: false,
        products: [],
        errors: [],
        warnings: []
    };

    // Validação: cidade selecionada
    if (!selectedCity) {
        result.errors.push('Nenhuma cidade selecionada.');
        return result;
    }

    // Mapear cidade → regiaoId
    const regiaoId = getRegiaoIdByCity(selectedCity);
    if (!regiaoId) {
        result.errors.push(`Cidade "${selectedCity}" não encontrada nas regiões cadastradas.`);
        return result;
    }

    // Verificar se há pelo menos um gasto informado
    const hasAnyGasto = gastos.tv > 0 || gastos.internet > 0 || gastos.fixo > 0 || gastos.wifiMesh > 0;
    if (!hasAnyGasto) {
        result.errors.push('Nenhum gasto informado. Preencha ao menos um valor em "Gastos Atuais".');
        return result;
    }

    // Processar cada categoria de gasto
    const categories: Array<{ tipo: string; maxPrice: number; label: string }> = [
        { tipo: 'TV', maxPrice: gastos.tv, label: 'TV' },
        { tipo: 'Banda Larga', maxPrice: gastos.internet, label: 'Internet' },
        { tipo: 'Fixo', maxPrice: gastos.fixo, label: 'Fixo' },
        { tipo: 'WiFi Mesh', maxPrice: gastos.wifiMesh, label: 'WiFi Mesh' }
    ];

    for (const category of categories) {
        if (category.maxPrice <= 0) continue; // Ignorar categorias sem gasto

        const availableProducts = getProductsByRegionAndType(regiaoId, category.tipo);

        let selectedProduct;

        // REGRA ESPECIAL: TV sempre migra para Claro TV+ completo
        if (category.tipo === 'TV') {
            // Filtrar apenas pacotes completos (Claro TV+ com Soundbox, Box ou HD)
            const completePackages = availableProducts.filter(p =>
                p.nome.includes('Claro TV+') &&
                (p.nome.includes('Soundbox') || p.nome.includes('Box') || p.nome.includes('HD'))
            );

            if (completePackages.length > 0) {
                // Ordenar por preço crescente e pegar o mais barato
                const sorted = completePackages.sort((a, b) => a.precoMensal - b.precoMensal);
                selectedProduct = sorted[0];

                // Adicionar aviso se o pacote completo custar mais que o informado
                if (selectedProduct.precoMensal > category.maxPrice) {
                    result.warnings.push(
                        `TV: Upgrade para ${selectedProduct.nome} por R$ ${selectedProduct.precoMensal.toFixed(2)} (pacote completo recomendado).`
                    );
                }
            } else {
                // Fallback: usar lógica padrão se não houver Claro TV+
                selectedProduct = selectBestProduct(availableProducts, category.maxPrice);
            }
        } else if (category.tipo === 'Banda Larga') {
            // Usar lógica padrão
            selectedProduct = selectBestProduct(availableProducts, category.maxPrice);
        } else {
            // Para outras categorias, usar lógica padrão
            selectedProduct = selectBestProduct(availableProducts, category.maxPrice);
        }

        if (selectedProduct) {
            // Avisar se usou fallback (produto acima do preço)
            if (selectedProduct.precoMensal > category.maxPrice) {
                result.warnings.push(
                    `${category.label}: Produto mais barato disponível custa R$ ${selectedProduct.precoMensal.toFixed(2)} (acima dos R$ ${category.maxPrice.toFixed(2)} informados).`
                );
            }

            // Adicionar produto com ID único para permitir múltiplas adições
            const productWithUniqueId = {
                ...selectedProduct,
                id: `${selectedProduct.id || selectedProduct.nome}-auto-${Date.now()}-${Math.random()}`
            };
            result.products.push(productWithUniqueId);
        } else {
            result.warnings.push(
                `Nenhum produto de ${category.label} encontrado com valor ≤ R$ ${category.maxPrice.toFixed(2)} na região "${regiaoId}".`
            );
        }
    }

    // Processar "A la carte" (outros) - buscar por NOME, priorizando ANUAIS
    if (gastos.outros && gastos.outros.length > 0) {
        gastos.outros.forEach(item => {
            if (item.value > 0 && item.name) {
                const optionalProducts = (produtosOpcionais as any[]).filter(p =>
                    p.tipo === 'Opcional' && p.regiaoId === 'nacional'
                );

                if (optionalProducts.length > 0) {
                    // Buscar por NOME (não por preço!)
                    // Remover sufixos (Mensal) e (Anual) para encontrar ambas as versões
                    let searchTerm = item.name.toLowerCase();
                    searchTerm = searchTerm.replace(/\s*\(mensal\)|\(anual\)/gi, '').trim();

                    const matchingProducts = optionalProducts.filter(p =>
                        p.nome.toLowerCase().includes(searchTerm)
                    );

                    if (matchingProducts.length > 0) {
                        // PRIORIZAR PRODUTOS ANUAIS - ordenar para garantir
                        const annualMatches = matchingProducts.filter(p => p.precoAnual && p.precoAnual > 0);
                        const monthlyMatches = matchingProducts.filter(p => !p.precoAnual || p.precoAnual === 0);

                        let selectedOptional = annualMatches.length > 0 ? annualMatches[0] : matchingProducts[0];

                        const isAnnual = selectedOptional.precoAnual && selectedOptional.precoAnual > 0;
                        if (isAnnual) {
                            result.warnings.push(
                                `${item.name}: "${selectedOptional.nome}" R$ ${selectedOptional.precoMensal.toFixed(2)}/mês (total anual: R$ ${selectedOptional.precoAnual.toFixed(2)})`
                            );
                        }

                        result.products.push({
                            ...selectedOptional,
                            id: `${selectedOptional.nome}-${Date.now()}-${Math.random()}`
                        });
                    } else {
                        result.warnings.push(`${item.name}: Produto não encontrado no catálogo.`);
                    }
                }
            }
        });
    }

    // Processar "Pontos Adicionais de TV"
    if (gastos.tvPontosAdicionais && gastos.tvPontosAdicionais > 0) {
        const pontosAdicionaisProducts = (produtosOpcionais as any[]).filter(p =>
            p.tipo === 'Ponto Adicional' && p.regiaoId === 'nacional'
        );

        if (pontosAdicionaisProducts.length > 0) {
            // Ordenar por preço crescente e pegar o mais barato
            pontosAdicionaisProducts.sort((a, b) => a.precoMensal - b.precoMensal);
            const cheapestPonto = pontosAdicionaisProducts[0];

            // Adicionar a quantidade especificada
            for (let i = 0; i < gastos.tvPontosAdicionais; i++) {
                result.products.push({
                    ...cheapestPonto,
                    id: `${cheapestPonto.nome}-ponto-${Date.now()}-${i}-${Math.random()}`
                });
            }

            result.warnings.push(
                `Pontos Adicionais: ${gastos.tvPontosAdicionais}x "${cheapestPonto.nome}" adicionados (R$ ${cheapestPonto.precoMensal.toFixed(2)}/un).`
            );
        } else {
            result.warnings.push('Nenhum produto de Ponto Adicional encontrado no catálogo.');
        }
    }

    // Verificar se ao menos um produto foi adicionado
    if (result.products.length === 0) {
        result.errors.push('Nenhum produto pôde ser adicionado. Verifique os valores informados ou a região selecionada.');
        return result;
    }

    result.success = true;
    return result;
}
