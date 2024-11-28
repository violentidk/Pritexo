// Tooteandmete hoidmine
const productData = [];

// Vorm andmete lisamiseks
const addProductForm = document.getElementById("addProductForm");
const productTableBody = document.querySelector("#productTable tbody");

// Uue toote lisamine
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value.trim();
  const pricesInput = document.getElementById("productPrices").value.trim();
  const lastUpdated = new Date().toISOString().split("T")[0];

  // Töötleme hinnad (string -> objekt)
  const prices = pricesInput
    .split(",")
    .reduce((acc, curr) => {
      const [store, price] = curr.split(":");
      if (store && price) {
        acc[store.trim()] = parseFloat(price.trim());
      }
      return acc;
    }, {});

  // Lisame uue toote andmed
  const newProduct = { name, category, prices, lastUpdated };
  productData.push(newProduct);

  // Uuenda tabelit
  updateProductTable();
  addProductForm.reset();
});

// Toote tabeli värskendamine
function updateProductTable() {
  productTableBody.innerHTML = "";

  productData.forEach((product, index) => {
    const row = document.createElement("tr");

    // Leia kõige soodsam hind ja vastav pood
    const { cheapestStore, cheapestPrice } = findCheapestPrice(product.prices);

    // Loome tabelirea
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${formatPricesWithHighlight(product.prices, cheapestStore, cheapestPrice)}</td>
      <td>${product.lastUpdated}</td>
      <td>
        <button onclick="editProduct(${index})">Muuda</button>
        <button onclick="deleteProduct(${index})">Kustuta</button>
      </td>
    `;

    productTableBody.appendChild(row);
  });
}

// Hindade formaatimine koos esiletõstmisega
function formatPricesWithHighlight(prices, cheapestStore, cheapestPrice) {
  return Object.entries(prices)
    .map(([store, price]) => {
      const isCheapest = store === cheapestStore && price === cheapestPrice;
      return `<span style="background-color: ${isCheapest ? 'lightgreen' : 'transparent'}">${store}: €${price.toFixed(
        2
      )}</span>`;
    })
    .join(", ");
}

// Leia kõige odavam hind ja pood
function findCheapestPrice(prices) {
  let cheapestStore = null;
  let cheapestPrice = Infinity;

  for (const [store, price] of Object.entries(prices)) {
    if (price < cheapestPrice) {
      cheapestPrice = price;
      cheapestStore = store;
    }
  }

  return { cheapestStore, cheapestPrice };
}

// Toote muutmine
function editProduct(index) {
  const product = productData[index];

  // Täida vorm eelnevate andmetega
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrices").value = Object.entries(product.prices)
    .map(([store, price]) => `${store}:${price}`)
    .join(",");

  // Toote eemaldamine muutmiseks
  productData.splice(index, 1);
  updateProductTable();
}

// Toote kustutamine (koodiga 2009)
function deleteProduct(index) {
  const code = prompt("Sisesta kood toodete kustutamiseks:");
  if (code === "2009") {
    productData.splice(index, 1);
    updateProductTable();
  } else {
    alert("Vale kood! Toote kustutamine katkestatud.");
  }
}
