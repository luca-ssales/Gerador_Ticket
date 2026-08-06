import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { fetchSettings, updateSettings } from '../api';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Erro ao salvar configurações no arquivo JSON');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="p-8 text-center text-[#434655]">
        Carregando configurações de <code>data/settings.json</code>...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0b1c30]">Configurações do Sistema</h1>
        <p className="text-xs text-[#434655] mt-1">
          Gerencie os parâmetros globais da plataforma armazenados em <code className="text-[#004ac6]">data/settings.json</code>.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Database Status & General Settings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* JSON DB Persistence Info Card */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col gap-4 shadow-2xs">
            <div className="flex items-center gap-2 text-[#004ac6]">
              <span className="material-symbols-outlined text-[22px]">database</span>
              <h2 className="font-bold text-base text-[#0b1c30]">Armazenamento e Banco de Dados</h2>
            </div>
            <p className="text-xs text-[#434655] leading-relaxed">
              O sistema utiliza estritamente o banco de dados baseado em arquivos <strong>JSON locais</strong> (<code className="bg-[#eff4ff] px-1.5 py-0.5 rounded text-[#004ac6]">data/*.json</code>) sem dependência de bancos SQL ou noSQL externos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f8f9ff] p-4 rounded-lg border border-[#c3c6d7]">
              <div>
                <span className="text-[#737686] block text-[11px]">Tipo de Banco:</span>
                <span className="font-bold text-[#0b1c30]">{settings.dbStorageType}</span>
              </div>
              <div>
                <span className="text-[#737686] block text-[11px]">Diretório de Persistência:</span>
                <span className="font-bold text-[#004ac6]">/data/</span>
              </div>
              <div>
                <span className="text-[#737686] block text-[11px]">Arquivos Ativos:</span>
                <span className="font-bold text-[#0b1c30]">tickets.json, comments.json, users.json, stats.json, settings.json</span>
              </div>
              <div>
                <span className="text-[#737686] block text-[11px]">Idioma Principal:</span>
                <span className="font-bold text-[#0b1c30]">Português (Brasil) - pt-BR</span>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col gap-4 shadow-2xs">
            <h2 className="font-bold text-base text-[#0b1c30] border-b border-[#c3c6d7] pb-3">
              Identificação do Portal
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Nome do Sistema</label>
                <input
                  type="text"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                  className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0b1c30]">Subtítulo do Portal</label>
                <input
                  type="text"
                  value={settings.portalSubtitle}
                  onChange={(e) => setSettings({ ...settings, portalSubtitle: e.target.value })}
                  className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#0b1c30]">E-mail do Administrador</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rules & SLA Config */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col gap-4 shadow-2xs">
            <h2 className="font-bold text-base text-[#0b1c30] border-b border-[#c3c6d7] pb-3">
              Regras e SLA
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">SLA - Resposta Inicial (Horas)</label>
              <input
                type="number"
                value={settings.slaResponseHours}
                onChange={(e) => setSettings({ ...settings, slaResponseHours: parseInt(e.target.value) || 2 })}
                className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">SLA - Resolução Definitiva (Horas)</label>
              <input
                type="number"
                value={settings.slaResolutionHours}
                onChange={(e) => setSettings({ ...settings, slaResolutionHours: parseInt(e.target.value) || 24 })}
                className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs focus:outline-none focus:border-[#004ac6]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Prioridade Padrão para Novos Chamados</label>
              <select
                value={settings.defaultPriority}
                onChange={(e) => setSettings({ ...settings, defaultPriority: e.target.value })}
                className="px-3 py-2 border border-[#c3c6d7] rounded-lg text-xs bg-white focus:outline-none focus:border-[#004ac6]"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0b1c30]">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  className="rounded text-[#004ac6] focus:ring-[#004ac6]"
                />
                Notificações ativas no sistema
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0b1c30]">
                <input
                  type="checkbox"
                  checked={settings.autoAssign}
                  onChange={(e) => setSettings({ ...settings, autoAssign: e.target.checked })}
                  className="rounded text-[#004ac6] focus:ring-[#004ac6]"
                />
                Atribuição automática de chamados
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-4 w-full bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-sm"
            >
              {isSaving ? 'Gravando em JSON...' : 'Salvar Alterações'}
            </button>

            {saveSuccess && (
              <div className="p-2.5 bg-[#dcfce7] text-[#166534] rounded-lg text-xs text-center font-semibold animate-fade-in">
                ✓ Configurações gravadas com sucesso em data/settings.json!
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
