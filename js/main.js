
const apiKey = "9a9d22a4335c88ec9a4be4940eb15af9";
// API para buscar bandeiras dos países - usando flagcdn.com (mais confiável)
const apiCountryURL = "https://flagcdn.com/w40/";
// API key do Unsplash para buscar imagens específicas da cidade
// Access Key para produção - Application ID: 826888
// STATUS: Em review - aguardando aprovação
// IMPORTANTE: A Secret Key NÃO deve ser exposta no frontend (JavaScript)
// Apenas a Access Key é usada no código cliente
const unsplashApiKey = "V841kwW49RsdTQ3ELHODTqRd4CXZ1Eb5bucs1nTvkM";

// OPÇÃO TEMPORÁRIA: Pexels API (gratuita e rápida de obter)
// 1. Acesse: https://www.pexels.com/api/
// 2. Crie uma conta gratuita
// 3. Copie sua API key e cole abaixo
// Vantagem: Aprovação instantânea, sem espera de review
const pexelsApiKey = "K4DAIUPWM63Tv9caBVfVDJ7SppeXjjBhUHcpqPeGA1vERc8ecdZrkQpJ"; // Cole sua API key do Pexels aqui

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Função para mudar o background baseado na cidade
const changeBackgroundImage = async (city) => {
  try {

    
    // Prioridade 1: Pexels API (enquanto Unsplash está em review)
    // Pexels tem aprovação instantânea e funciona imediatamente
    // NOTA: A precisão depende das tags que os fotógrafos colocam nas imagens
    // Por isso, fazemos múltiplas buscas com termos mais específicos
    if (pexelsApiKey && pexelsApiKey.trim() !== "") {
      try {
        const cityName = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Estratégias de busca para melhor precisão:
        // 1. Busca específica da cidade + termos relacionados
        // 2. Buscar múltiplos resultados e escolher o melhor
        // 3. Tentar diferentes variações da query
        
        const searchQueries = [
          `${cityName} city landscape`,           // Busca direta
          `${cityName} city skyline`,             // Se for cidade grande
          `${cityName} city view`,                // Vista da cidade
          `${cityName} landscape`,                // Paisagem da cidade
          `${cityName}`,                          // Apenas o nome da cidade
        ];
        
       
        
        // Tentar cada query até encontrar resultados
        for (const query of searchQueries) {
          const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
          
          try {
            const response = await fetch(pexelsUrl, {
              headers: {
                'Authorization': pexelsApiKey
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.photos && data.photos.length > 0) {
                // Usar a primeira imagem (mais relevante da busca)
                // Pexels ordena por relevância
                const photo = data.photos[0];
                const imageUrl = photo.src.large2x || photo.src.large || photo.src.medium;
                

                
                // Criar um objeto Image para verificar se carrega
                const img = new Image();
                let imageLoaded = false;
                
                img.onload = function() {
                  if (!imageLoaded) {
                    imageLoaded = true;
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                    document.body.style.backgroundRepeat = "no-repeat";
                  }
                };
                img.onerror = function() {
                  console.warn("⚠️ Imagem do Pexels não carregou, tentando próxima query...");
                  // Continuar para próxima iteração
                  return;
                };
                img.src = imageUrl;
                
                // Aguardar um pouco para ver se a imagem carrega
                await new Promise(resolve => setTimeout(resolve, 500));
                
                if (imageLoaded) {
                  return; // Sucesso, sair da função
                }
              }
            } else {
     
            }
          } catch (error) {
            console.warn(`⚠️ Erro ao buscar com query "${query}":`, error);
            continue; // Tentar próxima query
          }
        }
        
        // Se nenhuma query funcionou, avisar
        console.warn("⚠️ Nenhuma imagem específica encontrada no Pexels para:", cityName);
        
      } catch (error) {

      }
    }
    
    // Prioridade 2: Usar API do Unsplash (quando aprovada)
    // Isso retorna imagens específicas da cidade pesquisada
    tryUnsplashOrFallback(city);
    
  } catch (error) {
    console.error("❌ Erro geral ao carregar imagem de background:", error);
    // Fallback final: usar imagem padrão local
    document.body.style.backgroundImage = `url(/img/bg-weather.jpg)`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
};

// Função auxiliar para tentar Unsplash ou usar fallback
const tryUnsplashOrFallback = async (city) => {
  if (unsplashApiKey && unsplashApiKey.trim() !== "") {
      // Formatando a query para buscar imagens da cidade
      // Removendo acentos e caracteres especiais para melhor busca
      const cityName = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const queryString = `${cityName} city`;
      // Usando client_id para API pública do Unsplash
      const backgroundUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(queryString)}&orientation=landscape&client_id=${unsplashApiKey}`;
      
      try {

        
        const response = await fetch(backgroundUrl);
        
        if (response.ok) {
          const imageData = await response.json();

          
          if (imageData.urls) {
            // Priorizar imagem full, depois regular, depois small
            const imageUrl = imageData.urls.full || imageData.urls.regular || imageData.urls.small;
            
            if (imageUrl) {
              // Criar um objeto Image para verificar se a imagem carrega
              const img = new Image();
              img.onload = function() {
                document.body.style.backgroundImage = `url(${imageUrl})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundRepeat = "no-repeat";
              };
              img.onerror = function() {
                console.warn("⚠️ Imagem do Unsplash não carregou, usando fallback");
                useFallbackImage(city);
              };
              img.src = imageUrl;
              return;
            } else {
            }
          } else {

          }
        } else {
          // Se a resposta não for OK, mostrar o erro
          const errorText = await response.text();
          console.error("❌ Erro na resposta do Unsplash:", response.status, response.statusText);
          console.error("📝 Detalhes:", errorText);
          
          // Tentar parsear como JSON se possível
          try {
            const errorData = JSON.parse(errorText);
            console.error("📋 Detalhes do erro (JSON):", errorData);
          } catch (e) {
            // Não é JSON, apenas texto
          }
        }
      } catch (error) {
        console.error("❌ Erro ao buscar imagem do Unsplash:", error);
        console.error("📝 Mensagem:", error.message);
      }
    }
  
  // Se Unsplash falhar ou não estiver configurado, usar fallback
  useFallbackImage(city);
};

