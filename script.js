document.addEventListener('DOMContentLoaded', () => {
    initShareButton();
    initCardGlowEffects();
    initAnalyticsTrackers();
});

/**
 * Initializes the share/copy button with a robust clipboard API and fallback.
 */
function initShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    const toast = document.getElementById('toast');
    let toastTimeout;

    if (!shareBtn || !toast) return;

    shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        const urlToCopy = window.location.href;

        // Try using modern navigator.share if on mobile
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Start.AI | Lucas Zaccaro',
                    text: 'Acesse os links oficiais da Comunidade e do Curso gratuito da Start.AI!',
                    url: urlToCopy
                });
                return; // Shared successfully
            } catch (err) {
                // If sharing was cancelled or failed, fallback to copy to clipboard
                console.log('Compartilhamento cancelado ou não suportado, copiando link...');
            }
        }

        // Clipboard copy fallback
        copyToClipboard(urlToCopy)
            .then(() => {
                showToast("Link copiado para a área de transferência!");
            })
            .catch((err) => {
                console.error("Falha ao copiar: ", err);
                showToast("Não foi possível copiar o link.");
            });
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/**
 * Copies a string to clipboard with fallback for maximum browser support (Instagram Webview compatibility).
 */
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for non-secure contexts or browsers without clipboard API
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed'; // Avoid scrolling to bottom
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('ExecCommand copy returned false'));
                }
            } catch (err) {
                document.body.removeChild(textArea);
                reject(err);
            }
        });
    }
}

/**
 * Interactive card cursor tracker. 
 * Creates a glowing hover effect that follows the user's cursor inside cards.
 */
function initCardGlowEffects() {
    const cards = document.querySelectorAll('.link-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside the card
            const y = e.clientY - rect.top;  // y position inside the card

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

/**
 * Simple debug logs simulating analytics counts on link clicks.
 */
function initAnalyticsTrackers() {
    const links = document.querySelectorAll('.link-card, .social-icon-btn');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetName = link.id || link.getAttribute('aria-label') || link.href;
            console.log(`[Start.AI Analytics] Clique registrado em: ${targetName}`);
        });
    });
}
