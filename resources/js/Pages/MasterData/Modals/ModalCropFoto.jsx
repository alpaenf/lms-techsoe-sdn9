import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw, Crop, Image as ImageIcon } from 'lucide-react';

export default function ModalCropFoto({
    isOpen,
    imageSrc,
    onClose,
    onCropComplete,
    aspectRatio = 3 / 4 // default 3:4 pass foto (width / height)
}) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [selectedAspect, setSelectedAspect] = useState(aspectRatio); // 3/4 or 1/1
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setRotation(0);
            setPosition({ x: 0, y: 0 });
            setImageLoaded(false);
        }
    }, [isOpen, imageSrc]);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setNaturalSize({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
        setPosition({ x: 0, y: 0 });
    };

    // Drag / Pan Handlers
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    }, [isDragging, dragStart]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch Handlers for Mobile / Tablet
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        setPosition({
            x: e.touches[0].clientX - dragStart.x,
            y: e.touches[0].clientY - dragStart.y
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Apply Crop using HTML5 Canvas
    const handleApplyCrop = () => {
        if (!imageRef.current || !containerRef.current) return;

        const cropBox = containerRef.current.getBoundingClientRect();
        const img = imageRef.current;

        // Target canvas resolution (high resolution export)
        const targetWidth = selectedAspect === 1 ? 600 : 600;
        const targetHeight = selectedAspect === 1 ? 600 : 800; // 3:4

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Fill background with white
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Calculate scale ratio between on-screen crop box and canvas target
        const scaleX = targetWidth / cropBox.width;
        const scaleY = targetHeight / cropBox.height;

        ctx.save();
        // Translate to canvas center to apply transforms
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Calculate drawn image dimensions relative to crop box center
        const imgDisplayWidth = img.width;
        const imgDisplayHeight = img.height;

        // Draw image accounting for position offsets
        const drawX = (position.x) * scaleX;
        const drawY = (position.y) * scaleY;
        const drawW = imgDisplayWidth * scaleX;
        const drawH = imgDisplayHeight * scaleY;

        ctx.drawImage(
            img,
            drawX - drawW / 2,
            drawY - drawH / 2,
            drawW,
            drawH
        );

        ctx.restore();

        // Convert canvas to WebP/JPEG Blob and File
        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `guru_foto_${Date.now()}.webp`, {
                type: 'image/webp',
                lastModified: Date.now()
            });
            const previewUrl = URL.createObjectURL(blob);
            onCropComplete(file, previewUrl);
            onClose();
        }, 'image/webp', 0.92);
    };

    if (!isOpen || !imageSrc) return null;

    // Crop box dimensions in modal
    const cropBoxWidth = selectedAspect === 1 ? 260 : 225;
    const cropBoxHeight = 300;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#8B001F] flex items-center justify-center font-bold">
                            <Crop className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                Sesuaikan & Potong Foto
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                Geser dan atur zoom foto agar pas dengan bingkai
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cropper Viewport */}
                <div
                    className="relative w-full h-80 bg-slate-900 flex items-center justify-center overflow-hidden select-none cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* The Image being cropped and panned */}
                    <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Crop Preview"
                        onLoad={handleImageLoad}
                        draggable={false}
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            maxHeight: 'none',
                            maxWidth: 'none',
                            width: naturalSize.width > naturalSize.height ? 'auto' : '260px',
                            height: naturalSize.width > naturalSize.height ? '260px' : 'auto',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        }}
                        className="opacity-90 transition-opacity"
                    />

                    {/* Semi-transparent Overlay Mask */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div
                            ref={containerRef}
                            style={{
                                width: `${cropBoxWidth}px`,
                                height: `${cropBoxHeight}px`,
                                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)'
                            }}
                            className="relative border-2 border-dashed border-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-200"
                        >
                            {/* Grid Guidelines */}
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                                <div className="border-r border-b border-white/50" />
                                <div className="border-r border-b border-white/50" />
                                <div className="border-b border-white/50" />
                                <div className="border-r border-b border-white/50" />
                                <div className="border-r border-b border-white/50" />
                                <div className="border-b border-white/50" />
                                <div className="border-r border-white/50" />
                                <div className="border-r border-white/50" />
                                <div />
                            </div>

                            {/* Center Target Indicator */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                                <div className="w-8 h-8 border-t border-l border-r border-b border-white rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Hint */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-slate-300 font-medium">
                        Tahan & Geser untuk mengatur posisi
                    </div>
                </div>

                {/* Controls Toolbar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3.5">
                    
                    {/* Zoom & Rotate Slider */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 flex-1">
                            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                                type="range"
                                min="0.6"
                                max="3"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full accent-[#8B001F] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-[11px] font-mono text-slate-500 w-9 text-right">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setRotation((prev) => (prev + 90) % 360)}
                            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition shadow-sm"
                            title="Putar 90 Derajat"
                        >
                            <RotateCw className="w-3.5 h-3.5 text-[#8B001F]" />
                            <span className="text-[11px] font-bold">Putar</span>
                        </button>
                    </div>

                    {/* Aspect Ratio Selector */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-xs font-semibold text-slate-600">Rasio Foto:</span>
                        <div className="flex items-center space-x-1.5">
                            <button
                                type="button"
                                onClick={() => setSelectedAspect(3 / 4)}
                                className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${selectedAspect === 3 / 4
                                    ? 'bg-[#8B001F] text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                3 : 4 (Pass Foto)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedAspect(1)}
                                className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${selectedAspect === 1
                                    ? 'bg-[#8B001F] text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                1 : 1 (Persegi)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleApplyCrop}
                        className="px-5 py-2 rounded-xl bg-[#8B001F] hover:bg-[#650019] text-white text-xs font-bold shadow-sm transition inline-flex items-center space-x-1.5"
                    >
                        <Check className="w-4 h-4" />
                        <span>Terapkan Hasil Crop</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