// Função auxiliar para usar imagem de fallback
const useFallbackImage = async (city) => {
  console.log("🔄 Usando fallback para:", city);
  
  // Tentar usar Pexels API (gratuita, sem necessidade de API key para algumas requisições)
  // Mas como Pexels também requer API key, vamos usar uma abordagem diferente
  
  // Tentar usar Unsplash Source (descontinuado mas ainda funciona em alguns casos)
  // ou usar uma API pública alternativa
  
  // Por enquanto, usar Picsum Photos com seed baseado na cidade
  // Isso garante que a mesma cidade sempre retorne a mesma imagem
  const cityHash = city.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Usar um número maior para melhor distribuição de imagens
  const seed = Math.abs(cityHash) % 1000;
  const picsumUrl = `https://picsum.photos/seed/${seed}/1920/1080`;
  
  // Criar um objeto Image para verificar se carrega
  const img = new Image();
  img.onload = function() {
    document.body.style.backgroundImage = `url(${picsumUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  
  };
  img.onerror = function() {
    // Se Picsum falhar, usar imagem padrão local
    document.body.style.backgroundImage = `url(/img/bg-weather.jpg)`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

  };
  img.src = picsumUrl;
};

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");

  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  // Buscar bandeira do país usando o código ISO do país
  const countryCode = data.sys.country.toLowerCase();
  // Usando flagcdn.com (mais confiável) ou alternativas como flagsapi.com
  const flagUrl = `${apiCountryURL}${countryCode}.png`;
  countryElement.setAttribute("src", flagUrl);
  countryElement.setAttribute("alt", `Bandeira de ${data.sys.country}`);
  countryElement.setAttribute("title", `Bandeira de ${data.sys.country}`);
  
  // Fallback caso a imagem não carregue
  countryElement.onerror = function() {
    console.warn("Erro ao carregar bandeira, tentando alternativa...");
    // Tentar alternativa: flagsapi.com
    this.src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
    // Se ainda falhar, tentar outra alternativa
    this.onerror = function() {
      this.src = `https://countryflagsapi.com/png/${data.sys.country}`;
    };
  };
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change background image based on city
  // Usar o nome da cidade retornado pela API (mais confiável)
  const cityName = data.name || city;
  changeBackgroundImage(cityName);

  weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});
