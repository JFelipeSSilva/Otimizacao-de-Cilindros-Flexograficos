const STORAGE_KEY = 'cylinders';

const elements = {
  newZ: document.getElementById('newZ'),
  newQty: document.getElementById('newQty'),
  addCylinderBtn: document.getElementById('addCylinderBtn'),
  cylinderList: document.getElementById('cylinderList'),
  cylinderListTitle: document.getElementById('cylinderListTitle'),
  height: document.getElementById('height'),
  width: document.getElementById('width'),
  colors: document.getElementById('colors'),
  calculateBtn: document.getElementById('calculateBtn'),
  message: document.getElementById('message'),
  results: document.getElementById('results'),
  resultsBody: document.getElementById('resultsBody')
};

let cylinders = [];

function parseCylinders(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadCylinders() {
  const stored = localStorage.getItem(STORAGE_KEY);
  cylinders = stored ? parseCylinders(stored) : [];
  renderCylinderList();
}

function saveCylinders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cylinders));
}

function showMessage(text) {
  elements.message.textContent = text;
  elements.message.classList.remove('hidden');
}

function hideMessage() {
  elements.message.textContent = '';
  elements.message.classList.add('hidden');
}

function hideResults() {
  elements.results.classList.add('hidden');
}

function showResults() {
  elements.results.classList.remove('hidden');
}

function renderCylinderList() {
  const { cylinderList, cylinderListTitle } = elements;
  cylinderList.innerHTML = '';

  if (cylinders.length === 0) {
    cylinderListTitle.classList.add('hidden');
    const placeholder = document.createElement('li');
    placeholder.className = 'text-secondary p-3 rounded bg-soft';
    placeholder.textContent = 'Nenhum cilindro em estoque. Cadastre um cilindro para começar.';
    cylinderList.appendChild(placeholder);
    return;
  }

  cylinderListTitle.classList.remove('hidden');
  const sortedCylinders = [...cylinders].sort((a, b) => a.z - b.z);

  sortedCylinders.forEach((cyl, index) => {
    const row = document.createElement('li');
    row.className = 'flex justify-between items-center bg-surface-alt p-2 rounded shadow-sm';

    const label = document.createElement('span');
    label.className = 'text-app';
    label.textContent = `Z: ${cyl.z}, Qtd: ${cyl.qty}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-danger px-2 py-1 rounded';
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => deleteCylinder(index));

    row.append(label, deleteButton);
    cylinderList.appendChild(row);
  });
}

function addCylinder() {
  const z = parseInt(elements.newZ.value, 10);
  const qty = parseInt(elements.newQty.value, 10);

  if (z > 0 && qty > 0) {
    cylinders.push({ z, qty });
    saveCylinders();
    renderCylinderList();
    elements.newZ.value = '';
    elements.newQty.value = '';
  } else {
    alert('Valores inválidos. Z e Quantidade devem ser maiores que 0.');
  }
}

function deleteCylinder(index) {
  cylinders.splice(index, 1);
  saveCylinders();
  renderCylinderList();
}

function calculate() {
  const height = parseFloat(elements.height.value);
  const width = parseFloat(elements.width.value);
  const colors = parseInt(elements.colors.value, 10);

  if (!height || !width || height <= 0 || width <= 0) {
    alert('Altura e Largura devem ser maiores que 0.');
    return;
  }

  elements.resultsBody.innerHTML = '';
  hideMessage();
  hideResults();

  const validCylinders = cylinders.filter(cyl => cyl.qty >= colors);
  if (validCylinders.length === 0) {
    showMessage('Nenhuma opção válida encontrada.');
    return;
  }

  const results = validCylinders.map(cyl => {
    const diameter = cyl.z * 3.175;
    const minRepetitions = Math.floor(diameter / (height + 3));
    const maxRepetitions = Math.ceil(diameter / (height + 2));
    let efficientR = null;
    let efficientG = null;

    for (let repetitions = Math.max(1, minRepetitions); repetitions <= maxRepetitions; repetitions++) {
      const gap = (diameter / repetitions) - height;
      if (gap >= 2.0 && gap <= 3.0) {
        efficientR = repetitions;
        efficientG = gap;
        break;
      }
    }

    let repetitions;
    let gap;
    let status;
    let statusClass;

    if (efficientR !== null) {
      repetitions = efficientR;
      gap = efficientG;
      status = 'EFICIENTE';
      statusClass = 'text-success';
    } else {
      const target = height + 2.5;
      const rApprox = Math.max(1, Math.round(diameter / target));
      repetitions = rApprox;
      gap = (diameter / repetitions) - height;
      status = 'INSUFICIENTE/DESPERDÍCIO';
      statusClass = 'text-error';
    }

    return {
      z: cyl.z,
      repetitions,
      gap,
      status,
      statusClass,
      idealScore: (status === 'EFICIENTE' ? 0 : 1) + Math.abs(gap - 2.5) / 10
    };
  });

  results.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'EFICIENTE' ? -1 : 1;
    }
    return a.idealScore - b.idealScore;
  });

  results.forEach(result => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-2 whitespace-nowrap">${result.z}</td>
      <td class="px-4 py-2 whitespace-nowrap">${result.repetitions}</td>
      <td class="px-4 py-2 whitespace-nowrap">${result.gap.toFixed(1)} mm</td>
      <td class="px-4 py-2 whitespace-nowrap ${result.statusClass} font-semibold">${result.status}</td>
    `;
    elements.resultsBody.appendChild(row);
  });

  showResults();
}

elements.addCylinderBtn.addEventListener('click', addCylinder);
elements.calculateBtn.addEventListener('click', calculate);

loadCylinders();
