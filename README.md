# Chica-Ebooks - Carousel Atualizado 📚

## ✨ Mudanças Implementadas

### 🎯 Carousel em Linha Única
- **Antes**: Grade de 4 colunas com múltiplas páginas
- **Agora**: Linha horizontal única com scroll suave
- Mostra 3-4 livros por vez no desktop
- Navegação intuitiva com botões ou arraste

### 📱 100% Responsivo

#### Desktop (1200px+)
- Mostra 4 livros por vez
- Cards de 280px de largura
- Navegação com botões laterais
- Suporte a drag & drop

#### Tablet (768px - 1199px)
- Mostra 3 livros por vez
- Cards de 240px
- Botões de navegação adaptativos

#### Mobile (< 768px)
- Mostra 1-2 livros por vez
- Cards de 180-200px
- Scroll nativo com touch
- Botões de navegação ocultos
- Interface otimizada para toque

## 🚀 Funcionalidades

### Navegação
- ⬅️➡️ **Setas do teclado**: Navegar entre livros
- 🖱️ **Drag & Drop**: Arrastar com o mouse
- 👆 **Swipe**: Deslizar em dispositivos touch
- 🔘 **Botões**: Anterior/Próximo
- **Home/End**: Ir para início/fim

### Recursos Avançados
- ✅ Animações suaves com cubic-bezier
- 🎨 Feedback visual em hover
- 🛒 Sistema de "adicionar ao carrinho"
- 🔔 Notificações toast
- ♿ Acessibilidade completa (ARIA, keyboard navigation)
- 📐 Auto-ajuste em redimensionamento

## 📋 Como Usar

1. **Certifique-se que os 3 arquivos estão na mesma pasta:**
   - `chica-ebooks-updated.html`
   - `chica-styles-updated.css`
   - `chica-carousel-updated.js`

2. **Abra o arquivo HTML no navegador**

3. **Navegue pelos livros:**
   - Use as setas do teclado (←→)
   - Clique nos botões laterais
   - Arraste com o mouse
   - Deslize em dispositivos móveis

## 🎨 Personalização

### Ajustar Número de Livros Visíveis

No arquivo CSS (`chica-styles-updated.css`), você pode modificar a largura dos cards:

```css
.ebook-card {
    min-width: 280px;  /* Altere este valor */
    max-width: 280px;  /* Altere este valor */
}
```

### Ajustar Velocidade de Animação

No arquivo JavaScript (`chica-carousel-updated.js`), na linha de transição:

```javascript
this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
// Altere 0.6s para o tempo desejado (ex: 0.4s = mais rápido, 0.8s = mais lento)
```

### Modificar Cores

No CSS, as cores principais são:
- **Verde escuro**: `#1A535C`
- **Verde médio**: `#45B08C`
- **Verde claro**: `#4ECDC4`
- **Fundo claro**: `#F7FFF7`

## 📐 Breakpoints Responsivos

| Tamanho | Largura | Cards Visíveis | Largura do Card |
|---------|---------|----------------|-----------------|
| Desktop XL | > 1400px | 4 | 280px |
| Desktop | 1200-1400px | 3-4 | 260px |
| Tablet | 768-1199px | 2-3 | 220-240px |
| Mobile L | 576-767px | 1-2 | 200px |
| Mobile | < 576px | 1 | 180px |

## 🔧 Melhorias Técnicas

1. **Performance**:
   - CSS transitions com GPU acceleration
   - Debounce no resize
   - Passive event listeners

2. **Compatibilidade**:
   - Funciona em todos os navegadores modernos
   - Fallback para touch devices
   - Scroll nativo em mobile

3. **Acessibilidade**:
   - ARIA labels
   - Navegação por teclado
   - Estados de foco visíveis
   - Semântica correta

## 🐛 Resolução de Problemas

**Os botões não aparecem?**
- Certifique-se que está em um desktop (> 768px)
- Em mobile, os botões ficam ocultos propositalmente

**O scroll não funciona?**
- Verifique o console do navegador (F12)
- Certifique-se que o JavaScript está carregado

**Cards muito pequenos em mobile?**
- Isso é intencional para caber na tela
- Ajuste os valores nos media queries se necessário

## 📝 Créditos

Desenvolvido por: Mateus, João Carlos, Samuel Ferreira, João Marcelo

---

**Dica**: Abra o console do navegador (F12) para ver mensagens de debug e logs de navegação! 🎯
