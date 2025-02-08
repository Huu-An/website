const CLIENT_ID = "298892762962-ul9g91b1s2jb9ne2uobhl2te2h07n0br.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const URL_TOKEN = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.email%20https%3A//www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://127.0.0.1:5500/index.html&client_id=${CLIENT_ID}`;
const ROOT = "127.0.0.1:5500";

const checkLogin = () => {
  if (document.cookie != "") {
    window.location.href = "/";
  }
};

checkLogin();

const getToken = () => {
  const url = new URLSearchParams(window.location.hash.substring(1));
  const token = url.get("access_token");
  return token;
};

checkLogin();

const btns = document.querySelectorAll("button");
btns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const licenseBtn = document.querySelector("#btn-license");
    if (!licenseBtn.checked) {
      alert("Vui lòng đọc và đồng ý với điều khoản sử dụng của chúng tôi");
    } else {
      console.log(btn.id);
      if (btn.id == "btn-gg-login") {
        window.location.href = URL_TOKEN;
      } else if (btn.id == "btn-fb-login") {
        alert("Tính năng đang được bảo trì!");
      } else {
        alert("Tính năng đang được bảo trì!");
      }
    }
  })
});