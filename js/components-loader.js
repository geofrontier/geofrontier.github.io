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
        throw new Error(`Failed to load ${componentPath}: ${response.status}`);
      }

      const html = await response.text();
      const targetElement = document.getElementById(targetElementId);
      
      if (targetElement) {
        targetElement.innerHTML = html;
        
        // Execute scripts within the component
        await this.executeScripts(targetElement);
        
        // Dispatch event for component-specific initialization
        document.dispatchEvent(new CustomEvent('componentLoaded', {
          detail: { componentId, targetElement }
        }));
        
        console.log(`Component ${componentId} loaded successfully into #${targetElementId}`);
        return true;
      }
    } catch (error) {
      console.error(`Error loading component ${componentId}:`, error);
      this.showComponentError(targetElementId, componentId, error);
      throw error;
    }
  }

  async executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    const scriptPromises = [];
    
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      
      // Copy all attributes
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Handle inline scripts
      if (oldScript.src) {
        // External script - load it
        const promise = new Promise((resolve, reject) => {
          newScript.onload = resolve;
          newScript.onerror = reject;
        });
        scriptPromises.push(promise);
      } else {
        // Inline script - execute it
        newScript.textContent = oldScript.textContent;
      }
      
      // Replace the old script with the new one
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    
    // Wait for all external scripts to load
    await Promise.all(scriptPromises);
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
    }, 100);
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
  
  // Helper to reinitialize dropdowns if needed
  reinitializeDropdowns() {
    const dropdownScript = document.createElement('script');
    dropdownScript.textContent = `
      // Reinitialize dropdowns
      const dropdowns = document.querySelectorAll('.dropdown');
      
      function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (menu) menu.classList.remove('show');
        });
      }
      
      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
          // Remove existing listeners and add new ones
          const newToggle = toggle.cloneNode(true);
          toggle.parentNode.replaceChild(newToggle, toggle);
          
          newToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const isActive = dropdown.classList.contains('active');
            closeAllDropdowns();
            
            if (!isActive) {
              dropdown.classList.add('active');
              menu.classList.add('show');
            }
          });
        }
      });
      
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
          closeAllDropdowns();
        }
      });
    `;
    document.head.appendChild(dropdownScript);
  }
}

// Initialize and export loader
const loader = new ComponentLoader();
window.ComponentLoader = loader;
