//Constantes globales para el contenedor de países, el input de búsqueda y el modal.
// y la instancia de Bootstrap Modal.
const countriesContainer = document.getElementById('countriesContainer');
const searchInput = document.getElementById('searchInput');
const modal = new bootstrap.Modal(document.getElementById('countryModal'));
// Variable global para almacenar todos los países.
// Se inicializa como un array vacío para evitar errores al intentar acceder a propiedades de undefined
let allCountries = [];
// Función para cargar todos los países desde la API y renderizarlos en el contenedor
async function fetchAllCountries() {
  try {// Se hace una petición a la API de países
    const res = await fetch('https://restcountries.com/v3.1/all');
    if (!res.ok) throw new Error('Error al cargar los países');
    const datosApi = await res.json();
    allCountries = datosApi;
    renderCountries(datosApi)
  } catch (error) {// Si hay un error, se muestra un mensaje de error en el contenedor
    countriesContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}
// Función para renderizar los países en el contenedor
// Se utiliza el método forEach para iterar sobre el array de países y crear un elemento HTML para cada uno
function renderCountries(allCountries) {
  countriesContainer.innerHTML = '';
  allCountries.forEach(country => {
    const { name, flags, region, population, cca3 } = country;
    const card = document.createElement('div');
    card.className = 'col-sm-6 col-md-4 col-lg-3';
    // Se utiliza el método innerHTML para crear el contenido HTML de la tarjeta
    // Se utiliza el método toLocaleString() para formatear la población con comas
    card.innerHTML = `
      <div class="card h-100" data-code="${cca3}" style="cursor:pointer;">
        <img src="${flags.svg}" class="card-img-top" alt="${name.common}">
        <div class="card-body">
          <h5 class="card-title">${name.official}</h5>
          <p class="card-text">
            <strong>Región:</strong> ${region}<br>
            <strong>Población:</strong> ${population.toLocaleString()}
          </p>
        </div>
      </div>
    `;
    // Se añade un evento click a la tarjeta para mostrar los detalles del país en el modal
    // Se utiliza el método addEventListener para añadir un evento click a la tarjeta
    card.addEventListener('click', () => showCountryDetails(cca3));
    // Se añade la tarjeta al contenedor de países
    // Se utiliza el método appendChild para añadir la tarjeta al contenedor de países
    countriesContainer.appendChild(card);
  });
}
// Se añade un evento input al input de búsqueda para filtrar los países
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (!query) {
    renderCountries(allCountries);
    return;
  }

  try {// Se hace una petición a la API de países con el nombre del país buscado
    // Se utiliza el método fetch para hacer una petición a la API de países con el nombre del país buscado
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    if (!res.ok) throw new Error('No se encontraron países');
    const datosApi = await res.json();
    renderCountries(datosApi);
  } catch (error) {// Si hay un error, se muestra un mensaje de error en el contenedor
    // Se utiliza el método innerHTML para crear un mensaje de error en el contenedor de países
    countriesContainer.innerHTML = `<div class="alert alert-warning">${error.message}</div>`;
  }
});
// Función para mostrar los detalles del país en el modal
// Se utiliza el método find para buscar el país en el array de países
async function showCountryDetails(code) {
    const country = allCountries.find(c => c.cca3 === code);
    if (!country) return;// Si no se encuentra el país, se sale de la función
    const {
      name, flags, capital, region, subregion, population,
      languages, currencies, borders = []
    } = country;
  
    // Idiomas
    const languagesStr = languages
      ? Object.values(languages).join(', ')
      : 'N/A';
  
    // Monedas
    const currenciesStr = currencies
      ? Object.values(currencies).map(curr => `${curr.name} (${curr.symbol})`).join(', ')
      : 'N/A';
  
    // Fronteras (nombres en lugar de códigos)
    const borderNames = borders.length
      ? borders
          .map(code => {// Se utiliza el método map para crear un nuevo array con los nombres de los países fronterizos
            const borderCountry = allCountries.find(c => c.cca3 === code);
            return borderCountry ? borderCountry.name.common : code;
          })
          .join(', ')
      : 'Ninguno';
  
    // Llenar el modal
    document.getElementById('countryModalLabel').textContent = `${name.official} (${name.common})`;
    // Se utiliza el método innerHTML para crear el contenido HTML del modal
    // Se utiliza el método toLocaleString() para formatear la población con comas
    document.getElementById('countryModalBody').innerHTML = `
      <div class="text-center mb-3">
      <!-- img-fluid es una clase de Bootstrap que hace que la imagen sea responsiva-->
        <img src="${flags.svg}" class="img-fluid" style="max-height: 150px;" alt="Bandera de ${name.common}">
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Nombre Oficial:</strong> ${name.official}</li>
        <li class="list-group-item"><strong>Nombre Común:</strong> ${name.common}</li>
        <li class="list-group-item"><strong>Capital:</strong> ${capital?.[0] || 'N/A'}</li>
        <li class="list-group-item"><strong>Región:</strong> ${region}</li>
        <li class="list-group-item"><strong>Subregión:</strong> ${subregion || 'N/A'}</li>
        <li class="list-group-item"><strong>Población:</strong> ${population.toLocaleString()}</li>
        <li class="list-group-item"><strong>Idiomas:</strong> ${languagesStr}</li>
        <li class="list-group-item"><strong>Moneda(s):</strong> ${currenciesStr}</li>
        <li class="list-group-item"><strong>Países Fronterizos:</strong> ${borderNames}</li>
      </ul>
    `;
    // Mostrar el modal
    // Se utiliza el método show() de la instancia de Bootstrap Modal para mostrar el modal
    modal.show();
  }
// Llamar a la función para cargar todos los países al cargar la página
fetchAllCountries();
