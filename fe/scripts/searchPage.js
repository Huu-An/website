const ROOT = "127.0.0.1:5500";
const EXPIRE_TIME = 1;
const API_ROOT = "http://157.66.81.167:8000"

const getOAuthToken = () => {
  const url = new URLSearchParams(window.location.hash.substring(1));
  const token = url.get("access_token");
  return token;
};

const getQuery = () => {
  const url = new URLSearchParams(window.location.search.substring(1));
  const query = url.get("query");
  return query;
};

const checkAuthen = () => {
  if (document.cookie == "") {
    window.location.href = "/login.html";
  }
};

const getAccessToken = async (user) => {
  const URL = `${API_ROOT}/users/login`;
  console.log(user)
  console.log(JSON.stringify({
    username: user.email,
    password: user.email,
    is_google: true,
  }))
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      username: user.email,
      password: user.email,
      is_google: true,
    }),
    headers: {
      'Accept': 'application/json',
      "Content-type": "application/json; charset=UTF-8"
    }
  });

  const data = await response.json();
  console.log(data)
  if (data.data.access_token) {
    // save token
    const now = new Date();
    const expireTime = new Date(now.getTime() + EXPIRE_TIME * 60000).toUTCString();
    const cookieTemplate = `token=${data.data.access_token}; expires=${expireTime};`;
    document.cookie = cookieTemplate;
    document.location.href = "/";
  }
};

const login = async (access_token) => {
  const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`;
  const response = await fetch(url).then((data) => data.json()).then((json) => getAccessToken(json));
}

if (document.cookie == "" || document.cookie == null) {
  const ggToken = getOAuthToken();
  if (ggToken) {
    login(ggToken);
  }
};

const btnUserInfo = document.querySelector("#btn-user-info");
btnUserInfo.addEventListener("click", (e) => {
  checkAuthen();
});

const btnCart = document.querySelector("#btn-cart");
btnCart.addEventListener("click", (e) => {
  checkAuthen();
});

const btnSearch = document.querySelector("#btn-search");
const inputSearch = document.querySelector("#input-search");
const searchContent = inputSearch.value;

const query = getQuery();
const getProducts = async (searchText, sortBy, order) => {
  const API_ENDPOINT = `${API_ROOT}/rent/list?text=${searchText}&sort_by=${sortBy}&order=${order}`;
  const response = await fetch(API_ENDPOINT,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      }
    }
  );

  const data = await response.json();
  if (data.data.length != 0) {
    data.data.forEach((product) => {
      const id = product.id;
      const imgURL = product.images[0];
      const rentPrice = product.rent_price[0].price;
      const formattedRentPrice = Intl.NumberFormat();
      const name = product.title;
      const template = `
        <div class="card card-custom border border-0 px-0" style="max-width: 350px;">
              <div class="row-fluid d-flex justify-content-center img-card">
                <img
                  src="https://s3-alpha-sig.figma.com/img/ad7b/c365/6c4f0e652bf823a17c9a06c674b2bccb?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=aV80iV-jvosoH0BIhJVaeQ6pncqwacBZIcbOj8GUiFPjJY1Ip8wqPzPCxUgCmd-3U2ZC-3s6SCpm7loybXPLMitaeAg0AkH8h7ly0ukbgC2GSjiTiSpiqhm6f13674ALSrDb2N26gL8CbkZXlqRVumhYptdHl5hw1pxkymgzfjmhwR4H4oSk2HJGMNQNY1-8YEI2dSgmDase0xocqSyyvWxfoU197B0QbBB6nLJKySpzBvJKrWRpxnBXWJkfoGnbo50Vx8EJ-vD-EMaqUgTdPI2o7oxEoRHeGiCA0o2fO8WSoQUAZoqVRA7LBm9VnkMonszTUGo5NbqrDGDJveUmgQ__"
                  class="card-img-top" alt="iPhone 15 Pro" style="width: 100%; height: auto;">
                <div class="image-overlay">
                  <span class="heart-icon">
                    <i class="fa fa-heart" aria-hidden="true" style="color: #FF7264;"></i>
                    <i class="fa fa-heart" aria-hidden="true" style="color: #FF7264;"></i>
                    <i class="fa fa-heart" aria-hidden="true" style="color: #FF7264;"></i>
                    <i class="fa fa-heart" aria-hidden="true" style="color: #FF7264;"></i>
                    <i class="fa fa-heart" aria-hidden="true" style="color: #FF7264;"></i>
                  </span>
                  <i class="fa fa-bookmark-o bookmark-icon" style="font-size: 25px; font-weight: 800;"
                    aria-hidden="true"></i>
                  <input type="checkbox" name="${id}" class="checkbox-round">
                </div>
              </div>
              <div class="card-body p-1 mt-1">
                <h6 class="card-title">${name}</h6>
                <p class="price" style="color: #0345E4;">${formattedRentPrice.format(rentPrice)}₫/day</p>
              </div>
            </div>`;
      const displayMatchedProduct = document.querySelector("#matched-products");
      displayMatchedProduct.innerHTML += template;
    });
  } else {
    const displayMatchedProduct = document.querySelector("#matched-products");
    displayMatchedProduct.innerHTML += `<h3>Không tìm thấy kết quả phù hợp!</h3>`;
  }
};

if (query) {
  const readableQuery = query;
  inputSearch.value = readableQuery;
  const displaySearchQuery = document.querySelector("#search-query");
  displaySearchQuery.textContent = `"${query}"`;
  getProducts(query, "created_at", "desc");
}

inputSearch.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (inputSearch.value != "") {
      const searchContent = inputSearch.value;
      window.location.href = `/search-result.html?query=${searchContent}`;
    } else {
      alert("Vui lòng không bỏ trống nội dung tìm kiếm");
    }
  }
});

btnSearch.addEventListener("click", (e) => {
  if (inputSearch.value != "") {
    const searchContent = inputSearch.value;
    window.location.href = `/search-result.html?query=${searchContent}`;
  } else {
    alert("Vui lòng không bỏ trống nội dung tìm kiếm");
  }
});