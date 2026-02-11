/**
 * Chica-Ebooks Carousel - Linha Única Horizontal
 * Carousel em linha única com navegação suave
 */

class ChicaEbooksCarousel {
    constructor() {
        // DOM Elements
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.viewport = document.querySelector('.carousel-viewport');
        
        // State
        this.scrollPosition = 0;
        this.cardWidth = 0;
        this.visibleCards = 0;
        this.totalCards = document.querySelectorAll('.ebook-card').length;
        this.isAnimating = false;
        
        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }

    init() {
        this.calculateDimensions();
        this.attachEventListeners();
        this.addBookCardInteractions();
        this.updateButtonStates();
        
        console.log(`📚 Chica-Ebooks: ${this.totalCards} livros carregados`);
        console.log(`👁️ Mostrando ${this.visibleCards} livros por vez`);
    }

    /**
     * Calcular dimensões do carousel
     */
    calculateDimensions() {
        const cards = document.querySelectorAll('.ebook-card');
        if (cards.length > 0) {
            const firstCard = cards[0];
            const styles = window.getComputedStyle(firstCard);
            const gap = parseInt(window.getComputedStyle(this.track).gap) || 30;
            
            this.cardWidth = firstCard.offsetWidth + gap;
            
            // Calcular quantos cards são visíveis
            const viewportWidth = this.viewport.offsetWidth;
            this.visibleCards = Math.floor(viewportWidth / this.cardWidth);
            
            // Garantir pelo menos 1 card visível
            if (this.visibleCards < 1) this.visibleCards = 1;
        }
    }

