import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function AddFoodModal() {
  const { isAddFoodOpen, setIsAddFoodOpen, addMeal, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'scanner' | 'manual'
  
  // Open Food Facts Live Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Manual & Selected Food Form State
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('lunch');
  const [cal, setCal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Barcode Scanner State
  const videoRef = useRef(null);
  const [isScanningVideo, setIsScanningVideo] = useState(false);
  const [barcodeManualInput, setBarcodeManualInput] = useState('');

  // Debounced search on Open Food Facts API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://fr.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&action=process&json=1&page_size=10`);
        const data = await res.json();
        if (data && data.products) {
          setSearchResults(data.products.filter(p => p.product_name));
        }
      } catch (err) {
        console.error("Open Food Facts search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Select an Open Food Facts product
  const selectOFFProduct = (product) => {
    const name = product.product_name_fr || product.product_name || 'Aliment';
    const brand = product.brands ? ` (${product.brands})` : '';
    const nutriments = product.nutriments || {};

    const calories = Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal_serving'] || 0);
    const p = Math.round(nutriments.proteins_100g || 0);
    const c = Math.round(nutriments.carbohydrates_100g || 0);
    const f = Math.round(nutriments.fat_100g || 0);

    setFoodName(`${name}${brand} (100g)`);
    setCal(calories);
    setProtein(p);
    setCarbs(c);
    setFat(f);

    setActiveTab('manual');
    showToast(`Produit sélectionné : ${name}`);
  };

  // Lookup product by Barcode (EAN)
  const lookupBarcode = async (code) => {
    if (!code) return;
    showToast(`Recherche du code-barres : ${code}...`);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        selectOFFProduct(data.product);
      } else {
        showToast("Produit non trouvé sur Open Food Facts");
      }
    } catch (err) {
      showToast("Erreur lors de la recherche du produit");
    }
  };

  // Start Camera Stream for Barcode scanning
  const startCamera = async () => {
    setIsScanningVideo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Native BarcodeDetector API check
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
          const interval = setInterval(async () => {
            if (!videoRef.current) {
              clearInterval(interval);
              return;
            }
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const code = barcodes[0].rawValue;
                clearInterval(interval);
                stopCamera();
                lookupBarcode(code);
              }
            } catch (e) {}
          }, 500);
        }
      }
    } catch (err) {
      showToast("Accès caméra non disponible. Utilisez la saisie manuelle.");
      setIsScanningVideo(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanningVideo(false);
  };

  const handleClose = () => {
    stopCamera();
    setIsAddFoodOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !cal) return;

    addMeal({
      name: foodName,
      category,
      cal: parseInt(cal) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0
    });

    // Reset form
    setFoodName('');
    setCal('');
    setProtein('');
    setCarbs('');
    setFat('');
    handleClose();
  };

  const applyPreset = (name, cat, c, p, carb, f) => {
    setFoodName(name);
    setCategory(cat);
    setCal(c);
    setProtein(p);
    setCarbs(carb);
    setFat(f);
  };

  if (!isAddFoodOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white w-full rounded-t-[32px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90%] overflow-y-auto no-scrollbar">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-dark">Ajouter un Aliment</h3>
          <button onClick={handleClose} className="p-1.5 text-gray-muted hover:text-slate-dark">
            <i data-lucide="x" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#F5F7FB] p-1 rounded-2xl text-xs font-bold">
          <button 
            onClick={() => { stopCamera(); setActiveTab('search'); }} 
            className={`flex-1 py-2 rounded-xl transition-all ${activeTab === 'search' ? 'bg-white text-purple-main shadow-sm' : 'text-gray-muted'}`}
          >
            🔍 Recherche OFF
          </button>
          <button 
            onClick={() => { setActiveTab('scanner'); startCamera(); }} 
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${activeTab === 'scanner' ? 'bg-white text-purple-main shadow-sm' : 'text-gray-muted'}`}
          >
            <i data-lucide="camera" className="w-3.5 h-3.5"></i>
            <span>Scan Code-barres</span>
          </button>
          <button 
            onClick={() => { stopCamera(); setActiveTab('manual'); }} 
            className={`flex-1 py-2 rounded-xl transition-all ${activeTab === 'manual' ? 'bg-white text-purple-main shadow-sm' : 'text-gray-muted'}`}
          >
            ✍️ Saisie / Presets
          </button>
        </div>

        {/* TAB 1: RECHERCHE OPEN FOOD FACTS */}
        {activeTab === 'search' && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-muted block mb-1 uppercase">Recherche Base Nationale (Open Food Facts)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ex: Nutella, Skyr, Poulet Yoplait..." 
                  className="w-full pl-10 pr-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-main/30"
                />
                <i data-lucide="search" className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-muted"></i>
              </div>
            </div>

            {isSearching && (
              <div className="text-center py-4 text-xs font-bold text-purple-main animate-pulse">
                Recherche dans la base Open Food Facts...
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {searchResults.map((product, idx) => {
                const nut = product.nutriments || {};
                const kcal = Math.round(nut['energy-kcal_100g'] || 0);
                const p = Math.round(nut.proteins_100g || 0);
                const c = Math.round(nut.carbohydrates_100g || 0);
                const f = Math.round(nut.fat_100g || 0);

                return (
                  <div 
                    key={idx}
                    onClick={() => selectOFFProduct(product)}
                    className="p-3 bg-[#F5F7FB] hover:bg-purple-50 rounded-2xl flex items-center space-x-3 cursor-pointer transition-colors border border-gray-100"
                  >
                    {product.image_small_url ? (
                      <img src={product.image_small_url} alt="Product" className="w-10 h-10 object-contain rounded-lg bg-white p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-main font-bold text-xs">
                        🥗
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-dark truncate">{product.product_name_fr || product.product_name}</h4>
                      <span className="text-[10px] text-gray-muted block truncate">{product.brands || 'Open Food Facts'}</span>
                      <span className="text-[10px] font-bold text-purple-main">{kcal} kcal / 100g • P:{p}g G:{c}g L:{f}g</span>
                    </div>
                    <i data-lucide="chevron-right" className="w-4 h-4 text-gray-muted"></i>
                  </div>
                );
              })}

              {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-muted">
                  Aucun produit trouvé pour "{searchQuery}". Essayez un autre terme ou passez en saisie manuelle.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SCANNER CODE-BARRES */}
        {activeTab === 'scanner' && (
          <div className="space-y-3 text-center">
            <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 h-1 bg-gradient-primary shadow-lg scanner-laser"></div>
              {!isScanningVideo && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
                  <i data-lucide="camera-off" className="w-8 h-8 mb-2 text-pink-main"></i>
                  <span className="text-xs font-bold">Caméra désactivée</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={barcodeManualInput}
                onChange={(e) => setBarcodeManualInput(e.target.value)}
                placeholder="Ou tapez le code-barres EAN (ex: 3017620422003)" 
                className="flex-1 px-3 py-2.5 bg-[#F5F7FB] rounded-xl text-xs font-semibold focus:outline-none"
              />
              <button 
                onClick={() => lookupBarcode(barcodeManualInput)} 
                className="px-4 py-2.5 bg-gradient-primary text-white text-xs font-bold rounded-xl shadow-purple-glow"
              >
                Chercher
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SAISIE MANUELLE & PRESETS */}
        {(activeTab === 'manual' || activeTab === 'search') && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-gray-muted block mb-1.5 uppercase">Aliments Populaires (1-Clic)</span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => applyPreset('Blanc de Poulet (150g)', 'lunch', 240, 46, 0, 4)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                  🍗 Poulet (150g)
                </button>
                <button onClick={() => applyPreset('Riz Basmati Cuit (200g)', 'lunch', 260, 5, 56, 1)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                  🍚 Riz (200g)
                </button>
                <button onClick={() => applyPreset('Œufs Durs (x2)', 'breakfast', 155, 13, 1, 11)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                  🥚 2 Œufs
                </button>
                <button onClick={() => applyPreset('Shaker Whey (30g)', 'snack', 120, 24, 2, 2)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                  🥤 Whey (30g)
                </button>
                <button onClick={() => applyPreset('Flocons d\'Avoine (60g)', 'breakfast', 230, 8, 40, 4)} className="px-2.5 py-1.5 bg-[#F5F7FB] hover:bg-purple-50 text-slate-dark text-[10px] font-bold rounded-xl flex-shrink-0 border border-gray-100">
                  🥣 Avoine (60g)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="text-[10px] font-bold text-gray-muted block mb-1">Nom de l'aliment</label>
                <input 
                  type="text" 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required 
                  placeholder="ex: Omelette & Avocat" 
                  className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-main/30" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-muted block mb-1">Type de repas</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-semibold text-slate-dark focus:outline-none"
                >
                  <option value="breakfast">Petit-déjeuner</option>
                  <option value="lunch">Déjeuner</option>
                  <option value="dinner">Dîner</option>
                  <option value="snack">Collation / Snack</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Calories (kcal)</label>
                  <input 
                    type="number" 
                    value={cal}
                    onChange={(e) => setCal(e.target.value)}
                    required 
                    placeholder="450" 
                    className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Protéines (g)</label>
                  <input 
                    type="number" 
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="35" 
                    className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Glucides (g)</label>
                  <input 
                    type="number" 
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="40" 
                    className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-muted block mb-1">Lipides (g)</label>
                  <input 
                    type="number" 
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="15" 
                    className="w-full px-4 py-3 bg-[#F5F7FB] rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-main/30" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-gradient-primary text-white font-bold text-sm rounded-2xl shadow-purple-glow mt-2 active:scale-98 transition-transform"
              >
                Enregistrer le Repas
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
