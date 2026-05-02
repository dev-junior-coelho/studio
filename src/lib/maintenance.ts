/**
 * Configuração de manutenção do sistema
 * Mude `MAINTENANCE_MODE` para true para ativar o modo de manutenção
 */

export const MAINTENANCE_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  message: "ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO",
  subtitle: "O sistema voltará em breve. Obrigado pela paciência!",
};

export const isMaintenanceMode = (): boolean => {
  return MAINTENANCE_CONFIG.enabled;
};