    /**
     * Anexar event listeners
     */
    attachEventListeners() {
        // Botões de navegação
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse drag
        let isDragging = false;
        let startPos = 0;
        let scrollLeft = 0;
        
        this.track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.pageX - this.track.offsetLeft;
            scrollLeft = this.getCurrentTranslate();
            this.track.style.cursor = 'grabbing';
            this.track.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.track.offsetLeft;
            const walk = (x - startPos);
            const newPosition = scrollLeft + walk;
            this.setTranslate(newPosition);
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            this.track.style.cursor = 'grab';
            this.track.style.userSelect = 'auto';
            
            // Snap to nearest position
            const movedBy = e.pageX - startPos - this.track.offsetLeft;
            if (Math.abs(movedBy) > this.minSwipeDistance) {
                if (movedBy > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            } else {
                // Voltar para posição original
                this.updateCarousel();
            }
        });
        
        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateDimensions();
                this.scrollPosition = 0;
                this.updateCarousel(false);
            }, 250);
        });
    }

    /**
     * Navegação por teclado
     */
    handleKeyboard(e) {
        // Não interceptar se o usuário estiver em um input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.next();
                break;
            case 'Home':
                e.preventDefault();
                this.goToStart();
                break;
            case 'End':
                e.preventDefault();
                this.goToEnd();
                break;
        }
    }

    /**
     * Touch handlers
     */
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        const deltaX = this.touchEndX - this.touchStartX;
        
        if (Math.abs(deltaX) > this.minSwipeDistance) {
            if (deltaX > 0) {
                this.prev();
            } else {
                this.next();
            }
        }
    }

    /**
     * Obter translate atual
     */
    getCurrentTranslate() {
        const style = window.getComputedStyle(this.track);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    /**
     * Definir translate
     */
    setTranslate(value) {
        this.track.style.transform = `translateX(${value}px)`;
    }

    /**
     * Atualizar carousel
     */
    updateCarousel(animated = true) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        const maxScroll = -(this.totalCards - this.visibleCards) * this.cardWidth;
        const targetPosition = -this.scrollPosition * this.cardWidth;
        
        // Limitar scroll
        const clampedPosition = Math.max(maxScroll, Math.min(0, targetPosition));
        
        if (!animated) {
            this.track.style.transition = 'none';
        } else {
            this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        this.setTranslate(clampedPosition);
        this.updateButtonStates();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    /**
     * Atualizar estado dos botões
     */
    updateButtonStates() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Desabilitar prev se no início
        if (this.scrollPosition <= 0) {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
            this.prevBtn.disabled = true;
        } else {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
            this.prevBtn.disabled = false;
        }
        
        // Desabilitar next se no final
        const maxPosition = Math.max(0, this.totalCards - this.visibleCards);
        if (this.scrollPosition >= maxPosition) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
            this.nextBtn.disabled = true;
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
            this.nextBtn.disabled = false;
        }
    }

    /**
     * Próxima página
     */
    next() {
        const maxPosition = Math.max(0, this.totalCards - this.visibleCards);
        
        if (this.scrollPosition < maxPosition) {
            this.scrollPosition = Math.min(maxPosition, this.scrollPosition + this.visibleCards);
            this.updateCarousel();
            console.log(`📖 Avançando para posição ${this.scrollPosition}`);
        }
    }

    /**
     * Página anterior
     */
    prev() {
        if (this.scrollPosition > 0) {
            this.scrollPosition = Math.max(0, this.scrollPosition - this.visibleCards);
            this.updateCarousel();
            console.log(`📖 Voltando para posição ${this.scrollPosition}`);
        }
    }

    /**
     * Ir para o início
     */
    goToStart() {
        this.scrollPosition = 0;
        this.updateCarousel();
        console.log(`📖 Indo para o início`);
    }

    /**
     * Ir para o final
     */
    goToEnd() {
        this.scrollPosition = Math.max(0, this.totalCards - this.visibleCards);
        this.updateCarousel();
        console.log(`📖 Indo para o final`);
    }

    /**
     * Adicionar interações aos cards de livros
     */
    addBookCardInteractions() {
        const bookCards = document.querySelectorAll('.ebook-card');
        
        bookCards.forEach(card => {
            // Hover effect enhancement
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s ease';
            });
            
            // Click nos botões de adicionar ao carrinho
            const addBtn = card.querySelector('.btn-add-cart');
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleAddToCart(card);
                });
            }
            
            // Click no card inteiro
            card.addEventListener('click', (e) => {
                // Não fazer nada se clicou no botão
                if (e.target.closest('.btn-add-cart')) return;
                this.handleBookCardClick(card);
            });
            
            // Acessibilidade
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleBookCardClick(card);
                }
            });
        });
    }

    /**
     * Lidar com click no card do livro
     */
    handleBookCardClick(card) {
        const title = card.querySelector('.ebook-title').textContent;
        const author = card.querySelector('.ebook-author').textContent;
        const genre = card.querySelector('.ebook-genre').textContent;
        
        // Animação visual
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        console.log(`📕 Livro selecionado: "${title}" por ${author} (${genre})`);
        
        // Você pode adicionar funcionalidade aqui:
        // - Abrir modal com detalhes do livro
        // - Redirecionar para página do livro
        // - Mostrar preview
    }

    /**
     * Adicionar livro ao carrinho
     */
    handleAddToCart(card) {
        const title = card.querySelector('.ebook-title').textContent;
        const author = card.querySelector('.ebook-author').textContent;
        const btn = card.querySelector('.btn-add-cart');
        
        // Feedback visual no botão
        const originalText = btn.textContent;
        btn.textContent = '✓ Adicionado!';
        btn.style.background = '#45B08C';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
        
        console.log(`🛒 Adicionado ao carrinho: "${title}" por ${author}`);
        
        // Mostrar notificação
        this.showNotification(`"${title}" foi adicionado ao carrinho!`);
        
        // Aqui você pode adicionar:
        // - Atualizar contador do carrinho
        // - Enviar para API
        // - Salvar no localStorage
    }

    /**
     * Mostrar notificação
     */
    showNotification(message) {
        // Criar toast notification
        let toast = document.getElementById('chicaToast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'chicaToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #1A535C, #45B08C);
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(26, 83, 92, 0.3);
                border: 2px solid rgba(69, 176, 140, 0.4);
                z-index: 10000;
                font-size: 15px;
                font-weight: 600;
                max-width: 350px;
                transform: translateX(500px);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(toast);
        }
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🛒</span>
                <span>${message}</span>
            </div>
        `;
        
        // Animar entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Animar saída
        setTimeout(() => {
            toast.style.transform = 'translateX(500px)';
        }, 3000);
    }

    /**
     * Destruir instância do carousel
     */
    destroy() {
        console.log('📚 Chica-Ebooks Carousel encerrado');
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ChicaEbooksCarousel();
    
    // Tornar globalmente acessível para debug
    window.chicaCarousel = carousel;
    
    console.log('%c📚 Chica-Ebooks Carousel Ativado!', 'color: #45B08C; font-size: 16px; font-weight: bold;');
    console.log('%c✨ Use as setas do teclado ou arraste para navegar', 'color: #1A535C; font-size: 12px;');
    console.log('%c📱 Em dispositivos touch, deslize para navegar', 'color: #1A535C; font-size: 12px;');
});

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChicaEbooksCarousel;
}
