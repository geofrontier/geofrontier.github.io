// components-loader.js
class ComponentLoader {
  constructor() {
    this.components = {
      'navbar': 'components/navbar.html',
      'header': 'components/header.html',
      'footer': 'components/footer.html'
    };
  }

  async loadComponent(componentId, targetElementId) {
    try {
      const componentPath = this.components[componentId];
      if (!componentPath) {
        console.error(`Component ${componentId} not found`);
        return;
      }

      console.log(`Loading component from: ${componentPath}`);
      const response = await fetch(componentPath);
      if (!response.ok) {
        // Try with leading slash if relative path fails
        const alternativePath = `/${componentPath}`;
        console.log(`Trying alternative path: ${alternativePath}`);
        const altResponse = await fetch(alternativePath);
        if (!altResponse.ok) {
          throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        const html = await altResponse.text();
        this.insertComponent(html, targetElementId, componentId);
        return;
      }

      const html = await response.text();
      this.insertComponent(html, targetElementId, componentId);
      
    } catch (error) {
      console.error(`Error loading component ${componentId}:`, error);
      this.showComponentError(targetElementId, componentId, error);
      throw error;
    }
  }

  insertComponent(html, targetElementId, componentId) {
    const targetElement = document.getElementById(targetElementId);
    
    if (targetElement) {
      targetElement.innerHTML = html;
      
      // Reinitialize scripts within the component
      this.executeScripts(targetElement);
      
      // Dispatch event for component-specific initialization
      document.dispatchEvent(new CustomEvent('componentLoaded', {
        detail: { componentId, targetElement }
      }));
      
      console.log(`Component ${componentId} loaded successfully into #${targetElementId}`);
      return true;
    }
    return false;
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
    // Wait a bit for navbar to fully load
    setTimeout(() => {
      const navLinks = document.querySelectorAll('.main-nav a[data-nav]');
      navLinks.forEach(link => {
        if (link.getAttribute('data-nav') === pageName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      // Also update any other nav elements
      const allNavLinks = document.querySelectorAll('nav a[data-nav]');
      allNavLinks.forEach(link => {
        if (link.getAttribute('href') === `${pageName}.html` || 
            link.getAttribute('data-nav') === pageName) {
          link.classList.add('active');
        }
      });
    }, 500);
  }

  showComponentError(targetElementId, componentId, error) {
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--accent-rust); background: rgba(183, 65, 14, 0.1); border-radius: 10px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
          <h3 style="margin: 10px 0;">Failed to load ${componentId}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${error.message}</p>
          <button onclick="window.location.reload()" style="
            background: var(--accent-rust);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 15px;
            font-weight: 600;
          ">
            <i class="fas fa-redo"></i> Reload Page
          </button>
        </div>
      `;
    }
  }
}

// Initialize and export loader
const loader = new ComponentLoader();
window.ComponentLoader = loader;
