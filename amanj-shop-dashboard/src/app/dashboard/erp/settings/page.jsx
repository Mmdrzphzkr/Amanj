'use client';

import { useState, useEffect } from 'react';
import { useErp } from '@/context/ErpContext';
import { getSettingsFromStrapi, updateSettingsInStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import { Input, Textarea } from '@/components/erp/Input';
import Button from '@/components/erp/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { state, dispatch } = useErp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { settings } = state;

  useEffect(() => {
    (async () => {
      try {
        const strapiSettings = await getSettingsFromStrapi();
        if (strapiSettings) {
          dispatch({ type: 'SET_SETTINGS', payload: strapiSettings });
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  const updateSetting = (key, value) => {
    dispatch({ type: 'SET_SETTINGS', payload: { [key]: value } });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettingsInStrapi(settings);
      toast.success('تنظیمات در استرپی ذخیره شد');
    } catch (e) {
      toast.success('تنظیمات به صورت محلی ذخیره شد');
    }
    finally { setSaving(false); }
  };

  const handleReset = () => {
    if (window.confirm('آیا از بازنشانی کامل سیستم اطمینان دارید؟ تمام داده‌های محلی حذف خواهند شد.')) {
      localStorage.removeItem('erp_data');
      window.location.reload();
    }
  };

  if (loading) {
    return <div className="dashboard-loading"><div className="dashboard-spinner" /></div>;
  }

  return (
    <div>
      <PageHeader title="تنظیمات سیستم" subtitle="ERP • تنظیمات" />

      <div className="form-grid">
        <div className="panel-card">
          <div className="panel-card__header">🏢 اطلاعات شرکت</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="نام شرکت" value={settings.companyName} onChange={(e) => updateSetting('companyName', e.target.value)} />
            <Input label="لوگو (آدرس URL)" value={settings.companyLogo} onChange={(e) => updateSetting('companyLogo', e.target.value)} />
            <Textarea label="آدرس" value={settings.address} onChange={(e) => updateSetting('address', e.target.value)} />
            <Input label="تلفن" value={settings.phone} onChange={(e) => updateSetting('phone', e.target.value)} />
          </div>
        </div>
        <div className="panel-card">
          <div className="panel-card__header">⚖️ اطلاعات حقوقی</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="شناسه ملی" value={settings.nationalId} onChange={(e) => updateSetting('nationalId', e.target.value)} />
            <Input label="کد اقتصادی" value={settings.economicCode} onChange={(e) => updateSetting('economicCode', e.target.value)} />
            <Input label="شماره ثبت" value={settings.registrationNumber} onChange={(e) => updateSetting('registrationNumber', e.target.value)} />
          </div>
        </div>
        <div className="panel-card">
          <div className="panel-card__header">📄 تنظیمات فاکتور</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="درصد مالیات" type="number" value={settings.taxPercentage} onChange={(e) => updateSetting('taxPercentage', Number(e.target.value))} />
            <Input label="واحد پول" value={settings.currency} onChange={(e) => updateSetting('currency', e.target.value)} />
            <Input label="پیشوند فاکتور فروش" value={settings.invoicePrefix} onChange={(e) => updateSetting('invoicePrefix', e.target.value)} />
            <Input label="پیشوند فاکتور تعمیر" value={settings.repairPrefix} onChange={(e) => updateSetting('repairPrefix', e.target.value)} />
          </div>
        </div>
        <div className="panel-card">
          <div className="panel-card__header">⚙️ سیستم</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label className="label">حالت تاریک</label>
              <button onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })} style={{
                padding: '10px 18px', borderRadius: 'var(--radius-md)',
                background: state.darkMode ? 'var(--accent)' : 'var(--bg-hover)',
                color: state.darkMode ? '#0d0f14' : 'var(--text-primary)',
                border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
              }}>{state.darkMode ? '🌙 حالت تاریک فعال' : '☀️ حالت روشن'}</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="label">اتصال به استرپی</label>
              <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)' }}>
                {process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Button variant="danger" onClick={handleReset}>⚠️ بازنشانی داده‌های محلی</Button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'در حال ذخیره...' : '💾 ذخیره تنظیمات در استرپی'}
        </Button>
      </div>
    </div>
  );
}
