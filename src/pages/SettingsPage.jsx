import React, { useState } from 'react';
import { Settings, RefreshCw, HardDrive, Check, Camera, Building, ShieldCheck } from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { FormField, FormInput } from '../components/common/FormField';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useStudioData();
  const toast = useToast();

  const [studioName, setStudioName] = useState(settings.studioName || '');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [city, setCity] = useState(settings.city || '');
  const [email, setEmail] = useState(settings.contactEmail || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [taxRate, setTaxRate] = useState(settings.taxRate ?? 18);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sync state if settings reset or changed externally
  React.useEffect(() => {
    setStudioName(settings.studioName || '');
    setTagline(settings.tagline || '');
    setCity(settings.city || '');
    setEmail(settings.contactEmail || '');
    setPhone(settings.phone || '');
    setTaxRate(settings.taxRate ?? 18);
  }, [settings]);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    updateSettings({
      studioName: studioName.trim(),
      tagline: tagline.trim(),
      city: city.trim(),
      contactEmail: email.trim(),
      phone: phone.trim(),
      taxRate: Number(taxRate) >= 0 ? Number(taxRate) : 18,
    });
    toast.success('Settings Saved', 'Studio preferences updated across all dependent views.');
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      resetDemoData();
      setIsResetting(false);
      setIsResetConfirmOpen(false);
      toast.success('Demo Data Reset', 'Sample data restored to clean seed state.');
    }, 400);
  };

  const storagePercent = Math.round((settings.storageQuotaUsedGB / settings.storageQuotaTotalGB) * 100);

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Studio Preferences & Configuration"
        subtitle="Manage studio branding, tax invoice presets, storage capacity, and demo database state."
      />

      {/* Studio Profile Form */}
      <form onSubmit={handleSavePreferences}>
        <Card>
          <CardHeader
            title="Studio Profile & Branding"
            subtitle="Public studio identity shown on client invoices, header desks, and digital exports"
          />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Studio Brand Name">
                <FormInput
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="e.g. Lumière Heritage Studio"
                />
              </FormField>

              <FormField label="Editorial Tagline">
                <FormInput
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Fine-Art Wedding Photography"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Studio Locations / Base Cities">
                <FormInput
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai & Udaipur, India"
                />
              </FormField>

              <FormField label="Primary Contact Email">
                <FormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@studio.com"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <FormField label="Official Phone / Studio Desk">
                <FormInput
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 (022) 4892-1920"
                />
              </FormField>

              <FormField
                label="Sample Invoice Tax / GST Rate (%)"
                hint="Configurable demo tax rate used for itemized client invoices (default 18%)."
              >
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="18"
                />
              </FormField>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Cloud Storage Quota */}
      <Card>
        <CardHeader
          title="Cloud Storage & Digital Archives"
          subtitle="Archive capacity for TIFF masters, Sony ARW, and digital master exports"
          action={
            <Badge variant="sage" size="sm">
              {settings.storageQuotaUsedGB} GB / {settings.storageQuotaTotalGB} GB ({storagePercent}%)
            </Badge>
          }
        />
        <CardContent>
          <div className="w-full h-2.5 bg-ivory-200 rounded-full overflow-hidden">
            <div className="h-full bg-terracotta rounded-full" style={{ width: `${storagePercent}%` }} />
          </div>
          <p className="text-xs text-charcoal-500 mt-2">
            Storage allocated for client digital archives and master export repositories.
          </p>
        </CardContent>
      </Card>

      {/* Demo Data Management */}
      <Card className="border-rose-border/60">
        <CardHeader
          title="Demo Data & Browser Storage"
          subtitle="Reset sample records or clear browser-local modifications"
        />
        <CardContent>
          <div className="p-4 bg-ivory-50 rounded-xl border border-border/60 text-xs text-charcoal-600 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-semibold text-charcoal">
              <ShieldCheck className="w-4 h-4 text-sage" />
              <span>Browser-Local Demo Persistence</span>
            </div>
            <p>
              StudioFlow runs entirely client-side using localStorage. Any clients, events, tasks, or payments you add or update persist only in your current browser session.
            </p>
            <p>
              If you wish to restore all sample records (such as Sharma Wedding, Lake Pichola Sangeet, and Tara Sutaria lookbook) back to their fresh seeded state, click below.
            </p>
          </div>

          <div className="mt-4">
            <Button
              variant="destructive"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => setIsResetConfirmOpen(true)}
            >
              Reset Demo Data to Factory Seed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleReset}
        isLoading={isResetting}
        title="Restore Initial Sample Records?"
        message="This will overwrite any local changes and restore the realistic demonstration dataset."
        confirmLabel="Confirm Reset"
        isDestructive={true}
      />
    </div>
  );
}
