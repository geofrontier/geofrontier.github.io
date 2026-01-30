// components-loader.js
class ComponentLoader {
  constructor() {
    this.components = {
      'navbar': 'navbar.html',
      'header': 'header.html',
      'footer': 'footer.html'
    };
  }

  async loadComponent(componentId, targetElementId) {
    try {
      const componentPath = this.components[componentId];
      if (!componentPath) {
        console.error(`Component ${componentId} not found`);
        return;
      }

      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentPath}: ${response.status}`);
      }

      const html = await response.text();
      const targetElement = document.getElementById(targetElementId);
      
      if (targetElement) {
        targetElement.innerHTML = html;
        
        // Reinitialize scripts within the component
        this.executeScripts(targetElement);
        
        // Dispatch event for component-specific initialization
        document.dispatchEvent(new CustomEvent('componentLoaded', {
          detail: { componentId, targetElement }
        }));
        
        console.log(`Component ${componentId} loaded successfully`);
      }
    } catch (error) {
      console.error(`Error loading component ${componentId}:`, error);
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  setActiveNav(pageName) {
    // This will be called after navbar loads
    document.addEventListener('componentLoaded', (event) => {
      if (event.detail.componentId === 'navbar') {
        const navLinks = document.querySelectorAll('.main-nav a[data-nav]');
        navLinks.forEach(link => {
          if (link.getAttribute('data-nav') === pageName) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

// Initialize and export loader
const loader = new ComponentLoader();
window.ComponentLoader = loader;
