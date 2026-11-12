import React from 'react';

/**
 * Komponen untuk menampilkan teks dan gambar soal dengan perataan (kiri, tengah, kanan)
 * serta tata letak posisi gambar (atas, tengah/antara paragraf, atau bawah teks).
 * Mendukung multiple images (banyak gambar) sekaligus tag presisi seperti [gambar1], [gambar2], atau [gambar].
 */
export default function QuestionContentRenderer({
    text = '',
    image = null,
    images = null,
    alignment = 'center',
    position = 'bottom',
    onImageClick = null,
    className = 'text-sm font-medium text-slate-900 leading-relaxed',
    imageClassName = 'max-h-80 object-contain',
    isPrint = false,
}) {
    // Kumpulkan seluruh gambar (mendukung format images array maupun fallback single image)
    const allImages = React.useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            return images.filter(Boolean);
        }
        if (image) {
            return [image];
        }
        return [];
    }, [images, image]);

    if (allImages.length === 0) {
        return (
            <p className={`${className} whitespace-pre-line`}>
                {text}
            </p>
        );
    }

    const alignClass = alignment === 'left'
        ? 'justify-start text-left'
        : alignment === 'right'
        ? 'justify-end text-right'
        : 'justify-center text-center';

    const getCleanSrc = (imgItem) => {
        if (!imgItem) return '';
        const src = typeof imgItem === 'string' ? imgItem : (imgItem.preview || imgItem.url || imgItem.src || '');
        if (src.startsWith('/') || src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) {
            return src;
        }
        return `/storage/${src}`;
    };

    const renderSingleImage = (imgItem, idx) => {
        const src = getCleanSrc(imgItem);
        if (!src) return null;

        const handleClick = onImageClick ? () => onImageClick(src, idx) : null;

        return (
            <div key={`q-img-item-${idx}`} className="relative inline-block max-w-full group">
                <img
                    src={src}
                    alt={`Gambar Soal ${idx + 1}`}
                    onClick={handleClick}
                    className={`rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs transition ${
                        handleClick ? 'cursor-pointer hover:opacity-95 hover:shadow-md' : ''
                    } ${imageClassName} ${isPrint ? 'print:border-slate-300 print:shadow-none' : ''}`}
                    title={handleClick ? 'Klik untuk memperbesar gambar' : undefined}
                />
                {allImages.length > 1 && (
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-bold backdrop-blur-xs no-print">
                        Gambar {idx + 1}
                    </span>
                )}
            </div>
        );
    };

    const renderGroupOfImages = (imgList, keyPrefix = 'group') => {
        if (!imgList || imgList.length === 0) return null;

        if (imgList.length === 1) {
            return (
                <div key={`${keyPrefix}-single`} className={`my-3 flex ${alignClass} w-full`}>
                    {renderSingleImage(imgList[0].item, imgList[0].idx)}
                </div>
            );
        }

        // Multiple images: responsive grid layout
        return (
            <div key={`${keyPrefix}-multi`} className={`my-3.5 flex ${alignClass} w-full`}>
                <div className={`grid gap-3.5 w-full ${
                    imgList.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                        : imgList.length === 3
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl'
                        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl'
                }`}>
                    {imgList.map(({ item, idx }) => (
                        <div key={`img-wrap-${idx}`} className="flex justify-center items-center">
                            {renderSingleImage(item, idx)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Deteksi tag seperti [gambar1], [gambar 2], [image1], [foto1], atau [gambar]
    const tagSplitRegex = /(\[(?:gambar|image|foto)\s*[0-9]*\])/i;
    const numberedTagRegex = /^\[(?:gambar|image|foto)\s*([0-9]+)\]$/i;
    const generalTagRegex = /^\[(?:gambar|image|foto)\]$/i;

    const indexedImages = allImages.map((item, idx) => ({ item, idx }));

    if (tagSplitRegex.test(text)) {
        const tokens = text.split(tagSplitRegex);
        const usedIndices = new Set();
        const contentElements = [];

        tokens.forEach((token, tokenIdx) => {
            if (!token) return;

            const numMatch = token.match(numberedTagRegex);
            if (numMatch) {
                const targetNumber = parseInt(numMatch[1], 10);
                const targetIdx = targetNumber - 1;
                if (targetIdx >= 0 && targetIdx < allImages.length) {
                    usedIndices.add(targetIdx);
                    contentElements.push(
                        <div key={`token-img-${targetIdx}`} className={`my-3 flex ${alignClass} w-full`}>
                            {renderSingleImage(allImages[targetIdx], targetIdx)}
                        </div>
                    );
                    return;
                }
            }

            if (generalTagRegex.test(token)) {
                // Masukkan seluruh gambar tersisa yang belum diposisikan
                const remaining = indexedImages.filter(x => !usedIndices.has(x.idx));
                remaining.forEach(x => usedIndices.add(x.idx));
                if (remaining.length > 0) {
                    contentElements.push(renderGroupOfImages(remaining, `token-gen-${tokenIdx}`));
                }
                return;
            }

            // Text token
            const trimmed = token.trim();
            if (trimmed) {
                contentElements.push(
                    <p key={`token-text-${tokenIdx}`} className={`${className} whitespace-pre-line`}>
                        {trimmed}
                    </p>
                );
            }
        });

        // Jika masih ada gambar yang belum dipakai via tag
        const unplacedImages = indexedImages.filter(x => !usedIndices.has(x.idx));
        if (unplacedImages.length > 0) {
            const extraGroup = renderGroupOfImages(unplacedImages, 'unplaced');
            if (position === 'top') {
                contentElements.unshift(extraGroup);
            } else {
                contentElements.push(extraGroup);
            }
        }

        return (
            <div className="space-y-2">
                {contentElements}
            </div>
        );
    }

    // Jika tidak ada tag, tempatkan seluruh gambar berdasarkan `position`
    const allImagesBlock = renderGroupOfImages(indexedImages, 'all-images');

    if (position === 'top') {
        return (
            <div className="space-y-2">
                {allImagesBlock}
                {text && (
                    <p className={`${className} whitespace-pre-line`}>
                        {text}
                    </p>
                )}
            </div>
        );
    }

    if (position === 'middle') {
        const paragraphs = text.split(/\n\s*\n/);
        if (paragraphs.length >= 2) {
            const mid = Math.ceil(paragraphs.length / 2);
            const firstHalf = paragraphs.slice(0, mid).join('\n\n').trim();
            const secondHalf = paragraphs.slice(mid).join('\n\n').trim();

            return (
                <div className="space-y-2">
                    {firstHalf && (
                        <p className={`${className} whitespace-pre-line`}>
                            {firstHalf}
                        </p>
                    )}
                    {allImagesBlock}
                    {secondHalf && (
                        <p className={`${className} whitespace-pre-line`}>
                            {secondHalf}
                        </p>
                    )}
                </div>
            );
        }
    }

    // Default: 'bottom'
    return (
        <div className="space-y-2">
            {text && (
                <p className={`${className} whitespace-pre-line`}>
                    {text}
                </p>
            )}
            {allImagesBlock}
        </div>
    );
}
