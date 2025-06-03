/**
 * Comprehensive auto-format selector for all Om mushroom products
 * - Automatically selects larger size option as default
 * - Auto-selects the corresponding format
 * - Works across all mushroom blends except Peppermint Hot Chocolate
 */
(function() {
    console.log('Comprehensive auto-format selector for all mushroom products loaded');
    
    // Configuration - product-specific mappings
    const productRules = [
      // Morning Blend products
      {
        productTypes: ['morning-blend', 'mushroom-morning-blend'],
        sizeFormats: [
          { sizePattern: '10', formatPattern: 'single|packet' },
          { sizePattern: '30', formatPattern: 'canister' }
        ],
        defaultSize: '30',
        defaultFormat: 'canister'
      },
      // Hot Chocolate Blend products
      {
        productTypes: ['hot-chocolate', 'chocolate-blend'],
        sizeFormats: [
          { sizePattern: '10', formatPattern: 'single|packet' },
          { sizePattern: '30', formatPattern: 'canister' }
        ],
        defaultSize: '30',
        defaultFormat: 'canister'
      },
      // Coffee Blend products
      {
        productTypes: ['coffee-blend', 'coffee', 'coffee-latte'],
        sizeFormats: [
          { sizePattern: '10', formatPattern: 'single|packet' },
          { sizePattern: '30', formatPattern: 'canister' }
        ],
        defaultSize: '30',
        defaultFormat: 'canister'
      },
      // Matcha Latte Blend products
      {
        productTypes: ['matcha', 'matcha-latte'],
        sizeFormats: [
          { sizePattern: '10', formatPattern: 'single|packet' },
          { sizePattern: '30', formatPattern: 'canister' }
        ],
        defaultSize: '30',
        defaultFormat: 'canister'
      },
      // Master Blend Protein products
      {
        productTypes: ['master-blend', 'protein', 'plant-protein'],
        sizeFormats: [
          { sizePattern: '10', formatPattern: 'single|packet' },
          { sizePattern: '16', formatPattern: 'pouch' }
        ],
        defaultSize: '16',
        defaultFormat: 'pouch'
      },
      // Fallback rule for any other mushroom product
      {
        productTypes: ['*'],
        sizeFormats: [
          { sizePattern: '10', formatPattern: 'single|packet' },
          { sizePattern: '30', formatPattern: 'canister' },
          { sizePattern: '16', formatPattern: 'pouch' }
        ],
        defaultSize: '30',
        defaultFormat: 'canister'
      }
    ];
    
    // Exclusion list - products to skip
    const excludedProducts = ['peppermint-hot-chocolate', 'limited-edition'];
    
    // Track state to prevent loops and unnecessary updates
    let isProcessingSelection = false;
    let lastSelectedSize = '';
    let hasInitialized = false;
    let hasSetDefaultSize = false;
    
    // Try to detect the product type from the page
    function detectProductType() {
      // Try from URL first
      const path = window.location.pathname.toLowerCase();
      
      // Check if this is an excluded product
      for (const excludedPattern of excludedProducts) {
        if (path.includes(excludedPattern)) {
          console.log('Excluded product detected, skipping auto-selection');
          return 'excluded';
        }
      }
      
      // Check page title
      const pageTitle = document.title.toLowerCase();
      if (pageTitle.includes('peppermint') || pageTitle.includes('limited edition')) {
        console.log('Excluded product detected in title, skipping auto-selection');
        return 'excluded';
      }
      
      // Check specific product handles in URL
      if (path.includes('master-blend') || path.includes('plant-protein')) {
        return 'master-blend';
      }
      if (path.includes('morning-blend')) {
        return 'morning-blend';
      }
      if (path.includes('hot-chocolate') || path.includes('chocolate-blend')) {
        return 'hot-chocolate';
      }
      if (path.includes('coffee')) {
        return 'coffee-blend';
      }
      if (path.includes('matcha')) {
        return 'matcha';
      }
      
      // Try from h1 or product title
      const h1Element = document.querySelector('h1');
      if (h1Element) {
        const h1Text = h1Element.textContent.toLowerCase();
        
        if (h1Text.includes('peppermint') || h1Text.includes('limited edition')) {
          console.log('Excluded product detected in H1, skipping auto-selection');
          return 'excluded';
        }
        
        if (h1Text.includes('master blend') || h1Text.includes('plant protein')) {
          return 'master-blend';
        }
        if (h1Text.includes('morning blend')) {
          return 'morning-blend';
        }
        if (h1Text.includes('hot chocolate') || h1Text.includes('chocolate blend')) {
          return 'hot-chocolate';
        }
        if (h1Text.includes('coffee')) {
          return 'coffee-blend';
        }
        if (h1Text.includes('matcha')) {
          return 'matcha';
        }
      }
      
      // Fallback - return generic type
      return '*';
    }
    
    // Find rules that apply to the current product
    function getApplicableRules() {
      const productType = detectProductType();
      console.log('Detected product type:', productType);
      
      if (productType === 'excluded') {
        return [];
      }
      
      return productRules.filter(rule => 
        rule.productTypes.includes('*') || rule.productTypes.includes(productType)
      );
    }
    
    // Debug function to print all radio inputs
    function debugRadioInputs() {
      console.log('--- All Radio Inputs ---');
      const allRadios = document.querySelectorAll('input[type="radio"]');
      
      // Group by name for clearer output
      const radiosByName = {};
      allRadios.forEach(radio => {
        if (!radiosByName[radio.name]) {
          radiosByName[radio.name] = [];
        }
        radiosByName[radio.name].push(radio);
      });
      
      // Log each group
      for (const [name, radios] of Object.entries(radiosByName)) {
        console.log(`Group: ${name}`);
        radios.forEach(radio => {
          console.log(`  Value: "${radio.value}", checked: ${radio.checked}`);
        });
      }
    }
    
    // Main initialization function
    function initAutoSelect() {
      // Don't run if we're already processing a selection
      if (isProcessingSelection) {
        return;
      }
      
      debugRadioInputs();
      
      const rules = getApplicableRules();
      if (rules.length === 0) {
        console.log('No applicable rules found for this product');
        return;
      }
      
      // Group all radio inputs by name/group
      const allInputs = document.querySelectorAll('input[type="radio"]');
      const inputGroups = {};
      
      allInputs.forEach(input => {
        const name = input.name || '';
        if (!inputGroups[name]) {
          inputGroups[name] = [];
        }
        inputGroups[name].push(input);
      });
      
      // Try to identify size and format groups
      let sizeInputs = [];
      let formatInputs = [];
      
      // First try by input name
      for (const [name, inputs] of Object.entries(inputGroups)) {
        const nameLower = name.toLowerCase();
        
        // Skip flavor options
        if (nameLower.includes('flavor') || 
            inputs.some(input => input.value.toLowerCase().includes('chocolate') || 
                              input.value.toLowerCase().includes('vanilla'))) {
          console.log(`Skipping flavor input group: ${name}`);
          continue;
        }
        
        if (nameLower.includes('size') || nameLower.includes('serv')) {
          sizeInputs = inputs;
          console.log(`Found size inputs by name: ${name}`);
        } else if (nameLower.includes('format') || nameLower.includes('type')) {
          formatInputs = inputs;
          console.log(`Found format inputs by name: ${name}`);
        }
      }
      
      // If we couldn't find by name, try by analyzing values
      if (sizeInputs.length === 0 || formatInputs.length === 0) {
        console.log('Trying to identify inputs by values...');
        
        for (const [name, inputs] of Object.entries(inputGroups)) {
          // Skip if we already found this group
          if ((sizeInputs.length > 0 && inputs[0].name === sizeInputs[0].name) ||
              (formatInputs.length > 0 && inputs[0].name === formatInputs[0].name)) {
            continue;
          }
          
          // Skip flavor options
          if (inputs.some(input => 
              input.value.toLowerCase().includes('chocolate') || 
              input.value.toLowerCase().includes('vanilla') ||
              input.value.toLowerCase().includes('creamy'))) {
            console.log(`Skipping likely flavor input group: ${name}`);
            continue;
          }
          
          // Check input values for size-related patterns
          const hasSizeValues = inputs.some(input => {
            const val = input.value.toLowerCase();
            return val.includes('servings') || 
                   val.match(/\b\d+\b\s*(servings|serving)/i) ||
                   val.match(/\b(10|16|30)\b/);
          });
          
          // Check input values for format-related patterns
          const hasFormatValues = inputs.some(input => {
            const val = input.value.toLowerCase();
            return val.includes('packet') || 
                   val.includes('pouch') || 
                   val.includes('canister') ||
                   val.includes('single serving');
          });
          
          if (sizeInputs.length === 0 && hasSizeValues) {
            sizeInputs = inputs;
            console.log(`Found size inputs by value patterns: ${name}`);
          } else if (formatInputs.length === 0 && hasFormatValues) {
            formatInputs = inputs;
            console.log(`Found format inputs by value patterns: ${name}`);
          }
        }
      }
      
      // Last resort - try to guess based on values containing numbers
      if (sizeInputs.length === 0 && formatInputs.length > 0) {
        for (const [name, inputs] of Object.entries(inputGroups)) {
          // Skip the format group we already found
          if (inputs[0].name === formatInputs[0].name) continue;
          
          // Skip flavor options
          if (inputs.some(input => 
              input.value.toLowerCase().includes('chocolate') || 
              input.value.toLowerCase().includes('vanilla'))) {
            continue;
          }
          
          // If values contain numbers like 10, 16, 30, it's likely the size group
          const hasNumericValues = inputs.some(input => 
            input.value.match(/\b(10|16|30)\b/)
          );
          
          if (hasNumericValues) {
            sizeInputs = inputs;
            console.log(`Found size inputs by numeric values: ${name}`);
            break;
          }
        }
      }
      
      if (sizeInputs.length === 0 || formatInputs.length === 0) {
        console.log('Could not identify size or format inputs');
        console.log('Available input groups:', Object.keys(inputGroups));
        return;
      }
      
      console.log(`Found ${sizeInputs.length} size inputs and ${formatInputs.length} format inputs`);
      
      // Set default size and format on initial page load
      if (!hasSetDefaultSize) {
        selectDefaultSizeAndFormat(sizeInputs, formatInputs, rules);
      }
      
      // Add change listeners to all size inputs (only once)
      if (!hasInitialized) {
        sizeInputs.forEach(input => {
          input.addEventListener('change', function() {
            if (this.checked && this.value !== lastSelectedSize) {
              lastSelectedSize = this.value;
              console.log(`Size changed to: "${this.value}"`);
              autoSelectFormat(this.value, formatInputs, rules);
            }
          });
        });
        hasInitialized = true;
        console.log('Initialized change listeners for size inputs');
      }
      
      // Check if a size is already selected
      const selectedSize = sizeInputs.find(input => input.checked);
      if (selectedSize && selectedSize.value !== lastSelectedSize) {
        lastSelectedSize = selectedSize.value;
        console.log(`Size already selected: "${selectedSize.value}"`);
        autoSelectFormat(selectedSize.value, formatInputs, rules);
      } else if (!selectedSize && !hasSetDefaultSize) {
        // If no size selected yet, select the default
        selectDefaultSizeAndFormat(sizeInputs, formatInputs, rules);
      }
    }
    
    // Function to select the default (larger) size and matching format
    function selectDefaultSizeAndFormat(sizeInputs, formatInputs, rules) {
      if (hasSetDefaultSize || isProcessingSelection) {
        return;
      }
      
      isProcessingSelection = true;
      hasSetDefaultSize = true;
      
      // Get the default size pattern from the first applicable rule
      const defaultSizePattern = rules[0].defaultSize || '30';
      const defaultFormatPattern = rules[0].defaultFormat || 'canister';
      console.log(`Should select default size matching: ${defaultSizePattern}`);
      console.log(`Should select default format matching: ${defaultFormatPattern}`);
      
      // Find the size option that matches the default pattern
      let defaultSizeInput = null;
      
      // First try to find direct match (e.g., "30 SERVINGS")
      defaultSizeInput = sizeInputs.find(input => 
        input.value.toLowerCase().includes(defaultSizePattern + ' serv')
      );
      
      // If not found, try more flexible matching
      if (!defaultSizeInput) {
        defaultSizeInput = sizeInputs.find(input => 
          input.value.toLowerCase().includes(defaultSizePattern)
        );
      }
      
      // If still not found, select the last option (usually the larger size)
      if (!defaultSizeInput && sizeInputs.length > 0) {
        defaultSizeInput = sizeInputs[sizeInputs.length - 1];
      }
      
      // Find the format option that matches the default pattern
      let defaultFormatInput = null;
      
      // Try to find a direct match
      defaultFormatInput = formatInputs.find(input => 
        input.value.toLowerCase().includes(defaultFormatPattern)
      );
      
      // If not found, try more flexible matching
      if (!defaultFormatInput) {
        defaultFormatInput = formatInputs.find(input => 
          new RegExp(defaultFormatPattern, 'i').test(input.value)
        );
      }
      
      // First select the size
      if (defaultSizeInput) {
        console.log(`Setting default size to: "${defaultSizeInput.value}"`);
        defaultSizeInput.checked = true;
        lastSelectedSize = defaultSizeInput.value;
        
        // Then select the format
        if (defaultFormatInput) {
          console.log(`Setting default format to: "${defaultFormatInput.value}"`);
          defaultFormatInput.checked = true;
          
          // Dispatch events in the right order - size first, then format
          const sizeEvent = new Event('change', { bubbles: true });
          const formatEvent = new Event('change', { bubbles: true });
          
          defaultSizeInput.dispatchEvent(sizeEvent);
          setTimeout(() => {
            defaultFormatInput.dispatchEvent(formatEvent);
          }, 100);
        } else {
          console.log('Could not find a default format option to select');
        }
      } else {
        console.log('Could not find a default size option to select');
      }
      
      setTimeout(() => {
        isProcessingSelection = false;
      }, 500);
    }
    
    // Function to select the corresponding format
    function autoSelectFormat(sizeValue, formatInputs, rules) {
      // Prevent re-entry while processing
      if (isProcessingSelection) {
        console.log('Already processing a selection, skipping');
        return;
      }
      
      isProcessingSelection = true;
      console.log('Starting format selection process');
      
      // Convert size value to lowercase for matching
      const sizeLower = sizeValue.toLowerCase();
      let formatPattern = null;
      
      // Log the size value for debugging
      console.log('Matching format for size value:', sizeLower);
      
      // Find the matching rule
      for (const rule of rules) {
        for (const mapping of rule.sizeFormats) {
          const sizePattern = mapping.sizePattern.toLowerCase();
          if (sizeLower.includes(sizePattern)) {
            formatPattern = mapping.formatPattern;
            console.log(`Matched rule: Size pattern "${sizePattern}" → Format pattern "${formatPattern}"`);
            break;
          }
        }
        if (formatPattern) break;
      }
      
      if (!formatPattern) {
        console.log(`No matching format pattern for size: ${sizeLower}`);
        isProcessingSelection = false;
        return;
      }
      
      // Check if the correct format is already selected
      const currentFormat = formatInputs.find(input => input.checked);
      if (currentFormat) {
        console.log('Current format:', currentFormat.value);
        if (new RegExp(formatPattern, 'i').test(currentFormat.value)) {
          console.log(`Correct format already selected: ${currentFormat.value}`);
          isProcessingSelection = false;
          return;
        }
      }
      
      // Find and select the matching format input
      console.log('Looking for format matching pattern:', formatPattern);
      let matched = false;
      
      for (const input of formatInputs) {
        console.log(`Checking format: "${input.value}"`);
        if (new RegExp(formatPattern, 'i').test(input.value)) {
          console.log(`Selecting format: "${input.value}"`);
          input.checked = true;
          
          // Dispatch a single change event
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
          
          matched = true;
          break; // Select only the first matching format
        }
      }
      
      if (!matched) {
        console.log(`Could not find a format matching pattern: ${formatPattern}`);
        console.log('Available format values:', formatInputs.map(input => input.value).join(', '));
      }
      
      // Release the processing lock after a delay
      setTimeout(() => {
        isProcessingSelection = false;
        console.log('Format selection process complete');
      }, 500);
    }
    
    // Set up initialization
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM content loaded, initializing');
        initAutoSelect();
      });
    } else {
      console.log('Document already loaded, initializing immediately');
      initAutoSelect();
    }
    
    // Handle variant changes with debounce
    let variantChangeTimer;
    document.addEventListener('variant:changed', function() {
      console.log('Variant changed event detected');
      clearTimeout(variantChangeTimer);
      variantChangeTimer = setTimeout(function() {
        console.log('Processing variant change');
        hasSetDefaultSize = false;  // Reset default size flag on variant change
        initAutoSelect();
      }, 300);
    });
    
    // Secondary initialization after a delay
    setTimeout(function() {
      console.log('Delayed initialization starting');
      initAutoSelect();
    }, 1000);
    
    // Watch for DOM changes with debounce
    let mutationTimer;
    const formElement = document.querySelector('form[action*="/cart/add"]');
    if (formElement && window.MutationObserver) {
      console.log('Setting up MutationObserver');
      const observer = new MutationObserver(function(mutations) {
        let shouldReinitialize = false;
        
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldReinitialize = true;
          }
        });
        
        if (shouldReinitialize) {
          console.log('DOM mutation detected');
          clearTimeout(mutationTimer);
          mutationTimer = setTimeout(() => {
            if (!isProcessingSelection) {
              console.log('Processing DOM mutation');
              initAutoSelect();
            } else {
              console.log('Skipping DOM mutation processing (already selecting)');
            }
          }, 300);
        }
      });
      
      observer.observe(formElement, { childList: true, subtree: true });
    }
  })();