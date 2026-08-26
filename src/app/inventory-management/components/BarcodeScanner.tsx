'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, Loader2, AlertCircle, ScanLine, CheckCircle2 } from 'lucide-react';

export interface ScannedProduct {
  barcode: string;
  name: string;
  image: string;
  category: string;
}

interface BarcodeScannerProps {
  onDetected: (product: ScannedProduct) => void;
  onClose: () => void;
}

type ScanState = 'scanning' | 'fetching' | 'found' | 'not_found' | 'error' | 'no_camera';

const categoryMap: Record<string, string> = {
  'beverages': 'مشروبات',
  'drinks': 'مشروبات',
  'waters': 'مشروبات',
  'snacks': 'وجبات خفيفة',
  'chips': 'وجبات خفيفة',
  'biscuits': 'وجبات خفيفة',
  'coffee': 'قهوة وشاي',
  'tea': 'قهوة وشاي',
  'oils': 'زيوت',
  'cereals': 'بقالة أساسية',
  'rice': 'بقالة أساسية',
  'sugar': 'بقالة أساسية',
  'canned': 'معلبات',
  'chocolates': 'حلويات',
  'sweets': 'حلويات',
  'dairy': 'ألبان',
  'milk': 'ألبان',
  'cleaning': 'منظفات',
  'detergents': 'منظفات',
};

function mapCategory(categories: string): string {
  if (!categories) return 'أخرى';
  const lower = categories.toLowerCase();
  for (const [key, val] of Object.entries(categoryMap)) {
    if (lower.includes(key)) return val;
  }
  return 'أخرى';
}

async function fetchProductFromOpenFoodFacts(barcode: string): Promise<ScannedProduct | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;
    const p = data.product;
    const name =
      p.product_name_ar ||
      p.product_name ||
      p.generic_name_ar ||
      p.generic_name ||
      '';
    if (!name) return null;
    const image = p.image_front_url || p.image_url || '';
    const rawCat = p.categories || p.categories_tags?.join(',') || '';
    const category = mapCategory(rawCat);
    return { barcode, name, image, category };
  } catch {
    return null;
  }
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, setState] = useState<ScanState>('scanning');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManual, setShowManual] = useState(false);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const handleFetch = useCallback(async (barcode: string) => {
    setState('fetching');
    setScannedBarcode(barcode);
    stopCamera();
    const product = await fetchProductFromOpenFoodFacts(barcode);
    if (product) {
      setScannedProduct(product);
      setState('found');
    } else {
      setState('not_found');
    }
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Try BarcodeDetector API
      if ('BarcodeDetector' in window) {
        detectorRef.current = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
        });

        scanIntervalRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detectorRef.current.detect(videoRef.current);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              if (code) {
                if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
                await handleFetch(code);
              }
            }
          } catch {
            // continue scanning
          }
        }, 400);
      } else {
        // BarcodeDetector not supported — show manual input
        setShowManual(true);
      }
    } catch {
      setState('no_camera');
    }
  }, [handleFetch]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    await handleFetch(manualBarcode.trim());
  };

  const handleConfirm = () => {
    if (scannedProduct) onDetected(scannedProduct);
  };

  const handleRetry = () => {
    setState('scanning');
    setScannedBarcode('');
    setScannedProduct(null);
    setManualBarcode('');
    startCamera();
  };

  const handleAddManually = () => {
    if (scannedBarcode) {
      onDetected({ barcode: scannedBarcode, name: '', image: '', category: 'أخرى' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl overflow-hidden shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ScanLine size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-arabic font-bold text-sm text-foreground">مسح الباركود</h2>
              <p className="font-arabic text-xs text-muted-foreground">وجّه الكاميرا نحو الباركود</p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Camera View */}
        {(state === 'scanning') && (
          <div className="relative bg-black aspect-video overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-36">
                {/* Corner brackets */}
                <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm" />
                <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-sm" />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm" />
                {/* Scan line animation */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400/80 animate-scan-line" />
              </div>
            </div>
            {/* Dim overlay outside frame */}
            <div className="absolute inset-0 bg-black/40 [mask-image:radial-gradient(ellipse_224px_144px_at_50%_50%,transparent_100%,black_100%)]" />
          </div>
        )}

        {/* Fetching State */}
        {state === 'fetching' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 bg-muted/20">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 size={24} className="text-primary animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-arabic font-semibold text-foreground text-sm">جاري البحث عن المنتج...</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{scannedBarcode}</p>
            </div>
          </div>
        )}

        {/* Found State */}
        {state === 'found' && scannedProduct && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={18} />
              <span className="font-arabic font-semibold text-sm">تم العثور على المنتج!</span>
            </div>
            <div className="flex gap-4 bg-muted/30 rounded-xl p-4 border border-border">
              {scannedProduct.image ? (
                <img
                  src={scannedProduct.image}
                  alt={scannedProduct.name}
                  className="w-20 h-20 object-contain rounded-lg bg-white border border-border flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <Camera size={24} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="font-arabic font-bold text-foreground text-sm leading-snug line-clamp-2">{scannedProduct.name}</p>
                <span className="inline-block bg-primary/10 text-primary text-xs font-arabic font-semibold px-2 py-0.5 rounded-md">
                  {scannedProduct.category}
                </span>
                <p className="font-mono text-xs text-muted-foreground">{scannedProduct.barcode}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-arabic font-semibold text-sm hover:bg-muted transition-colors"
              >
                مسح مرة أخرى
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-arabic font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                تأكيد واستخدام
              </button>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {state === 'not_found' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertCircle size={22} className="text-amber-500" />
              </div>
              <div>
                <p className="font-arabic font-semibold text-foreground text-sm">لم يُعثر على المنتج</p>
                <p className="font-arabic text-xs text-muted-foreground mt-1">
                  الباركود <span className="font-mono">{scannedBarcode}</span> غير موجود في قاعدة البيانات
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-arabic font-semibold text-sm hover:bg-muted transition-colors"
              >
                مسح مرة أخرى
              </button>
              <button
                onClick={handleAddManually}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-arabic font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                إضافة يدوياً
              </button>
            </div>
          </div>
        )}

        {/* No Camera State */}
        {state === 'no_camera' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                <Camera size={22} className="text-danger" />
              </div>
              <div>
                <p className="font-arabic font-semibold text-foreground text-sm">تعذّر الوصول للكاميرا</p>
                <p className="font-arabic text-xs text-muted-foreground mt-1">يرجى السماح بالوصول للكاميرا أو أدخل الباركود يدوياً</p>
              </div>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="أدخل رقم الباركود..."
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all text-center tracking-widest"
                autoFocus
              />
              <button
                type="submit"
                disabled={!manualBarcode.trim()}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-arabic font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
              >
                بحث عن المنتج
              </button>
            </form>
          </div>
        )}

        {/* Manual barcode input (shown when BarcodeDetector not supported) */}
        {state === 'scanning' && showManual && (
          <div className="p-4 border-t border-border bg-muted/20">
            <p className="font-arabic text-xs text-muted-foreground text-center mb-3">
              الكاميرا تعمل — أو أدخل الباركود يدوياً
            </p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="رقم الباركود..."
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
              <button
                type="submit"
                disabled={!manualBarcode.trim()}
                className="px-4 py-2 rounded-xl bg-primary text-white font-arabic font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                بحث
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 1; }
          50% { top: calc(100% - 2px); opacity: 0.8; }
          100% { top: 0; opacity: 1; }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
