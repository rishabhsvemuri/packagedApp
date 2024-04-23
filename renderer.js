const rButton = document.getElementById('rbtn')
const plotList = document.getElementById('plotList')
const plotInput = document.getElementById('plotInput')
const addPlot = document.getElementById('addPlot')
const path = document.getElementById('path')

window.electronAPI.onItemAdded((newItem) => {
  const itemId = `item-${Date.now()}`; // Generate a unique ID for the item
  const li = document.createElement('li');
  li.setAttribute('id', itemId);
  li.textContent = newItem;
  createCategoryDropdown(itemId, li);
  plotList.appendChild(li);
});

window.electronAPI.onRefreshPDF ((savePath)=> {
  document.getElementById('pdf').setAttribute('src',savePath);
});

path.addEventListener('blur', () => {
  const pathText = path.value;
  window.electronAPI.savePath(pathText);
})

rButton.addEventListener('click', () => {
    window.electronAPI.runScript()
})

addPlot.addEventListener('click', () => {
  newInput = plotInput.value;
  window.electronAPI.addItem(newInput)
  plotInput.value = '';
})

function createCategoryDropdown(itemId, li) {
  const categories = ['Select One', 'plot', 'barplot'];
  const dropdown = document.createElement('select');
  dropdown.classList.add('category-dropdown');
  dropdown.dataset.itemId = itemId;
  categories.forEach(category => {
      const option = document.createElement('option');
      option.textContent = category;
      dropdown.appendChild(option);
  });
  li.appendChild(dropdown);

  dropdown.addEventListener('change', (event) => {
      const selectedItem = event.target.dataset.itemId;
      const selectedCategory = event.target.value;
      var fields;
      switch(selectedCategory) {
        case 'plot':
          if (li.childElementCount == 2) {
            li.removeChild(li.lastChild);
          }
          window.electronAPI.updateCategory(selectedItem, selectedCategory, itemId);
          fields = createPFields(itemId);
          li.appendChild(fields);
          break;
        case 'barplot':
          if (li.childElementCount == 2) {
            li.removeChild(li.lastChild);
          }
          window.electronAPI.updateCategory(selectedItem, selectedCategory, itemId);
          fields = createBPFields(itemId);
          li.appendChild(fields);
          break;
        default:
          break;
      }
  });
  return dropdown;
}

function createPFields(itemId) {
  const container = document.createElement('div');
  container.classList.add('plot-fields');
  container.dataset.itemId = itemId;

  const xCoord = document.createElement('input');
  xCoord.setAttribute('type', 'text');
  xCoord.setAttribute('placeholder', 'x coordinate');
  container.appendChild(xCoord);
  xCoord.addEventListener('blur', (event) => {
    window.electronAPI.updateItemValue(itemId, 'x', xCoord.value);
  });

  const yCoord = document.createElement('input');
  yCoord.setAttribute('type', 'text');
  yCoord.setAttribute('placeholder', 'y coordinate');
  container.appendChild(yCoord);
  yCoord.addEventListener('blur', (event) => {
    window.electronAPI.updateItemValue(itemId, 'y', yCoord.value);
  });
  return container;
}

function createBPFields(itemId) {
  const container = document.createElement('div');
  container.classList.add('plot-fields');
  container.dataset.itemId = itemId;

  const xCoord = document.createElement('input');
  xCoord.setAttribute('type', 'text');
  xCoord.setAttribute('placeholder', 'x coordinate');
  container.appendChild(xCoord);
  xCoord.addEventListener('blur', (event) => {
    window.electronAPI.updateItemValue(itemId, 'x', xCoord.value);
  });

  const yCoord = document.createElement('input');
  yCoord.setAttribute('type', 'text');
  yCoord.setAttribute('placeholder', 'y coordinate');
  container.appendChild(yCoord);
  yCoord.addEventListener('blur', (event) => {
    window.electronAPI.updateItemValue(itemId, 'y', yCoord.value);
  });
  return container;
}
