let productData = [
  {
    name: "Kodune hakkliha 500 g MAKS & MOORITS",
    category: "Liha-ja kalatooted",
    prices: { Rimi: 2.99, Coop: 3.55, Selver: 3.55, Prisma: 3.55 },
    lastUpdated: "2024-11-28"
  },
  {
    name: "Seahakkliha 500 g MAKS & MOORITS",
    category: "Liha-ja kalatooted",
    prices: { Rimi: 3.49, Selver: 2.89, Prisma: 3.19 },
    lastUpdated: "2024-11-28"
  }
];

// Tabeli täitmine
function populateTable() {
  const tableBody = document.querySelector("#productTable tbody");
  tableBody.innerHTML = ""; // Tühjenda enne täitmist

  productData.forEach((product, index) => {
    const row = document.createElement("tr");

    // Toote nimi
    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;
    row.appendChild(nameCell);

    // Kategooria
    const categoryCell = document.createElement("td");
    categoryCell.textContent = product.category;
    row.appendChild(categoryCell);

    // Hinnad
    const pricesCell = document.createElement("td");
    pricesCell.innerHTML = Object.entries(product.prices)
      .map(([store, price]) => `<strong>${store}:</strong> €${price}`)
      .join("<br>");
    row.appendChild(pricesCell);

    // Viimati uuendatud
    const lastUpdatedCell = document.createElement("td");
    lastUpdatedCell.textContent = product.lastUpdated;
    row.appendChild(lastUpdatedCell);

    // Tegevuste nupud
    const actionsCell = document.createElement("td");

    // Muuda nupp
    const editButton = document.createElement("button");
    editButton.textContent = "Muuda";
    editButton.onclick = () => editProduct(index);
    actionsCell.appendChild(editButton);

    // Kustuta nupp
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Kustuta";
    deleteButton.onclick = () => deleteProduct(index);
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });
}

// Toote lisamine
document.querySelector("#addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#productName").value.trim();
  const category = document.querySelector("#productCategory").value.trim();
  const pricesInput = document.querySelector("#productPrices").value.trim();
  const prices = {};

  if (pricesInput) {
    pricesInput.split(",").forEach(pair => {
      const [store, price] = pair.split(":");
      if (store && price) {
        prices[store.trim()] = parseFloat(price.trim());
      }
    });
  }

  productData.push({
    name,
    category,
    prices,
    lastUpdated: new Date().toISOString().split("T")[0]
  });

  populateTable();
  e.target.reset(); // Tühjenda vorm
});

// Toote muutmine
function editProduct(index) {
  const product = productData[index];
  const name = prompt("Sisesta uus nimi:", product.name);
  const category = prompt("Sisesta uus kategooria:", product.category);
  const prices = prompt("Sisesta uued hinnad (nt Coop:1.99,Selver:2.99):");

  if (name) product.name = name;
  if (category) product.category = category;
  if (prices) {
    const pricesObj = {};
    prices.split(",").forEach(pair => {
      const [store, price] = pair.split(":");
      if (store && price) {
        pricesObj[store.trim()] = parseFloat(price.trim());
      }
    });
    product.prices = pricesObj;
  }
  product.lastUpdated = new Date().toISOString().split("T")[0];
  populateTable();
}

// Toote kustutamine (küsib koodi)
function deleteProduct(index) {
  const code = prompt("Kustutamiseks sisesta kood:");
  if (code === "2009") {
    productData.splice(index, 1);
    populateTable();
  } else {
    alert("Vale kood!");
  }
}

// Esialgne tabeli täitmine
populateTable();
