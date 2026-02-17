import type { Gastos } from '@/lib/types';

/**
 * Extrai velocidade de internet de string
 * @param pacote ex: "350 Megas", "1 Giga", "500 mega"
 * @returns Velocidade em Mbps ou null
 */
export function parseInternetSpeed(pacote: string): number | null {
    if (!pacote) return null;

    const match = pacote.match(/(\d+)\s*(megas?|gigas?|mb|gb)/i);
    if (!match) return null;

    let speed = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    // Converter Giga para Mega
    if (unit.includes('giga') || unit.includes('gb')) {
        speed *= 1000;
    }

    return speed;
}

/**
 * Detecta se TV é pacote básico/mix vs completo
 * @param pacote ex: "MIX HD", "INICIAL HD", "Claro TV+"
 * @returns true se for pacote básico
 */
export function isTVBasic(pacote: string): boolean {
    if (!pacote) return true; // Assume básico se não especificado

    const basicKeywords = ['mix', 'inicial', 'hd', 'básico', 'basico'];
    const pacoteLower = pacote.toLowerCase();

    return basicKeywords.some(keyword => pacoteLower.includes(keyword));
}

/**
 * Detecta tipo de Fixo
 * @param pacote ex: "Ilimitado Brasil", "Ilimitado Mundo"
 * @returns Tipo do pacote fixo
 */
export function getFixoType(pacote: string): 'mundo' | 'brasil' | 'unknown' {
    if (!pacote) return 'unknown';

    const pacoteLower = pacote.toLowerCase();

    if (pacoteLower.includes('mundo')) return 'mundo';
    if (pacoteLower.includes('brasil')) return 'brasil';

    return 'unknown';
}

/**
 * Identifica se produto de internet é upgrade baseado em velocidade
 * @param productName Nome do produto (ex: "BL 750 Mega (Combo)")
 * @param currentPackage Pacote atual do cliente (ex: "350 Megas")
 * @returns true se produto é upgrade
 */
export function isInternetUpgrade(productName: string, currentPackage?: string): boolean {
    if (!currentPackage) return true; // Se não tem pacote atual, qualquer um é "upgrade"

    const currentSpeed = parseInternetSpeed(currentPackage);
    const productSpeed = parseInternetSpeed(productName);

    if (!currentSpeed || !productSpeed) return true;

    return productSpeed >= currentSpeed;
}
