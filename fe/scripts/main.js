const ROOT = "127.0.0.1:5500";
const EXPIRE_TIME = 5;
const API_ROOT = "http://160.30.112.24:8000"

const getOAuthToken = () => {
  const url = new URLSearchParams(window.location.hash.substring(1));
  const token = url.get("access_token");
  return token;
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

const findProduct = (id) => {
  window.location.href = "/view-product.html";
};

document.querySelector("#btn-rent").addEventListener("click", () => {
  window.location.href = "/import.html";
});


document.querySelector("#btn-user-info").addEventListener("click", () => {
  window.location.href = "/info.html";
});
document.querySelector("#btn-cart").addEventListener("click", () => {
  window.location.href = "/cart.html";
});
document.querySelector("#menu-history").addEventListener("click", () => {
  window.location.href = "/history.html";
});